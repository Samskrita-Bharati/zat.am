# सर्पलीला — Snake Game

सर्पलीला is a Zat.am Snake game that uses Devanagari numerals on the board and in the score display. Guide the snake to its numbered food, grow longer, and try to beat your best score.

## How to play

1. Open the game and select **Play Now**. Use **HOWTO** on the welcome screen for the in-game instructions.
2. Press an arrow key to start moving. Use the arrow keys to steer the snake around the board.
3. Eat the numbered food while avoiding the walls and the snake's own body. Each piece of food grows the snake by five segments.
4. After a collision, the result screen shows your score and best score. Choose **Play Again** for a fresh round or **Home** to return to the welcome screen.

The game currently requires a keyboard with arrow keys; it does not provide on-screen direction controls.

## Scoring

- Each piece of food eaten adds one point to the current round's score.
- The **This round** and **Best score** displays use Devanagari numerals, as does the numbered food.
- The best score is saved in the browser's local storage under `highscore`. It is local to that browser and site origin, and may be lost if site data is cleared.

## Run locally

From the repository root, install the dependencies and start the development server:

```sh
npm install
npm run dev
```

Open the local address printed by Vite followed by `/047-sl/` (for example, `http://localhost:5173/047-sl/`). Serve the complete repository rather than opening the HTML file directly: the game uses JavaScript modules and shared site files.

## Files

- `index.html` and `css/index.css` provide the welcome screen and instructions.
- `content/game.html` and `css/style.css` provide the game screen, board styling, and result dialog.
- `scripts/game.js` runs the game loop, score display, and restart flow.
- `scripts/snake.js`, `scripts/food.js`, `scripts/grid.js`, and `scripts/input.js` handle movement, food, board boundaries, and keyboard input.
- `../shared/game-theme.css` and `../js/navbar-loader.js` supply the shared Zat.am theme and navigation.

The pages also load Sanscript from a CDN. The shared navigation and its related services may require network access.
