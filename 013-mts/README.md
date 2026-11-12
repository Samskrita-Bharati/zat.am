From https://github.com/berkerol/match-the-numbers

# Match the सङ्ख्या (Match the Numbers)

An interactive Sanskrit number puzzle developed as part of **Zat.am**, a gamified Sanskrit learning platform. Players navigate a grid of Devanagari numerals and strategically change their values until every number reaches the target digit.

The game combines number recognition, logical thinking, and puzzle-solving to make practicing Sanskrit numerals more engaging.

## 🎮 How to Play

The game displays a grid of numbers written in Devanagari script (०–९). One number is highlighted to indicate the player's current position.

1. Use the **arrow keys** to move the highlighted position around the grid.
2. Each valid movement changes a number by one, depending on the selected settings.
3. In **Increase** mode, numbers increase by one and wrap back to the minimum after reaching the maximum.
4. In **Decrease** mode, numbers decrease by one and wrap back to the maximum after reaching the minimum.
5. Complete the puzzle by making every number equal to the target digit.

**Winning condition:**
- In Increase mode, every number must equal the configured maximum digit.
- In Decrease mode, every number must equal the configured minimum digit.

The game ends when all numbers match the target.

## 🕹️ Controls

| Control | Action |
|---|---|
| ↑ | Move up |
| ↓ | Move down |
| ← | Move left |
| → | Move right |
| R | Restart the puzzle |
| S | Open game settings |
| H | Open the instructions page |

On supported mobile layouts, players can use the on-screen directional buttons instead of a keyboard.

## ⚙️ Game Settings

The **Settings** button opens a popup that allows players to customize the puzzle.

| Setting | Description |
|---|---|
| Rows | Number of rows in the puzzle grid |
| Columns | Number of columns in the puzzle grid |
| Min Digit | Minimum number allowed in the puzzle |
| Max Digit | Maximum number allowed in the puzzle |
| Change Target/Source | Choose whether movement changes the destination number or the number being left |
| Increase/Decrease | Choose whether numbers increase or decrease with movement |

The board is regenerated when updated settings are applied.

## 🏆 Scoring and Leaderboard

The game integrates with Zat.am's shared scoring system.

- **Completion score:** 100 points out of 100.
- **Incomplete attempts:** No score is submitted.
- **Move tracking:** Counts valid directional movements.
- **Time tracking:** Measures elapsed gameplay time from the first valid move.
- **Leaderboard integration:** Completed scores are submitted through the shared scoring module when the player is authenticated and the scoring service is available.

The game also records the following metrics with a completed attempt:

- Total moves
- Completion time in seconds
- Number of rows and columns
- Minimum and maximum digits

If online score submission is unavailable, the game still displays the player's local completion result.

**Game ID:** `013-mts`  
**Game name:** `Match the सङ्ख्या`

## 🛠️ Technologies Used

- **HTML5** — Game structure and interface
- **CSS3** — Styling and responsive layout
- **JavaScript** — Game logic, movement, settings, and completion detection
- **HTML5 Canvas** — Rendering the number grid
- **Bootstrap 4** — Interface components and settings modal
- **Sanscript** — Conversion of digits to Devanagari
- **Firebase (via Zat.am shared modules)** — Authentication and leaderboard score storage

## 📁 Project Structure

```text
zat.am/
├── 013-mts/
│   ├── index.html
│   ├── mtn.css
│   ├── mtn.js
│   ├── mts_ins2.html
│   └── README.md
├── shared/
│   └── game-theme.css
└── js/
    └── game-score.js
```

### File Descriptions

| File | Purpose |
|---|---|
| `index.html` | Main game page and user interface |
| `mtn.css` | Game-specific styles and responsive layout |
| `mtn.js` | Core game logic, controls, settings, timer, and score submission |
| `mts_ins2.html` | Game instructions page |
| `README.md` | Project documentation |
| `../shared/game-theme.css` | Shared Zat.am game theme |
| `../js/game-score.js` | Shared leaderboard scoring integration |

## 🚀 Running the Game Locally

### Prerequisites

- A modern web browser
- Git
- Python 3 or another local HTTP server

### Setup

**1. Clone the repository**

```bash
git clone https://github.com/arhamCh24/zat.am.git
```

**2. Navigate to the project directory**

```bash
cd zat.am
```

**3. Start a local development server**

```bash
python -m http.server 8000
```

**4. Open the game in your browser**

```text
http://localhost:8000/013-mts/
```

**Important:** Start the server from the repository root (`zat.am`), not from the `013-mts` directory. This ensures that the shared theme, navigation, Firebase configuration, and scoring modules can be loaded correctly.

An authenticated Zat.am session and a working Firebase connection are required to save leaderboard scores. The game itself can be played without submitting scores.

## 🧠 Game Logic

The puzzle uses a two-dimensional grid represented internally as a one-dimensional JavaScript array.

Each cell contains a numeric value within the configured minimum and maximum range.

### Movement

When a player presses an arrow key:

1. The game checks whether movement is allowed within the grid boundaries.
2. The selected position moves to the adjacent cell.
3. Either the source or destination cell is modified, depending on the settings.
4. The move counter increases.
5. The game checks whether all cells match the target digit.

Invalid movements outside the grid do not count as moves.

### Number Wrapping

Numbers cycle between the configured minimum and maximum.

For example, with a range of 0–3:

**Increase:** `0 → 1 → 2 → 3 → 0`

**Decrease:** `3 → 2 → 1 → 0 → 3`

### Completion Detection

After each valid move, the game checks whether every number equals the target value.

When the condition is satisfied:

- The game stops accepting movement.
- The timer stops.
- The completion panel displays the final score, moves, and time.
- The game attempts to submit the score through Zat.am's shared scoring system.
- The player can start a new puzzle using **Play Again**.

## 🎨 Zat.am Theme Integration

The game uses the shared Zat.am theme to maintain a consistent visual experience across the platform.

The interface includes:

- Shared game layout and typography
- Styled controls and instruction sections
- Move, time, and score indicators
- Responsive game layout
- Completion feedback and leaderboard submission status

Game-specific styling is maintained in `mtn.css`, while common styling is provided by `../shared/game-theme.css`.

## 🔮 Potential Future Improvements

- Multiple difficulty presets
- Score calculation based on moves and completion time
- Hints for difficult puzzles
- Puzzle-solving animations
- Improved mobile touch interactions
- Sound effects and visual feedback for successful moves

## 📄 Project Information

**Project:** Zat.am — Gamified Sanskrit Learning  
**Game:** 013 — Match the सङ्ख्या  
**Repository:** https://github.com/arhamCh24/zat.am

Developed as part of the Zat.am game collection to support interactive Sanskrit learning.