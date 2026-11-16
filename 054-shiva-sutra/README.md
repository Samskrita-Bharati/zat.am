# Shiva Sutra — 054

A 4×4 Sanskrit sliding puzzle with separate **Shiva Sutra** and **Alphabet** challenges. Choose a challenge, select **New Game**, and slide a tile next to the empty square. Arrange tiles left to right, row by row, with the empty square last. The Alphabet mode selects fifteen letters and uses their existing Sanskrit alphabet order. Listen is available only in Shiva Sutra mode and plays its original audio. Switching to Alphabet hides Listen and stops and resets the audio.

A completed arrangement is detected after a legal move, or checked with **Check arrangement**. The round then locks, stops its timer, displays the result, and automatically attempts to save the score. The Share button and clipboard copying are removed.

## Scoring

Scores reflect elapsed time and legal moves:

- Starting raw score: **2,000**.
- Deduction: **2 per elapsed second** and **2 per legal move**.
- Minimum raw score: **100**.
- Leaderboard score: `round(rawScore / 2000 × 100)`, constrained to 0–100.
- Therefore, the minimum completed score is **5/100**.

For example, 100 seconds and 100 moves produce 1,600 raw points and **80/100**. Invalid clicks are not moves. Time starts when the shuffled board is ready, stops on completion, and resets on New Game. Each completed attempt can save once.

## Personal best and leaderboard

- Shared write API: `../js/game-score.js`.
- Game: `054-shiva-sutra` / **Shiva Sutra**.
- Levels: `sutra` / **Shiva Sutra** and `alphabet` / **Alphabet**.
- Personal best ranks score first, then fewer seconds, then fewer moves, when scores are tied.
- Personal bests and the selected challenge persist in local storage. An unfinished board is not restored after refresh. Bests are separated by challenge and signed-in account; guests have a separate device-only best.
- Signed-in leaderboard history also restores bests after reload and on another device. Signed-out players can play and keep a guest best without submitting online.
- A failed or signed-out save displays **Retry saving score**. The original completed score is retried without restarting the timer or recalculating the result.
- A device-only best is labeled accordingly; it is not presented as a confirmed online save.
- The existing `@` testing shortcut marks the round as practice. Such rounds cannot save a best or submit a score.
- No direct Firebase writes are added; Firestore is read only to recover the player's existing history.

## Files

- `index.html`: shared navbar, board, challenge controls, score/time/move stats, personal best.
- `style.css`: scoped game styling and responsive layout.
- `script.js`: existing content, shuffling and legal moves, round tracking, shared scoring, personal best.
- `serviceWorker.js`: network-first game assets on the hosted site; no local development interception.
- Existing images, audio and `manifest.json` are retained.

## Run and test

Run `npm install` and `npm run dev` from the repository root, then open `/054-shiva-sutra/` at the local server's URL.

Check both challenge modes, illegal clicks, repeated restarts, score deductions, solved-board locking, saved bests after reload, signed-in saving, signed-out retry, audio, and a narrow viewport. Live leaderboard tests require a signed-in account and network access.

Original game: Pradeep D / iSeek. Audio courtesy: themathesontrust.org.
