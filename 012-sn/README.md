# सूर्यनमस्कारः — Surya Namaskar Sequence Game

Place twelve Sanskrit Surya Namaskar invocations in their correct numbered positions around a fixed ring. The game uses Zat.am's shared theme, navigation, and score submission.

## Run

From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/012-sn/`. Serve the whole repository so that the shared CSS, navigation, and scoring module can load. Do not open the HTML through a `file://` URL.

## Controls

- Click **आरम्भ** or press **Enter** to start.
- Drag the displayed invocation into its correct slot, or click/tap the slot.
- Use **Left/Right Arrow** to select a fixed numbered slot, then **Enter** to place the invocation.
- A correct answer immediately displays the next unplaced invocation.
- Click **अग्रिमम्**, or Tab to it and press Enter, to select a random unplaced invocation without a penalty. Random selection may show the same item again.
- An incorrect placement in an empty slot adds one wrong attempt. Filled slots ignore further placements.
- Finish all twelve placements to open the win popup. **Play Again** reloads the game.

The default sequence begins with **ॐ मित्राय नमः** at position **१**, continuing clockwise.

## Scoring

```js
Math.round((12 / (12 + wrongtries)) * 100)
```

| Wrong attempts | Score |
| ---: | ---: |
| 0 | 100 |
| 1 | 92 |
| 3 | 80 |
| 12 | 50 |

The game submits only after completion through `../js/game-score.js`, using game ID **`012-sn`** and game name **`सूर्यनमस्कारः`**. Metrics include the content set, correct placements, wrong attempts, total attempts, and elapsed play time.

Signed-out players can see their local score. Sign in to Zat.am and retry saving to submit it. Failed saves show a retry button. Saving is guarded against concurrent requests and further submissions after success.

## Preserved content options

| Query | Content |
| --- | --- |
| No `s`, or `s=0` | Twelve Surya Namaskar invocations |
| `s=1` | Twelve Sanskrit months |
| `s=2` | Devanagari numbers १–१२ |
| `t=1` | ITRANS transliteration of the displayed item, when Sanscript is available |

Example: `http://localhost:8000/012-sn/?s=0&t=1`. Invalid set values fall back to the default invocations. English instructions describe the default set.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Board, English instructions, win dialog, script references |
| `surya.css` | Game styling, separate instructions panel, responsive sizing, popup |
| `surya.js` | Content sets, controls, placement, progress, scoring, and saving |
| `sun.gif`, `sun.png` | Original centre images; keep these existing files |
| `cover.jpg` | Existing game cover |

Shared dependencies: `../shared/game-theme.css`, `../js/navbar-loader.js`, and `../js/game-score.js`. Optional transliteration uses Sanscript 1.1.0 from jsDelivr. Game play continues when Sanscript is unavailable. Live score saving requires the portal's configured authentication and Firebase services.

`surya.js` is intentionally a classic script: inline HTML event handlers call its global functions.

## Validation

On 19 October 2026, 16 automated Node VM checks passed with a simulated DOM and mocked scoring. Coverage included start and Enter controls, fixed positions, arrow wrapping, correct and incorrect placements, click handling, drag/drop event logic, automatic next items, all three content sets, score calculations, win-dialog invocation, save/retry responses, invalid parameters, and transliteration behavior.

The three original content arrays and their ordering were preserved. These tests do not verify physical browser dragging, screen layout, actual phone interaction, or live leaderboard writes.

Before release, manually check desktop dragging, phone tapping, instructions scrolling, the popup, Play Again, and one signed-in completed score on the leaderboard. Instructions scroll internally when their content exceeds the panel height.
