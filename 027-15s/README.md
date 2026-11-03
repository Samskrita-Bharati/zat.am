# 027-15s — Sanskrit Sliding Number Puzzle

A sliding number puzzle with Sanskrit numerals, supporting both
the 8 Puzzle and the 15 Puzzle through one shared implementation.

## Files

- `index.html` — game page, instructions and completion dialog
- `puzzle.css` — responsive game and dialog styles
- `puzzle.js` — puzzle movement, scrambling, timer and scoring
- `cover.jpg` — existing game thumbnail
- `LICENSE` — existing license

## Puzzle sizes

- `index.html` — 15 Puzzle, 4 × 4
- `index.html?size=4` — 15 Puzzle, 4 × 4
- `index.html?size=3` — 8 Puzzle, 3 × 3

Use the links in the instructions panel to switch sizes.
Switching sizes loads a new game.

## How to play

1. Press Scramble.
2. Click or tap a numbered tile beside the empty space.
3. Arrange the numbers in ascending order, from left to right
   and top to bottom.
4. Leave the empty space in the bottom-right corner.

Only valid tile movements increase the move counter.
Hovering over a tile displays its number in English digits.

Scrambling uses legal tile movements so the board remains solvable.

Solve displays the completed arrangement, resets the timer and
move counter, and ends the current attempt without awarding points.

## Timer and scoring

The timer starts after scrambling and shared scoring initialization
has finished. It stops when the player completes the puzzle.

| Puzzle | Starting points | Time deduction | Move deduction | Minimum raw points |
| ------ | --------------- | -------------- | -------------- | ------------------ |
| 8 Puzzle | 1,000 | 2 per second | 2 per valid move | 100 |
| 15 Puzzle | 2,000 | 2 per second | 2 per valid move | 100 |

Local points:

`max(100, starting points - elapsed whole seconds × 2 - valid moves × 2)`

Leaderboard score:

`round(local points / starting points × 100)`

Both time and valid moves affect points. The minimum final score is 10/100
for 8 Puzzle and 5/100 for 15 Puzzle because of the existing raw-point floor.

The completion dialog displays time, moves and the normalized 0–100 score.
The submission status displays the leaderboard score out of 100.

## Leaderboard integration

The game imports the existing shared module:

`../js/game-score.js`

Both puzzle sizes submit under game ID `027-15s`.
The shared scorer is initialized and submitted with level ID `1` / name
`8 Puzzle` or level ID `2` / name `15 Puzzle`. Level fields also remain in
metrics for compatibility with older shared scorers. The team leaderboard
keeps each level best separately and averages played level bests for this
game's Overall contribution. Playing both sizes is not required to submit.
Attempt metadata records puzzle size, puzzle type, moves,
completion time, local points and maximum points.

A completed puzzle automatically attempts submission.
Players must be signed in to save a score.

Failed or signed-out submissions can be retried from the completion
dialog. Starting another game clears the previous local attempt.
Local attempts are not preserved across page reloads or navigation.

The game does not contain its own Firebase configuration or direct
database writes. All score writes use the shared scorer. Personal bests
are read from the signed-in user's existing leaderboard history, filtered
by explicit level ID with puzzle size as a legacy fallback. The card shows
that best attempt's exact puzzle time, moves and saved 0–100 score. It
refreshes after a successful save and on account changes; no browser cache
is added. Keep the shared module updated from the team's main branch.

### Timing limitation

The actual puzzle completion time is stored in
`metrics.puzzleSeconds` (with `metrics.elapsedSeconds` also retained for
older shared scorers). Personal best prefers `puzzleSeconds` when present.

The shared module also measures time until submission. A delayed
sign-in or retry can include waiting time in that shared duration.
The current scorer protects its own `elapsedSeconds` field, which is why
the exact game timer is kept separately as `puzzleSeconds`.
If shared scoring could not initialize at the start, its fallback
duration begins at submission instead.

No changes to the shared scoring module are required.

## Shared dependencies

- `../shared/game-theme.css`
- `../js/navbar-loader.js`
- `../js/game-score.js`
- Shared authentication files used by the scoring module
- Sanscript 1.1.0, loaded from jsDelivr

Serve the repository through its local development server.
Opening the HTML directly through `file://` is not supported
for shared module integration.

## Manual verification

- Open both puzzle sizes and confirm the correct title and grid.
- Check the layout on narrow and wide screens.
- Confirm the shared navbar remains usable.
- Confirm invalid tile selections do not increase moves.
- Confirm Scramble resets moves and starts a new timer.
- Confirm Solve ends the attempt without submitting a score.
- Complete a puzzle and check the time, moves and score dialog.
- Check successful submission while signed in.
- Check signed-out and failed-submission retry messages.
- Check Play again resets the game.

## Attribution

Based on the sliding puzzle by Arnis Ritiņš.
Original code copyright © 2015 Arnis Ritins, released under
the MIT license. Retain the existing LICENSE file.
