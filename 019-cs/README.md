# चित्र-समस्या — Picture Puzzle

Arrange the pieces to complete the picture. Drag pieces to move them; use the
controls to zoom or preview the completed image. The Sanskrit word above the
play area is a hint for the current picture.

## Game features

- The timer starts with the first interaction in the puzzle.
- A completed puzzle earns 100 points. After 20 seconds, the score drops by
  5 points for each full 10 seconds elapsed, to a minimum of 0.
- The final score is submitted to the shared leaderboard when the player is
  signed in. The completion popup reports whether the score was saved.
- The word-set selector reloads the game with the selected set in the `s` URL
  parameter. Local puzzle image sets 0 through 16 are available.
- The layout adapts to small screens, with the word-set selector above the
  score and timer and the puzzle controls arranged along the bottom of the play
  area.

## Files and data

- `index.html` contains the game UI, puzzle interaction, timer, scoring, and
  leaderboard integration.
- `Puzzle.css` styles the play area and responsive layout using shared theme
  colors and components.
- `js/paper.js` is the Paper.js library used to render and manipulate pieces.
- `js/score-config.js` contains the initial score, deduction delay, deduction
  interval, and points deducted per interval.
- `../shared/game-theme.css` provides shared game styling.
- `../js/game-score.js` handles leaderboard score submissions.
- `../js/navbar-loader.js` loads the shared site navigation.
- `../img/0/` through `../img/16/` contain the local puzzle pictures. Other
  interface images are also in `../img/`.
- `https://zat.am/cmpk-jul.json` provides word-set names and Sanskrit hints.

The puzzle is based on [Html5 Jigsaw Puzzle](https://www.codeproject.com/Articles/395453/Html5-Jigsaw-Puzzle)
by Marcelo Ricardo de Oliveira and uses Paper.js.
