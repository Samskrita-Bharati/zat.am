# स्वराः Paint — 026-sp

Serve this folder from the Zat.am repository through your local web server.
Keep the existing shared theme, navbar and `win.ogg` asset.
Include `letters.json` beside `index.html` and `letterpaint.js`. The vowel
list now loads from this JSON file, not from HTML. Its `letters` property
must be a nonempty array of unique, nonempty strings. Startup shows an
error and retry control if the file cannot be loaded. The JSON `levelIds`
mapping assigns a stable string ID to each vowel (`1`–`12`). Keep IDs
unchanged if the display order changes; add a new unique ID for new content.

## Shared leaderboard

Update your game branch from `origin/main` before using this package. It
requires the current level-aware `/js/game-score.js`; the shared file is
not modified or included here. No `bp26-score.js` is used.

At the first stroke, initialize the shared scorer with game ID `026-sp`,
game name `स्वराः Paint`, that vowel's level ID and `Vowel <letter>` name.
Retrying a failed trace keeps the same run. Completing a vowel automatically
submits its time-only 0–100 score with `result: completed`, the explicit
level ID/name, and metrics `vowel`, `paintedPercentage`, `tracingSeconds`,
and `scoringMethod`. `tracingSeconds` preserves the exact game timer;
the shared scorer controls its own protected `elapsedSeconds` field, which
can include sign-in or submission-retry delays.

The shared leaderboard keeps each game + level best separately, and
averages played levels for the overall contribution. Every newly completed
run is submitted, including lower replays; the leaderboard decides which
best counts. Old browser-only results are not retroactively uploaded.

While saving, Next letter, New letter, and vowel selection are temporarily
disabled so a different level cannot replace the shared scorer's active
run. A failed save or signed-out response shows a retry button in the win
overlay. Sign in through the site, then retry before leaving that result.
No score is submitted for an incomplete trace or on page reload. Import
failure leaves local gameplay available but reports leaderboard unavailable
on completion. A missing/outdated shared scorer requires update + reload.

## Scoring

Each completed vowel earns an integer score from 0 to 100:

`max(0, round(100 * (1 - elapsedSeconds / 120)))`

Only elapsed time affects the score. For example, 30 seconds earns 75,
60 seconds earns 50, and 120 seconds or more earns 0. Coverage is still
displayed and required for completion, but contributes no score points.
Actual painting means grey pixels inside the saved original letter mask.
The completion tolerance is not included in the displayed percentage.

The timer starts on the first pointer press and continues through errors,
retry overlays and time away from the page. Selecting a vowel, New letter,
or Next letter starts a fresh attempt; time begins on its first stroke.
The timer stops when the existing completion check succeeds. Incomplete
and abandoned attempts receive no score.

The separate personal score card averages the best completed score for each
vowel. Unplayed vowels are excluded. Replaying a vowel replaces its best
only if the new score is higher. Tied scores prefer the faster attempt,
then higher coverage. The selected vowel's Personal best shows the score,
time and painted percentage from that same saved attempt.

Green checks and per-vowel best attempts persist in localStorage under
`zatam:026-sp:personal-bests:v1`. They survive refresh and browser restart
on the same site origin/browser profile. The browser personal-best card is
not account synchronized; signed-in leaderboard writes use only the shared
scorer. Clearing browser site data removes
them; another device, browser, port or domain has separate progress.
Saved version-1 and version-2 attempts are validated against their old formula and then
recalculated with the new formula, retaining their times, coverage and
green checks. Storage uses version 3 under the existing key for continuity.
Only the previously saved best attempt per vowel can be migrated; earlier
attempts that were not saved cannot be re-ranked under time-only scoring.
An unfinished drawing and its timer reset on reload. Storage failures
show a warning without preventing play. Before this update, session-only
scores were not saved and therefore cannot be recovered after refresh.

## Existing behavior

The 12-vowel list, random selection, tracing input, sound handling and
completion thresholds are retained from the letter-checks-only version.
Completion still needs at least 60% actual painting and at least 98%
coverage within the existing brush-width tolerance.
