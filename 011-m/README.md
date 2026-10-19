# मासाः — Sanskrit Months Game

Arrange twelve Sanskrit months in their correct numbered positions around a fixed circular board. This game is part of the Zat.am portal and uses its shared theme, navigation, and scoring system.

## Run locally

From the repository root, start a static HTTP server:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/011-m/`. Serve the repository root rather than only this game directory, because the game loads shared files from parent directories. Opening `index.html` directly with a `file://` URL is not supported for the shared JavaScript modules.

## How to play

1. Click **आरम्भ**, or press **Enter**, to display a month.
2. Count clockwise from **१**. **चैत्रः** is the first month in the default set.
3. Drag the displayed month to its correct position, or click/tap that position.
4. A correct placement stays on the board, advances progress, and immediately displays another unplaced month.
5. An incorrect placement in an empty position adds one wrong attempt. The current month remains available.
6. Place all twelve items to open the win popup.

The next-month button selects a random unplaced item without adding a wrong attempt. Random selection may display the same unplaced item again. Filled positions ignore further placements.

## Keyboard controls

| Key | Action |
| --- | --- |
| Enter before starting | Start the game |
| Left / right arrow | Select the previous / next numbered position, wrapping between १ and १२ |
| Enter on the board | Place the displayed item at the selected position |
| Tab | Move between focusable controls and positions |
| Enter on the next-month button | Select another random unplaced item |

Numbered positions remain fixed; only the selection moves. After a correct placement, the next item appears automatically. Use the arrows and Enter to place it. There is no extra Enter step to reveal it.

## Scoring

Scores are integers from 0 to 100. After completing all twelve positions:

```js
Math.round((12 / (12 + wrongtries)) * 100)
```

| Wrong attempts | Total attempts | Final score |
| ---: | ---: | ---: |
| 0 | 12 | 100 |
| 1 | 13 | 92 |
| 3 | 15 | 80 |
| 12 | 24 | 50 |

The game submits only after completion, using `../js/game-score.js` with game ID `011-m` and game name `मासाः`. It sends the selected content set, correct placements, wrong attempts, total attempts, and elapsed play time as metrics.

Signed-out users can finish and view their local score. They must sign in to Zat.am and retry saving to submit it. Failed submissions expose a retry button. The game prevents concurrent saves and further saves after a successful submission. **Play Again** reloads the page to start a new run.

## Content options

The existing query parameters are preserved:

| Parameter | Content |
| --- | --- |
| No `s`, or `s=0` | Sanskrit month names |
| `s=1` | Month names ending in मासः |
| `s=2` | Twelve Surya Namaskar invocations |
| `s=3` | Devanagari numbers १–१२ |
| `t=1` | Show ITRANS transliteration of the active item when Sanscript is available |

Example: `http://localhost:8000/011-m/?s=0&t=1`.

Invalid or out-of-range content-set values fall back to `s=0`. On-page instructions currently describe the default month set and are in English. An instructions-language toggle is not implemented.

## Files and dependencies

| File | Purpose |
| --- | --- |
| `index.html` | Game markup, English instructions, win dialog, and inline game logic |
| `months.css` | Board, instructions panel, popup, and responsive styling |
| `sun.gif`, `sun.png` | Original centre images |
| `cover.jpg` | Game cover asset |
| `../shared/game-theme.css` | Shared Zat.am theme |
| `../js/navbar-loader.js` | Shared navigation loader |
| `../js/game-score.js` | Shared score submission and authentication integration |

Sanscript 1.1.0 is loaded from jsDelivr for optional transliteration. Missing Sanscript does not prevent basic game play. Shared scoring depends on the portal's configured Firebase services and authentication.

The board and instructions are separate panels. The instructions panel uses internal scrolling when its content exceeds its height. The win result uses a native modal `<dialog>` and does not append an expanded result section below the board.

## Validation

Automated logic review on 19 October 2026 used the source at branch `mehakdeep-011-m`, commit `feff486e8a4af5de1bf3d0770e5348dc8203e081`.

All 17 Node VM checks passed using a simulated DOM and mocked score API. Coverage included initialization, Enter controls, arrow wrapping, fixed positions, correct/incorrect placements, click handling, drag/drop event logic, immediate next-item display, all four content sets, scoring, completion dialog invocation, save/retry responses, invalid parameters, and optional transliteration.

These checks do not establish physical browser dragging, layout quality, real device behavior, or live Firebase writes. Browser execution was unavailable in that review environment.

Before marking the game fully complete:

- Test real dragging and clicking on desktop, and tapping on a phone.
- Check the board, visible controls, instructions scrolling, and popup at narrow and wide viewport widths.
- Confirm a signed-in completed run appears on the actual leaderboard with the correct score and game ID.
- Confirm Play Again starts a fresh run.
- Update the on-page instructions to say the next month appears automatically after a correct placement.

## Optional code organization

The inline script can be moved unchanged into `months.js` and loaded after the markup with `<script src="months.js"></script>`. Keep it as a classic script while the HTML uses inline event handlers such as `onclick`, `ondrop`, and `ondragstart`; those handlers require global functions. A module conversion would also require replacing the inline handlers with event listeners.
