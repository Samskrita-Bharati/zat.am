# पाशः (PaashaH)

PaashaH is a Sanskrit-themed maze game. Find the key, then reach the exit.
Move with the keyboard arrow keys or the on-screen direction buttons. A new
16 × 12 maze is generated whenever the page loads.

## Game features

- The Sanskrit instructions and direction labels guide the player through the
  maze. The SCORE and TIME status cards sit above the board.
- The timer starts with the first successful move and stops when the game ends.
- The key adds 20 points, reaching the exit adds 50, and each valid move costs
  1 point. Moves into walls do not cost points.
- The starting score is based on the maze route: the key is placed at the cell
  with the greatest combined distance from the entrance and exit, and the
  starting score is that distance total minus 2.
- Completing the maze earns a time bonus: +30 under 45 seconds, +20 from 45 to
  under 90 seconds, +10 from 90 to under 120 seconds, and no bonus after that.
- The success popup shows the score breakdown and submits the final score to
  the shared leaderboard. Signing in is required to save an entry. Failed runs
  show a separate popup and do not display or submit a score.
- The layout adapts to smaller screens, placing the direction controls below
  the maze.

Edit `score-config.js` to change the starting deduction, move cost, key and exit
bonuses, minimum score, or time bonus tiers. Thresholds are in seconds and
match the bonus values by position.

## Project files

- `index.html` — Game page, status cards, instructions, controls, and result
  popups.
- `maze-builder.js` — Generates the maze, places the key, calculates the
  route-based starting score, and renders the board.
- `mazing.js` — Handles movement, timer, scoring, win/loss state, and
  leaderboard submission.
- `score-config.js` — Scoring values and time bonus tiers.
- `mazing.css` — Maze board, score breakdown, and responsive layout styles.
- `../shared/game-theme.css` — Shared page, control, status, and popup styling.
- `../js/game-score.js` — Shared leaderboard integration.
- `../js/navbar-loader.js` — Shared site navigation.
