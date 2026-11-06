# अन्वेषणम् — 007-ask

Run through the existing Zat.am web server. Replace only these game files;
keep images, shared theme, navbar and how-to files.

## Round flow

Choose Arjuna or Sri Krishna with the switch and select a difficulty.
The generated grid is hidden and hints are disabled until Start is pressed.
Start reveals the grid and starts the countdown exactly once.

| Difficulty | Level ID | Time limit / initial raw points |
| --- | --- | ---: |
| Easy (5×5) | 1 | 60 |
| Medium (7×7) | 2 | 120 |
| Hard (10×10) | 3 | 180 |

One raw point is lost per full elapsed second. The final leaderboard score
is `max(0, round(remainingPoints / initialPoints * 100) - helpPenalty)`.
For example, Easy completed in 15 seconds has 45/60 raw points and earns
75/100 before help deductions. Medium in 30 seconds has 90/120 points and
also earns 75/100. This retains the shared 0–100 scoring requirement.

First Help costs 10 final-score points once and unlocks More Help. More
Help costs another 20 once. The timer continues while using help. Reopening
either does not charge again. Both hints disable after a win or timeout.

Finding all names before the deadline stops the timer and opens a score
popup. Next difficulty advances Easy → Medium → Hard, preserving the name
set. Hard has no next-difficulty button. The single Try again button moves
into the popup while open and reloads the current difficulty/name set.

Timeout stops play and shows a zero-score result without leaderboard
submission. A click at or after the deadline cannot win even if the browser
has delayed timer callbacks. Start/replay does not require all difficulties
to be completed. Closing the popup does not resume a completed round.

## Leaderboard and preserved logic

Only `../js/game-score.js` is used. The adapter submits on a real win, with
separate difficulty IDs, name set, elapsed time, limit, remaining raw points,
found count and hint usage. Signed-out/network failures expose a retry.
No shared files, private Firebase writes, or browser best cache are added.
Custom URL grid sizes (4–15) retain their existing generation and use a
180-second limit with a separate `size-N` level ID.

Original word data, akshara splitting, placement, random fill, matching,
highlighting and first-akshara selection remain unchanged. This update
replaces the earlier per-word time-band scoring with countdown scoring.
