004-SIS: Sanskrit Sudoku
========================

1. Game Overview
----------------

This is a 9×9 Sudoku browser game. The board uses Devanagari consonants by
default and can be switched to Devanagari numerals. Select an empty cell and
choose a symbol from the number pad. The game checks a completed board and
shows an error or completion prompt.

This project is adapted from SudokUber by Art Tucay Jr.:
https://github.com/artbtjr/Sudoku

2. How the Game Works
---------------------

- sudoku.js starts with a completed Sudoku grid and shuffles its rows, columns,
  and symbols.
- hideTiles() hides a randomized set of cells. The hidden pattern is mirrored
  across the center of the board.
- index.html initializes the board and handles cell selection, number input,
  switching between consonants and numerals, and completion checks.
- New Game reloads the page and generates a new puzzle. Solve reveals that
  puzzle's generated solution.
- Each puzzle starts with 80 points, reduced by 10 for each incorrect entry
  (minimum 0). Completion within five minutes adds 20 points; completion after
  five and within ten minutes adds 10 points.
- The timer starts with the first board click. After winning, click outside the
  result panel to start a new game.
- The generator does not check whether a puzzle has a unique solution.

3. Data and Caching
-------------------

- No database used. The board and player input are kept in JavaScript memory
  for the current page session.
- Reloading the page discards the current progress and generates a new puzzle.
  Saving and restoring progress is not implemented.
- Score and attempts reset whenever a new game is opened or the page is reloaded.
- Game code and images are stored as static project files.
- index.html loads jQuery 1.12.4 from Google Hosted Libraries.
- No application-level caching or offline storage is implemented.

4. Project Structure
---------------------

index.html
    Game page, board markup, page interactions, and game status prompts.

sudoku.js
    Puzzle generation, shuffling, tile hiding, and Sudoku validation helpers.

style.css
    Sudoku board, number pad, prompt positioning, and small-screen board sizing.

cover.jpg, img/sudokuberlogo.png
    Project cover and game logo assets.

../shared/game-theme.css
    Shared Zat.am game theme for the page shell, title, buttons, play area,
    result and modal prompts, colors, and responsive layout.

../js/navbar-loader.js
    Loads the shared Zat.am navigation bar.

5. Updating Levels and Assets
-----------------------------

Levels:
There is currently no difficulty selection interface. To change how many cells
are hidden or how they are selected, update hideTiles() in sudoku.js. The
current logic randomly selects positions in each row and its mirrored row.
Random positions may repeat, so the number of hidden cells may be lower than
the sum of the random selections. The generator does not guarantee a unique
solution.

Assets and styling:
Replace the game logo by updating img/sudokuberlogo.png and checking its
reference in index.html. Game-specific board styling is in style.css. Shared
page and control styling is in ../shared/game-theme.css. Changes to the shared
theme may affect other games that use it.

6. Incomplete Features
----------------------

- Difficulty selection (Easy, Medium, and Hard).
- Puzzle generation and validation that guarantees a unique solution.
- Notes mode and progress marking or highlighting tools.
- Saving and restoring an unfinished game.
