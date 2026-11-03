# अन्वेषणम् (Anveshanam)

Anveshanam is a Sanskrit symbol search activity. Find every instance of the
least common symbol in the selected set, as quickly and accurately as you can.

## Modes

- **Lines** — Symbols appear along Voronoi diagram lines.
- **Circles** — Symbols appear inside colored circles.
- **Hexagons** — Symbols appear in a hexagonal grid.

Choose a mode below the play area to start or switch rounds. The **I give up!**
button highlights the remaining target symbols. **Restart** creates a fresh
round in the current mode. The timer starts on the first symbol click.

## Scoring

- Each correct find earns 5 points.
- Each incorrect click deducts 2 points.
- The completion bonus is +20 under 1 minute, +10 from 1 to under 2 minutes,
  and 0 at 2 minutes or longer.
- The final score is limited to the configured minimum and maximum (currently
  0–100).

Edit `score-config.js` to change points, score limits, or time bonuses.
`timeBonusThresholdsSeconds` contains ascending upper limits in seconds, and
`timeBonusPoints` contains the bonus for each corresponding time range.

When all target symbols are found, the result dialog shows the score breakdown
and submits the score to the shared leaderboard. Signing in is required to
save a leaderboard entry.

## Project files

- `index.html` — Main entry page, mode picker, status cards, and completion
  dialog.
- `app.js` — Loads modes, updates status, calculates scores, and submits
  completed scores.
- `styles.css` — Entry page, responsive layout, and shared mode controls.
- `score-config.js` — Shared scoring configuration for all modes.
- `data.json` — Symbol sets used in the game.
- `1-li/index.html`, `2-ci/index.html`, `3-he/index.html` — Lines, Circles,
  and Hexagons mode implementations.
- `../shared/game-theme.css` — Shared visual theme.
- `../js/game-score.js` — Shared leaderboard integration.
- `../js/navbar-loader.js` — Site navigation loader.
