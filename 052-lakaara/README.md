# Lakaara Puzzle

An untimed Sanskrit grammar puzzle in the Zat.am collection. Arrange shuffled verb conjugations by dragging word tiles into the appropriate row and number column.

## Play

1. Choose a lakaara (tense or mood), or choose **All** for the mixed category.
2. Select **Start Game** to load a shuffled puzzle.
3. Drag a raised word tile onto another word tile to swap their positions.
4. Use the row button to check that row, or **Check All** to check the entire board.
5. Finish by arranging all forms correctly and selecting **Check All**.
6. Select **New Game** for the next puzzle. Changing the category also starts a new puzzle.

Columns are **Singular**, **Dual**, and **Plural**. Rows are: Third person (Prathama), Second person (Madhyama), First person (Utthama).

### Tile feedback

- Raised white cards and dotted grips identify movable forms.
- Hovering lifts a movable tile; the destination shows a dashed outline during a drag.
- A correctly checked form turns green. Green alone does not lock the tile.
- A completely correct row checked with its row button is locked and loses its drag grips.
- Completing the full puzzle locks the remaining tiles.
- Touch dragging uses the existing `DragDropTouch.js` library.
- On narrow screens, scroll the puzzle horizontally to reach every column.

## Scoring

Each round starts at **100**. A newly checked incorrect form costs **2 points**:
`score = max(0, 100 - 2 × distinct checked mistakes)`.

A mistake is identified by its cell and the wrong form in it. Rechecking the same form in the same cell does not charge again; checking a different wrong form there is a new mistake. Only cells in the checked row are evaluated when using a row button. Dragging and correctly checked forms do not cost points.

There is no in-game timer, time penalty, or time tie-break for the local personal best. The result and personal best show the score only. Existing stored personal bests remain readable.

## Leaderboard and personal best

- Uses the shared `../js/game-score.js`, with game ID **052-lakaara** and game name **Lakaara Puzzle**.
- Each selected category has its own stable level ID and visible level name. **All** is a separate mixed category.
- Completed rounds submit once with `result: "completed"` and a mistake-count metric.
- A signed-in account is required for leaderboard saving. The game reports signed-out or failed-save status instead of claiming success.
- Personal bests are stored locally by level and are available without signing in. They are specific to this browser; clearing site storage removes them.
- The leaderboard uses the best score for each game and level according to the shared scorer's rules.
- The shared scoring service may still record elapsed time in history metadata. It is not displayed by this game or used in its score.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Game markup, category controls, instructions, shared navbar mount |
| `style.css` | Scoped layout, raised draggable tiles, drag feedback, responsive styles |
| `script.js` | Data loading, round selection, shuffle, swaps, checking, scoring, personal best |
| `conjugations.txt` | Existing game content, stored as JSON |
| `DragDropTouch.js` | Existing touch drag support |
| `manifest.json` | Web app metadata |
| `serviceWorker.js` | Existing game cache implementation |
| `cover.jpg` | Existing game artwork |

Shared dependencies include `../shared/game-theme.css`, `../js/navbar-loader.js`, and `../js/game-score.js`. Keep the game inside the repository so these paths resolve.

## Run locally

From the repository root:

```sh
npm install
npm run dev
```

Open `http://localhost:5173/052-lakaara/` (or the port printed by Vite). Use a local web server; opening the HTML through `file://` will not load the data and modules correctly.

## Manual verification

- Confirm there is no timer in the round, result, or personal best.
- Swap two unlocked tiles and verify both forms exchange places.
- Check a wrong form twice: only the first check should deduct points.
- Check a row: other rows should not incur penalties.
- Check a correct row: its tiles should turn green and lock.
- Complete the board: final score and local best should appear, with one leaderboard submission.
- Switch category: the score resets and the personal best belongs to that category.
- Test signed-in and signed-out completion, touch dragging, and horizontal scrolling on a narrow screen.

## Credits

Original game: Pradeep D / iSeek. Courtesy: Green Message, greenmesg.org. Existing content and attribution are retained.

The existing `@` test shortcut solves a practice board but does not save a personal best or submit a leaderboard score.
