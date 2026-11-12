# Namavali

Namavali is a browser-based grouping game. Each round shows clues for three Hindu deities and nine shuffled names. Find the three groups of three before making four mistakes.

The current test data labels each name with its deity name and a number, such as `विष्णु1`.

## How to play

1. Select **New Game** to start a round.
2. Select three names and press **Submit**. Each incorrect submission, including a repeated guess, counts as one mistake.
3. Use **Shuffle** to rearrange the available names.
4. Use up to three **Get a Hint** prompts. Each hint randomly highlights one available name and identifies its deity group. Hints skip completed, previously hinted, and currently selected names.
5. Find all three groups with fewer than four mistakes to win.

## Scoring

- Each completed group: **+25 points**.
- Each hint used: **−5 points**.
- Each incorrect submission: **−5 points**, regardless of how many names in that submission are misplaced.
- On a win, the time bonus is **+25** under 10 seconds, **+15** under 15 seconds, or **+5** under 30 seconds. No time bonus is awarded at 30 seconds or longer.
- Final scores cannot go below zero.

At the end of a round, the final score and game metrics are submitted to the shared Zat.am leaderboard. Sign in to save a score. The results dialog reports the submission status and offers **Play again**.

## Project files

- `index.html` — page markup, shared theme, leaderboard initialization, and service worker registration.
- `style.css` — Namavali board styles and responsive layout.
- `script.js` — round generation, selection, guesses, hints, timer, score, sharing, and leaderboard submission.
- `score-config.js` — group points, hint and mistake penalties, and time bonuses.
- `manifest.json`, `serviceWorker.js` — installable app metadata and offline asset caching.
- `Namavali_small.png`, `Namavali_game_icon.png` — deity reference image and app icon.

The page uses the shared styles in `../shared/game-theme.css` and the shared leaderboard integration in `../js/game-score.js`.

## Run locally

Serve the repository root with a local HTTP server, then open `/055-namavali/`. The shared theme, navbar, leaderboard, and service worker rely on the site being served over HTTP(S); they do not work from a `file://` URL.
