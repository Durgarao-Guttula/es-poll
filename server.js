const path = require('path');
const os = require('os');
const crypto = require('crypto');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const { customAlphabet } = require('nanoid');
const sessions = require('./sessions');

const makeRoomCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 5);
const PORT = process.env.PORT || 3000;

// Where students should go. Online (e.g. Render) that is simply the address the teacher used.
// On a laptop the teacher uses localhost, which phones can't reach, so use the machine's
// current LAN IP — detected fresh each call so it's right even if the network changes.
function getLanUrl(req) {
  if (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(req.get('host') || '')) {
    return `${req.protocol}://${req.get('host')}`;
  }
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return `${req.protocol}://${net.address}:${PORT}`;
      }
    }
  }
  return `${req.protocol}://${req.get('host')}`;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Behind Render's proxy, so req.protocol reports https and the QR code links to https.
app.set('trust proxy', true);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory room state. Rooms are ephemeral by design — no DB needed for classroom use.
const rooms = new Map();

function createRoom() {
  let code;
  do {
    code = makeRoomCode();
  } while (rooms.has(code));

  const room = {
    code,
    // Only the browser that created the room holds this, so a student who types /host/CODE
    // (the code is on the projector) cannot run the quiz or read the responses.
    hostKey: crypto.randomBytes(18).toString('hex'),
    session: null, // { id, title, questions }
    qIndex: -1,
    isRevealed: false,
    round: 1, // 2 once the host has opened a discuss-and-revote
    questionOpenedAt: 0,
    answers: new Map(), // playerId -> { value, ms, conf }, for the current round
    hidden: new Set(), // playerIds whose text response the host has hidden
    firstAnswers: null, // round-1 answers, kept once a revote opens
    finalAnswers: null, // what was scored at reveal
    timer: null, // { endsAt, durationMs, handle } while a countdown runs
    closed: false, // true once a countdown has run out: no more answers this round
    players: new Map(), // playerId -> { id, token, score, timeMs, answered, lastRank }
    tokens: new Map(), // secret token -> player, so a refresh keeps the same ID
    finished: false,
  };
  rooms.set(code, room);
  return room;
}

function getRoom(code) {
  return rooms.get(String(code || '').toUpperCase());
}

function keyMatches(room, key) {
  const a = Buffer.from(String(key || ''));
  const b = Buffer.from(room.hostKey);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---- Countdown. Optional, started by the host per question (and again for a revote). When it
// ---- runs out, answers close; the host still decides when to reveal.

function clearTimer(room) {
  if (room.timer) clearTimeout(room.timer.handle);
  room.timer = null;
  room.closed = false;
}

function setTimer(room, endsAt, durationMs) {
  if (room.timer) clearTimeout(room.timer.handle);
  room.closed = false;
  room.timer = {
    endsAt,
    durationMs,
    handle: setTimeout(() => {
      room.timer = null;
      room.closed = true;
      broadcast(room);
    }, Math.max(0, endsAt - Date.now())),
  };
}

function openQuestion(room) {
  clearTimer(room);
  room.isRevealed = false;
  room.round = 1;
  room.answers = new Map();
  room.firstAnswers = null;
  room.finalAnswers = null;
  room.hidden = new Set();
  room.questionOpenedAt = Date.now();
}

function addPlayer(room) {
  let id;
  do {
    id = crypto.randomInt(100, 1000);
  } while (room.players.has(id));
  const player = { id, token: crypto.randomBytes(16).toString('hex'), score: 0, timeMs: 0, answered: 0, lastRank: null };
  room.players.set(id, player);
  room.tokens.set(player.token, player);
  return player;
}

function resetScores(room) {
  for (const p of room.players.values()) {
    p.score = 0;
    p.timeMs = 0;
    p.answered = 0;
    p.lastRank = null;
  }
}

// ---- Question types: 'mcq' (default, options + correctIndex),
// ---- 'numeric' (answer + optional unit + relative tolerance, e.g. 0.05 = ±5%),
// ---- 'text' (unscored free text, shown as a word cloud or a list).
// ---- Any scored question may set `confidence: true` to ask "how sure?" after answering.

function isNumeric(q) {
  return q.type === 'numeric';
}

function isText(q) {
  return q.type === 'text';
}

function textMaxLength(q) {
  return q.maxLength || (q.display === 'list' ? 200 : 40);
}

// A numbered lecture session is "Session 3"; a review or other quiz can set its own `label`.
function sessionLabel(session) {
  return session.label || `Session ${session.id}`;
}

function scoredCount(session) {
  return session.questions.filter((q) => !isText(q)).length;
}

function formatNum(v) {
  return String(Number(Number(v).toPrecision(3)));
}

function parseAnswer(q, raw) {
  if (isText(q)) {
    const s = String(raw ?? '').replace(/\s+/g, ' ').trim();
    return s ? s.slice(0, textMaxLength(q)) : null;
  }
  if (!isNumeric(q)) {
    const idx = Number(raw);
    return Number.isInteger(idx) && idx >= 0 && idx < q.options.length ? idx : null;
  }
  const s = String(raw ?? '')
    .trim()
    .replace(/[,\s]/g, '')
    .replace(/[−–]/g, '-')
    .replace(/[×x*]10\^?/i, 'e');
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return null;
  const v = Number(s);
  return Number.isFinite(v) && Math.abs(v) < 1e15 ? v : null;
}

function isCorrect(q, value) {
  if (!isNumeric(q)) return value === q.correctIndex;
  return Math.abs(value - q.answer) <= Math.abs(q.answer) * (q.tolerance || 0) + 1e-12;
}

function withUnit(q, text) {
  return q.unit ? `${text} ${q.unit}` : text;
}

function formatAnswer(q, value) {
  if (isText(q)) return value;
  return isNumeric(q) ? withUnit(q, formatNum(value)) : q.options[value];
}

// Visible text responses: grouped by wording for a cloud, in arrival order for a list.
function textItems(room, q) {
  const visible = [...room.answers.entries()].filter(([id]) => !room.hidden.has(id)).map(([, a]) => a.value);
  if (q.display === 'list') return visible.slice(-80).map((text) => ({ text, count: 1 }));
  const groups = new Map();
  for (const text of visible) {
    const key = text.toLowerCase().replace(/[.!?]+$/, '');
    const g = groups.get(key) || { text, count: 0 };
    g.count += 1;
    groups.set(key, g);
  }
  return [...groups.values()].sort((a, b) => b.count - a.count).slice(0, 40);
}

// "Sure" means 4 or 5 on the 1-5 scale.
function confidenceSplit(q, map) {
  const split = { sureRight: 0, unsureRight: 0, unsureWrong: 0, sureWrong: 0, unrated: 0 };
  for (const { value, conf } of map.values()) {
    if (!conf) { split.unrated++; continue; }
    const sure = conf >= 4;
    if (isCorrect(q, value)) split[sure ? 'sureRight' : 'unsureRight']++;
    else split[sure ? 'sureWrong' : 'unsureWrong']++;
  }
  return split;
}

function lockedPayload(room, q, entry) {
  return { text: formatAnswer(q, entry.value), round: room.round, askConfidence: !!q.confidence, conf: entry.conf || null };
}

function correctAnswerText(q) {
  if (!isNumeric(q)) return q.options[q.correctIndex];
  const tol = q.tolerance ? ` (±${Math.round(q.tolerance * 100)}% accepted)` : '';
  return withUnit(q, formatNum(q.answer)) + tol;
}

// Bar-chart data for one or more answer maps, sharing one set of labels.
// Numeric answers are binned: every accepted answer in one "correct" bin,
// then the most common wrong answers, then "Other".
function summarise(q, maps) {
  if (!isNumeric(q)) {
    return {
      labels: q.options,
      correct: q.options.map((_, i) => i === q.correctIndex),
      counts: maps.map((m) => {
        const c = new Array(q.options.length).fill(0);
        for (const { value } of m.values()) c[value]++;
        return c;
      }),
    };
  }
  const correctKey = `✓ ${formatNum(q.answer)}`;
  const binOf = (v) => (isCorrect(q, v) ? correctKey : formatNum(v));
  const totals = new Map();
  for (const m of maps) {
    for (const { value } of m.values()) {
      const k = binOf(value);
      if (k !== correctKey) totals.set(k, (totals.get(k) || 0) + 1);
    }
  }
  const wrong = [...totals.keys()].sort((a, b) => totals.get(b) - totals.get(a));
  const labels = [correctKey, ...wrong.slice(0, 4), ...(wrong.length > 4 ? ['Other'] : [])];
  const index = new Map(labels.map((l, i) => [l, i]));
  return {
    labels,
    correct: labels.map((l) => l === correctKey),
    counts: maps.map((m) => {
      const c = new Array(labels.length).fill(0);
      for (const { value } of m.values()) {
        const k = binOf(value);
        c[index.has(k) ? index.get(k) : labels.length - 1]++;
      }
      return c;
    }),
  };
}

function pctCorrect(q, map) {
  if (!map.size) return null;
  let n = 0;
  for (const { value } of map.values()) if (isCorrect(q, value)) n++;
  return Math.round((n / map.size) * 100);
}

// A student who voted in round 1 but not in the revote keeps their first answer.
function mergedAnswers(room) {
  return room.firstAnswers ? new Map([...room.firstAnswers, ...room.answers]) : room.answers;
}

// Higher score first; ties broken by less total time spent on correct answers.
function rankings(room) {
  return [...room.players.values()]
    .filter((p) => p.answered > 0)
    .sort((a, b) => b.score - a.score || a.timeMs - b.timeMs)
    .map((p, i) => ({
      rank: i + 1,
      id: p.id,
      score: p.score,
      timeMs: p.timeMs,
      change: p.lastRank ? p.lastRank - (i + 1) : null,
    }));
}

function playerChannel(room, playerId) {
  return `${room.code}:p${playerId}`;
}

function hostChannel(room) {
  return `${room.code}:host`;
}

function standing(ranked, playerId) {
  const entry = ranked.find((r) => r.id === playerId);
  return { rank: entry ? entry.rank : null, of: ranked.length };
}

function resultFor(room, q, player, ranked) {
  const a = room.finalAnswers.get(player.id);
  return {
    correct: isCorrect(q, a.value),
    yourAnswer: formatAnswer(q, a.value),
    correctAnswer: correctAnswerText(q),
    explanation: q.explanation,
    score: player.score,
    ...standing(ranked, player.id),
  };
}

function finalFor(room, player, ranked) {
  return { score: player.score, total: scoredCount(room.session), ...standing(ranked, player.id) };
}

function textDoneFor(room, q, playerId) {
  return { yourAnswer: room.answers.get(playerId).value, explanation: q.explanation || null };
}

function currentQuestion(room) {
  if (!room.session || room.qIndex < 0 || room.qIndex >= room.session.questions.length) return null;
  return room.session.questions[room.qIndex];
}

function scoreDistribution(room) {
  const total = scoredCount(room.session);
  const dist = new Array(total + 1).fill(0);
  for (const p of room.players.values()) {
    if (p.answered > 0 && p.score <= total) dist[p.score]++;
  }
  return dist;
}

function revealData(room, q) {
  if (isText(q)) {
    const items = textItems(room, q);
    return {
      kind: 'text',
      display: q.display === 'list' ? 'list' : 'cloud',
      items,
      total: room.answers.size - room.hidden.size,
      explanation: q.explanation || null,
    };
  }
  const peer = !!room.firstAnswers;
  const s = summarise(q, peer ? [room.firstAnswers, room.finalAnswers] : [room.finalAnswers]);
  return {
    kind: 'choice',
    confidence: q.confidence ? confidenceSplit(q, room.finalAnswers) : null,
    correctIndex: isNumeric(q) ? null : q.correctIndex,
    correctAnswer: correctAnswerText(q),
    explanation: q.explanation,
    labels: s.labels,
    correct: s.correct,
    counts: s.counts[s.counts.length - 1],
    firstCounts: peer ? s.counts[0] : null,
    pctFirst: peer ? pctCorrect(q, room.firstAnswers) : null,
    pctFinal: pctCorrect(q, room.finalAnswers),
    totalAnswered: room.finalAnswers.size,
  };
}

function roomSnapshot(room) {
  const q = currentQuestion(room);
  return {
    code: room.code,
    session: room.session
      ? { id: room.session.id, label: sessionLabel(room.session), title: room.session.title, total: room.session.questions.length }
      : null,
    qIndex: room.qIndex,
    finished: room.finished,
    question: q
      ? {
          text: q.text,
          type: isText(q) ? 'text' : isNumeric(q) ? 'numeric' : 'mcq',
          options: isText(q) || isNumeric(q) ? null : q.options,
          unit: q.unit || null,
          display: isText(q) ? (q.display === 'list' ? 'list' : 'cloud') : null,
          maxLength: isText(q) ? textMaxLength(q) : null,
          number: room.qIndex + 1,
        }
      : null,
    round: room.round,
    // Time left rather than the end time, so a phone whose clock is off still counts down right.
    timer: room.timer ? { remainingMs: Math.max(0, room.timer.endsAt - Date.now()), durationMs: room.timer.durationMs } : null,
    closed: room.closed,
    isRevealed: room.isRevealed,
    reveal: room.isRevealed && q ? revealData(room, q) : null,
    totalAnswered: q ? room.answers.size : 0,
    firstRoundAnswered: room.firstAnswers ? room.firstAnswers.size : null,
    playerCount: room.players.size,
    scoreDistribution: room.finished ? scoreDistribution(room) : null,
    leaderboard: room.isRevealed || room.finished ? rankings(room).slice(0, 10) : null,
  };
}

// Live results of the current round, for the host's private preview only —
// never in the room-wide snapshot, which every student's phone receives.
function emitHostLive(room) {
  const q = currentQuestion(room);
  if (q && isText(q)) {
    // Stays live after reveal so the host can still hide a response from the projector.
    io.to(hostChannel(room)).emit('host:live', {
      kind: 'text',
      responses: [...room.answers.entries()].map(([id, a]) => ({ id, text: a.value, hidden: room.hidden.has(id) })),
    });
    return;
  }
  if (!q || room.isRevealed) {
    io.to(hostChannel(room)).emit('host:live', null);
    return;
  }
  const s = summarise(q, [room.answers]);
  io.to(hostChannel(room)).emit('host:live', {
    kind: 'choice',
    round: room.round,
    labels: s.labels,
    correct: s.correct,
    counts: s.counts[0],
    pct: pctCorrect(q, room.answers),
    pctFirst: room.firstAnswers ? pctCorrect(q, room.firstAnswers) : null,
  });
}

function broadcast(room) {
  io.to(room.code).emit('room:state', roomSnapshot(room));
  emitHostLive(room);
}

app.post('/api/rooms', (req, res) => {
  const room = createRoom();
  res.json({ code: room.code, hostKey: room.hostKey });
});

app.get('/api/sessions', (req, res) => {
  res.json(sessions.map((s) => ({ id: s.id, label: sessionLabel(s), title: s.title, count: s.questions.length })));
});

app.get('/api/rooms/:code/qrcode', async (req, res) => {
  const room = getRoom(req.params.code);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  const joinUrl = `${getLanUrl(req)}/join/${room.code}`;
  const dataUrl = await QRCode.toDataURL(joinUrl, { margin: 1, width: 320 });
  res.json({ dataUrl, joinUrl });
});

app.get('/join/:code', (req, res) => res.sendFile(path.join(__dirname, 'public', 'join.html')));
app.get('/host/:code', (req, res) => res.sendFile(path.join(__dirname, 'public', 'host.html')));
app.get('/display/:code', (req, res) => res.sendFile(path.join(__dirname, 'public', 'display.html')));

io.on('connection', (socket) => {
  // Every handler destructures its payload; a missing or odd one would throw and take the whole
  // server (and every class's session) down, so give them all an object.
  socket.use((packet, next) => {
    if (!packet[1] || typeof packet[1] !== 'object') packet[1] = {};
    next();
  });

  // Set by a valid host:watch. Starting, revealing, moving on and hiding responses need it.
  const isHost = (room) => !!room && socket.data.hostOf === room.code;

  socket.on('room:join', ({ code }) => {
    const room = getRoom(code);
    if (!room) {
      socket.emit('room:error', { message: 'Room not found. Check the code and try again.' });
      return;
    }
    socket.join(room.code);
    socket.emit('room:state', roomSnapshot(room));
  });

  socket.on('host:watch', ({ code, key }) => {
    const room = getRoom(code);
    if (!room) return;
    if (!keyMatches(room, key)) {
      socket.emit('host:denied');
      return;
    }
    socket.data.hostOf = room.code;
    socket.join(hostChannel(room));
    emitHostLive(room);
  });

  socket.on('player:join', ({ code, token }) => {
    const room = getRoom(code);
    if (!room) {
      socket.emit('room:error', { message: 'Room not found. Check the code and try again.' });
      return;
    }
    const player = (typeof token === 'string' && room.tokens.get(token)) || addPlayer(room);
    socket.data.roomCode = room.code;
    socket.data.playerId = player.id;
    socket.join(room.code);
    socket.join(playerChannel(room, player.id));
    socket.emit('player:assigned', { id: player.id, token: player.token });
    io.to(room.code).emit('room:state', roomSnapshot(room));

    // Restore this student's screen after a refresh or reconnect.
    if (room.finished) {
      socket.emit('quiz:yourFinalScore', finalFor(room, player, rankings(room)));
      return;
    }
    const q = currentQuestion(room);
    if (!q) return;
    if (room.isRevealed) {
      if (isText(q)) {
        if (room.answers.has(player.id)) socket.emit('question:textDone', textDoneFor(room, q, player.id));
      } else if (room.finalAnswers.has(player.id)) {
        socket.emit('question:yourResult', resultFor(room, q, player, rankings(room)));
      }
      return;
    }
    if (room.firstAnswers && room.firstAnswers.has(player.id)) {
      socket.emit('question:firstVote', { text: formatAnswer(q, room.firstAnswers.get(player.id).value) });
    }
    if (room.answers.has(player.id)) {
      socket.emit('question:locked', lockedPayload(room, q, room.answers.get(player.id)));
    }
  });

  socket.on('quiz:start', ({ code, sessionId }) => {
    const room = getRoom(code);
    const session = sessions.find((s) => String(s.id) === String(sessionId));
    if (!isHost(room) || !session) return;

    room.session = session;
    room.qIndex = 0;
    room.finished = false;
    openQuestion(room);
    resetScores(room);
    broadcast(room);
  });

  socket.on('question:answer', ({ code, answer }) => {
    const room = getRoom(code);
    const q = room && currentQuestion(room);
    if (!room || !q || room.isRevealed) {
      socket.emit('question:rejected', { message: 'This question is not open right now.' });
      return;
    }
    const playerId = socket.data.playerId;
    if (socket.data.roomCode !== room.code || !room.players.has(playerId)) return;
    if (room.answers.has(playerId)) {
      socket.emit('question:locked', lockedPayload(room, q, room.answers.get(playerId)));
      return;
    }
    if (room.closed) {
      socket.emit('question:rejected', { message: 'Time\'s up — answers are closed for this question.' });
      return;
    }
    const value = parseAnswer(q, answer);
    if (value === null) {
      socket.emit('question:rejected', {
        message: isText(q)
          ? 'Please type an answer first.'
          : isNumeric(q) ? 'Please enter a number, e.g. 160 or 2.5e4.' : 'Please pick one of the options.',
      });
      return;
    }

    const entry = { value, ms: Date.now() - room.questionOpenedAt, conf: null };
    room.answers.set(playerId, entry);
    io.to(playerChannel(room, playerId)).emit('question:locked', lockedPayload(room, q, entry));
    broadcast(room);
  });

  socket.on('question:confidence', ({ code, level }) => {
    const room = getRoom(code);
    const q = room && currentQuestion(room);
    const entry = q && room.answers.get(socket.data.playerId);
    const conf = Number(level);
    if (!q || !q.confidence || room.isRevealed || !entry || !Number.isInteger(conf) || conf < 1 || conf > 5) return;
    entry.conf = conf;
    io.to(playerChannel(room, socket.data.playerId)).emit('question:locked', lockedPayload(room, q, entry));
  });

  socket.on('text:hide', ({ code, playerId, hidden }) => {
    const room = getRoom(code);
    const q = room && currentQuestion(room);
    const id = Number(playerId);
    if (!isHost(room) || !q || !isText(q) || !room.answers.has(id)) return;
    if (hidden) room.hidden.add(id);
    else room.hidden.delete(id);
    broadcast(room);
  });

  // Start (or restart, which reopens answers after time's up) a countdown of `seconds`.
  socket.on('timer:start', ({ code, seconds }) => {
    const room = getRoom(code);
    const s = Number(seconds);
    if (!isHost(room) || !currentQuestion(room) || room.isRevealed || !(s >= 5 && s <= 900)) return;
    setTimer(room, Date.now() + s * 1000, s * 1000);
    broadcast(room);
  });

  socket.on('timer:add', ({ code, seconds }) => {
    const room = getRoom(code);
    const s = Number(seconds);
    if (!isHost(room) || !room.timer || room.isRevealed || !(s >= 5 && s <= 300)) return;
    setTimer(room, room.timer.endsAt + s * 1000, room.timer.durationMs + s * 1000);
    broadcast(room);
  });

  // Drop the countdown and leave answers open.
  socket.on('timer:stop', ({ code }) => {
    const room = getRoom(code);
    if (!isHost(room) || room.isRevealed) return;
    clearTimer(room);
    broadcast(room);
  });

  // Peer instruction: freeze the first vote, let students discuss, collect a second vote.
  socket.on('question:discuss', ({ code }) => {
    const room = getRoom(code);
    const q = room && currentQuestion(room);
    if (!isHost(room) || !q || isText(q) || room.isRevealed || room.round !== 1) return;

    clearTimer(room); // the revote gets its own countdown if the host wants one
    room.firstAnswers = room.answers;
    room.answers = new Map();
    room.round = 2;
    room.questionOpenedAt = Date.now();
    for (const [playerId, { value }] of room.firstAnswers.entries()) {
      io.to(playerChannel(room, playerId)).emit('question:firstVote', { text: formatAnswer(q, value) });
    }
    broadcast(room);
  });

  socket.on('question:reveal', ({ code }) => {
    const room = getRoom(code);
    const q = room && currentQuestion(room);
    if (!isHost(room) || !q || room.isRevealed) return;
    clearTimer(room);

    // Text questions are unscored: just open the responses to the projector.
    if (isText(q)) {
      room.isRevealed = true;
      room.finalAnswers = room.answers;
      broadcast(room);
      for (const playerId of room.answers.keys()) {
        io.to(playerChannel(room, playerId)).emit('question:textDone', textDoneFor(room, q, playerId));
      }
      return;
    }

    const before = new Map(rankings(room).map((r) => [r.id, r.rank]));
    for (const p of room.players.values()) p.lastRank = before.get(p.id) || null;

    room.isRevealed = true;
    room.finalAnswers = mergedAnswers(room);
    for (const [playerId, { value, ms }] of room.finalAnswers.entries()) {
      const p = room.players.get(playerId);
      p.answered += 1;
      if (isCorrect(q, value)) {
        p.score += 1;
        p.timeMs += ms;
      }
    }

    broadcast(room);
    const ranked = rankings(room);
    for (const playerId of room.finalAnswers.keys()) {
      const p = room.players.get(playerId);
      io.to(playerChannel(room, playerId)).emit('question:yourResult', resultFor(room, q, p, ranked));
    }
  });

  socket.on('quiz:next', ({ code }) => {
    const room = getRoom(code);
    if (!isHost(room) || !room.session) return;

    if (room.qIndex + 1 >= room.session.questions.length) {
      room.finished = true;
      room.qIndex = room.session.questions.length; // past the last question
      broadcast(room);
      const ranked = rankings(room);
      for (const p of room.players.values()) {
        io.to(playerChannel(room, p.id)).emit('quiz:yourFinalScore', finalFor(room, p, ranked));
      }
      return;
    }

    room.qIndex += 1;
    openQuestion(room);
    broadcast(room);
  });

  socket.on('quiz:clear', ({ code }) => {
    const room = getRoom(code);
    if (!isHost(room)) return;
    room.session = null;
    room.qIndex = -1;
    room.finished = false;
    openQuestion(room);
    resetScores(room);
    broadcast(room);
  });
});

server.listen(PORT, () => {
  const nets = os.networkInterfaces();
  const lanIps = Object.values(nets).flat().filter((n) => n.family === 'IPv4' && !n.internal).map((n) => n.address);
  console.log(`ES quiz server running on http://localhost:${PORT}`);
  if (lanIps.length) {
    console.log(`On your network, students reach it at: http://${lanIps[0]}:${PORT}`);
  } else {
    console.log('No LAN network detected — only reachable from this machine.');
  }
});
