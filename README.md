# ES Concept Check

A quick classroom quiz tool for CS1806 (Exploring Science) Module 1 sessions.
Students answer one question at a time and get instant right/wrong feedback with an explanation —
built for reinforcing learning, not just collecting votes.

Question content comes from each hour deck in `session_presentation/module-1/hour-N.tex`
(its hook, ConcepTest, Think–Pair–Share, assessment and misconception check), covering:

- **Session 1** — Classification of Solids from Band Theory
- **Session 2** — Intrinsic and Extrinsic Semiconductors
- **Session 3** — The Diode and its Characteristics
- **Session 4** — The Zener Diode and its Characteristics
- **Session 5** — Transistor: Input and Output Characteristics
- **Session 6** — LEDs, Photodiodes and Solar Cells
- **Module 1 Review** — a 40-minute conceptual review across all six hours (16 scored questions,
  a warm-up word cloud and a closing "least confident" check)

See [sessions.js](sessions.js) to edit or add questions.

## How it works

1. Open `/`, click **Start a new session** → get a room code.
2. Open **projector display** (`/display/CODE`) on the screen — shows a QR code.
3. On the **host** page (`/host/CODE`), pick a session (1–6) to start it.
4. Students scan the QR (or go to `/join/CODE`) — one question shows at a time.
5. Once enough students have answered, click **Reveal answer** — everyone sees the correct
   answer, an explanation, and (for students) whether they got it right, plus a running score.
6. Click **Next question** to continue, or **Finish session** on the last one — students get a
   personalised, encouraging final score message; the class gets a score-distribution chart.

### Student IDs and leaderboard

Each student is given a random 3-digit ID (e.g. **#427**) when they join, shown at the top of their
phone. After every reveal, and again at the end, the projector, host panel and phones show the
**top 10**: ranked by score, with ties broken by total time taken on correct answers (faster wins).
▲/▼ arrows show movement since the previous question, and each student sees their own rank.
The ID survives a page refresh or dropped WiFi on the same phone/browser.

### Timer (optional)

While a question is open, the host panel's **Timer** row starts a countdown (30 s, 1, 1½, 2 or
3 min) shown on the projector and every phone; **+30 s** and **Stop timer** appear while it runs.
At zero, answers close — late taps get "Time's up" — but nothing is revealed: you still click
**Reveal** (or **Discuss & revote**, which can have its own timer). Picking a time again after it
has run out reopens answers. Without a timer, questions stay open until you reveal, as before.

### Discuss & revote (peer instruction)

On any question, instead of revealing straight away, click **Discuss & revote** on the host panel.
The first vote is frozen, phones show "Discuss, then vote again" with each student's own first
answer, and the projector tells the class to find someone who answered differently. At reveal the
projector shows both votes side by side — e.g. *Correct: 30% first vote → 80% after discussion*.
A student who doesn't revote keeps their first answer.

While a question is open, **Peek at live results** on the host panel shows the running % correct
(only on your screen, never on the projector) with the rule of thumb from the session notes:
≥70% → reveal · 30–70% → discuss & revote · <30% → re-teach first.

### Number-answer questions

Calculation questions can ask for a typed number instead of offering choices, so the answer can't
be worked backwards from the options. In [sessions.js](sessions.js):

```js
{ text: '…', type: 'numeric', answer: 160, unit: 'Ω', tolerance: 0.05, explanation: '…' }
```

`tolerance` is relative (0.05 = ±5%); leave it out for an exact answer. Students may type `160`,
`1.6e2` or `1.6x10^2`. At reveal all accepted answers share one ✓ bar and the most common wrong
answers get bars of their own — so a cluster at 200 Ω shows exactly which mistake the class made.

### Confidence rating (selected questions only)

Add `confidence: true` to a scored question and, after answering, each phone asks
**"How sure are you? 1–5"** (optional). At reveal your host panel — not the projector — shows four
boxes: *sure & right*, *unsure but right*, *unsure & wrong*, and **sure but wrong**, the confident
misconceptions worth opening the next session with. Ratings never affect scores. It's switched on
for one key question per session, not everywhere.

### Word cloud / short text (unscored)

```js
{ text: '…', type: 'text', display: 'cloud', maxLength: 30, explanation: 'optional model answer' }
```

`display: 'cloud'` groups identical short answers ("phone", "Phone", "phone." count as one) and
sizes them by how many gave them; `display: 'list'` shows each response as a card — good for
minute papers. Responses appear **only on your host panel first**, where each has a **Hide**
button; click **Show responses on projector** when ready (you can still hide one afterwards).
Text questions don't count towards the score or the leaderboard.

| Page | Who | URL |
|---|---|---|
| Host control panel | You | `/host/CODE` |
| Projector / big screen | The class sees this | `/display/CODE` |
| Student answer page | Students, via QR scan | `/join/CODE` |

**Only the browser that started a session can control it.** Creating a room hands that browser a
secret host key (kept in its local storage). Anyone else opening `/host/CODE` — the code is on the
projector — gets "Teacher page only" and can neither run the quiz nor see responses. Refreshing
the host page is fine; to run a room from a different computer, start a new session there.

## Run locally

```bash
npm install
npm start
```

Opens on http://localhost:3000 (or set `PORT` to run on something else). For students' phones to
reach it over WiFi, use your laptop's local IP instead of `localhost`, make sure your WiFi is set to
**Private**, and allow Node.js through the Windows Firewall.

## Deploy for free (Render)

[render.yaml](render.yaml) is already set up. Push this `polls` folder to its own GitHub repo, then
on [render.com](https://render.com): New → Web Service → connect the repo → it auto-detects the
config. Free tier sleeps after 15 min idle; open the site a minute before class to wake it.
Online, the QR code links to the site's own `https://` address; on a laptop it uses the WiFi IP.

## Notes

- Room state lives in server memory only — restarting the server clears all rooms.
- Scores are anonymous — tracked per 3-digit ID, not per named student. IDs stay the same across
  sessions within one room; scores reset when a new session starts.
- A student who doesn't answer a question before reveal just scores nothing for it.
