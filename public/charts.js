function escapeHtmlForChart(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// `correct` is either one correct index, or an array of booleans (one per label).
function isCorrectCol(correct, i) {
  if (Array.isArray(correct)) return !!correct[i];
  return correct !== undefined && correct !== null && i === correct;
}

function renderVerticalBarChart(labels, counts, correct) {
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const max = Math.max(...counts, 1);
  const cols = labels.map((label, i) => {
    const pct = Math.round((counts[i] / total) * 100);
    const heightPct = Math.round((counts[i] / max) * 100);
    const isCorrect = isCorrectCol(correct, i);
    const fillClass = isCorrect ? 'vbar-fill vbar-fill-correct' : 'vbar-fill';
    const badge = isCorrect ? '<div class="vbar-badge">✓ correct</div>' : '';
    return `<div class="vbar-col">
      ${badge}
      <div class="vbar-value">${counts[i]} (${pct}%)</div>
      <div class="vbar-track"><div class="${fillClass}" style="height:${heightPct}%"></div></div>
      <div class="vbar-label${isCorrect ? ' vbar-label-correct' : ''}">${escapeHtmlForChart(label)}</div>
    </div>`;
  }).join('');
  return `<div class="vbar-chart">${cols}</div>`;
}

// First vote (pale) beside the vote after discussion (solid), per option.
function renderPairedBarChart(labels, first, final, correct) {
  const max = Math.max(...first, ...final, 1);
  const cols = labels.map((label, i) => {
    const isCorrect = isCorrectCol(correct, i);
    const badge = isCorrect ? '<div class="vbar-badge">✓ correct</div>' : '';
    const fill = (n, cls) => `<div class="vbar-track"><div class="${cls}" style="height:${Math.round((n / max) * 100)}%"></div></div>`;
    return `<div class="vbar-col">
      ${badge}
      <div class="vbar-value">${first[i]} → ${final[i]}</div>
      <div class="vbar-pair">
        ${fill(first[i], 'vbar-fill vbar-fill-first')}
        ${fill(final[i], isCorrect ? 'vbar-fill vbar-fill-correct' : 'vbar-fill')}
      </div>
      <div class="vbar-label${isCorrect ? ' vbar-label-correct' : ''}">${escapeHtmlForChart(label)}</div>
    </div>`;
  }).join('');
  return `<div class="vbar-chart">${cols}</div>
    <div class="vbar-legend"><span class="swatch swatch-first"></span>First vote <span class="swatch swatch-final"></span>After discussion</div>`;
}

// Chart plus headline for a revealed question — shared by host and projector.
function renderReveal(reveal) {
  const peer = reveal.firstCounts !== null && reveal.firstCounts !== undefined;
  const shift = peer && reveal.pctFirst !== null && reveal.pctFinal !== null
    ? `<div class="pi-shift">Correct: <strong>${reveal.pctFirst}%</strong> first vote → <strong>${reveal.pctFinal}%</strong> after discussion</div>`
    : '';
  const chart = peer
    ? renderPairedBarChart(reveal.labels, reveal.firstCounts, reveal.counts, reveal.correct)
    : renderVerticalBarChart(reveal.labels, reveal.counts, reveal.correct);
  return `${shift}
    <div class="answer-line">Answer: <strong>${escapeHtmlForChart(reveal.correctAnswer)}</strong></div>
    ${chart}`;
}

// Word cloud (size = how many gave that answer) or a plain list of responses.
function renderTextReveal(reveal) {
  if (!reveal.items.length) return '<p class="muted center">No responses to show.</p>';
  if (reveal.display === 'list') {
    return `<div class="text-list">${reveal.items.map((it) => `<div class="text-card">${escapeHtmlForChart(it.text)}</div>`).join('')}</div>`;
  }
  const max = Math.max(...reveal.items.map((it) => it.count));
  // Biggest words in the middle, smaller ones alternating out to either side.
  const arranged = [];
  reveal.items.forEach((it, i) => (i % 2 ? arranged.push(it) : arranged.unshift(it)));
  const tones = ['cloud-a', 'cloud-b', 'cloud-c'];
  const words = arranged.map((it, i) => {
    const size = 1 + (max > 1 ? ((it.count - 1) / (max - 1)) * 2.2 : 0.6);
    const title = `${it.count} student${it.count === 1 ? '' : 's'}`;
    return `<span class="cloud-word ${tones[i % 3]}" style="font-size:${size.toFixed(2)}rem" title="${title}">${escapeHtmlForChart(it.text)}</span>`;
  }).join('');
  return `<div class="word-cloud">${words}</div>`;
}

// Host-only: how sure the class was, split by right/wrong. "Sure" = 4 or 5 out of 5.
function renderConfidence(split) {
  const rated = split.sureRight + split.unsureRight + split.unsureWrong + split.sureWrong;
  if (!rated) return '<p class="muted">No confidence ratings were given.</p>';
  const pct = (n) => Math.round((n / rated) * 100);
  const box = (cls, label, n, note) => `<div class="conf-box ${cls}"><div class="conf-n">${n}</div><div class="conf-label">${label}</div><div class="conf-pct">${pct(n)}%${note ? ' · ' + note : ''}</div></div>`;
  return `<div class="conf-panel">
    <h3 class="lb-title" style="margin-bottom:8px;">How sure were they? <span class="muted" style="font-weight:400; font-size:0.8rem;">(only on your screen)</span></h3>
    <div class="conf-grid">
      ${box('conf-good', 'Sure &amp; right', split.sureRight, 'secure')}
      ${box('conf-ok', 'Unsure but right', split.unsureRight, 'needs confidence')}
      ${box('conf-meh', 'Unsure &amp; wrong', split.unsureWrong, 'knows it\'s shaky')}
      ${box('conf-bad', 'Sure but wrong', split.sureWrong, 'misconception')}
    </div>
    ${split.unrated ? `<p class="muted" style="font-size:0.8rem; margin:6px 0 0;">${split.unrated} answer(s) not rated.</p>` : ''}
  </div>`;
}

function formatSecs(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}

function renderLeaderboard(entries, { title = 'Top 10', highlightId = null } = {}) {
  if (!entries || !entries.length) return '';
  const rows = entries.map((e) => {
    const medal = ['🥇', '🥈', '🥉'][e.rank - 1] || e.rank;
    let move = '<span class="lb-move"></span>';
    if (e.change > 0) move = `<span class="lb-move lb-up">▲${e.change}</span>`;
    else if (e.change < 0) move = `<span class="lb-move lb-down">▼${-e.change}</span>`;
    return `<li class="lb-row${e.id === highlightId ? ' lb-me' : ''}">
      <span class="lb-rank">${medal}</span>
      <span class="lb-id">#${e.id}</span>
      ${move}
      <span class="lb-score">${e.score} pt${e.score === 1 ? '' : 's'}</span>
      <span class="lb-time">${formatSecs(e.timeMs)}</span>
    </li>`;
  }).join('');
  return `<div class="leaderboard"><h3 class="lb-title">${escapeHtmlForChart(title)}</h3><ol class="lb-list">${rows}</ol></div>`;
}
