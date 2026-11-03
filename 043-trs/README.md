# Sanskrit T-Rex Runner

A Sanskrit-themed endless runner based on Chrome's offline T-Rex game. The game uses local sprite sheets and embedded audio assets.

## How to play

- Press **Space** or **↑** to start running and jump.
- Press **↓** to duck.
- Press **Enter** after a collision to restart.
- On touch screens, tap the game area to jump. Press and hold for 100 ms or longer to duck.

The status cards show the current score and elapsed time. The score is awarded in time-based increments and capped at the configured range. The canvas also displays the current score and best score in Devanagari numerals. After a collision, a results popup shows the run time and score, then submits the score to the shared leaderboard. Sign in to save a result. A new personal best is also written to `localStorage` under `trexsamszatamhs`.

## Score configuration

Edit `score-config.js` to change:

- `secondsPerAward`: full seconds survived for each score award.
- `pointsPerAward`: points received for each award.
- `minimumScore` and `maximumScore`: score limits.

The current configuration awards 1 point per second, with a range of 0–100.

## Run locally

From the repository root, start the Vite development server with `npm run dev`. Open `/043-trs/` in the browser. 

## Files

- `index.html` contains the game page, status cards, and sprite/audio resources.
- `index.js` contains the runner, physics, obstacles, keyboard and touch input, timer, and score logic.
- `score-config.js` defines score timing, award points, and score limits.
- `index.css` contains the responsive canvas and game-area layout.
- `assets/` contains the local sprite sheets used by the game; sound effects are embedded in `index.html`.
- `../shared/game-theme.css` provides the shared page theme and status-card styles.
- `../js/game-score.js` initializes and submits leaderboard scores.
- `../js/navbar-loader.js` loads the shared navigation.
- `LICENSE` contains the original BSD license notice.

## Credits

Adapted from Chromium's T-Rex runner and the `t-rex-runner` project by wayou.
