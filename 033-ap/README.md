# अन्विष्यन्तां पदानि

An archive of Sanskrit word search puzzles published in the monthly magazine *Sambhashana Sandesha* from 1996 to 1998. The collection is intended for Samskrita Bharati volunteers as a learning and teaching resource.

## How it works

- The landing page displays the available year covers (1996, 1997, and 1998).
- Selecting a year reloads the page with `?year=YYYY`.
- `js/sig.js` switches from the year archive to an embedded Amuse Labs date picker for that year's puzzle set (`sanskritbharatiusa-apYYYY`). The puzzles and their gameplay are hosted by Amuse Labs; they are not stored in this folder.
- The page uses the shared Zat.am game shell in `../shared/game-theme.css`. `game-layout.css` contains only archive-specific and iframe responsive layout rules.

## Files

- `index.html` — page structure, available years, and iframe mount point.
- `js/sig.js` — year selection, Firebase user identity for per-user Amuse Labs progress, and leaderboard submission flow.
- `score-config.js` — Amuse score conversion and time-bonus settings.
- `img/` — year cover images.
- `pp.htm`, `tos.htm` — purpose, privacy, and usage terms.

The page is responsive: year covers reflow through the Bootstrap grid, the archive card adapts its spacing on narrow screens, and the embedded game fills the available width with a viewport-aware mobile height.

For signed-in players, the page hashes the Firebase Auth UID with SHA-256 and passes that opaque value to Amuse Labs as `uid` before the iframe's first load. On each `PUZZLE_LOAD`, the Amuse Labs puzzle ID is used as `levelId`, and its `date` timestamp is formatted as a readable date (for example, `1 August 1998`) for `levelName`. On `PUZZLE_COMPLETE`, the page calculates the 80-point base from Amuse Labs' `score`: scores below 10 are scaled proportionally (`score / 10 × 80`), while scores of 10 or higher receive the full 80 points. It then adds 1 bonus point for every full 10 seconds under 200 seconds (maximum total 100) and submits the result through the shared `../js/game-score.js` integration. A result popup using the shared game theme displays the score, time, and submission status when a submission is attempted. The original Amuse Labs score and time are retained in the attempt metrics. Signed-out players can still play, but their results are not saved to the Zat.am leaderboard.

Repeated completion events are deduplicated per signed-in user by puzzle ID, Amuse score, time, and calculated score. The page also checks existing leaderboard history to avoid resubmitting matching records created before the deduplication marker was added. Duplicate results do not open the result popup. A later attempt with a different score or time remains eligible for submission.
