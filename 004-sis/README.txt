The original source of this repository is https://github.com/artbtjr/Sudoku

I have modified some of the code and using it for educational purposes only!

----------------------- README ---------------------------

SudokUber: Front End Engineer Coding Challenge for Uber Inc.

Created by Art Tucay Jr.

GitHub repository: https://github.com/artbtjr/Sudoku



Languages:

HTML/CSS
JavaScript



Software pattern:

MVC:
	Model: sudoku.js
	View: sudoku.html (HTML elements, and some related JavaScript functions)
	Controller: sudoku.html (JQuery, and some related JavaScript functions)



sudoku.js methods:

	generateSudoku(): initializes basic grid[][] and empty grid[][], calls shuffle() and hideTiles().

	getTileNumber(row, col): returns the value of the hiddenGrid at [row][col].

	getSolution(row, col): returns the value of the grid at [row][col].

	isValid(fGrid, row, col, val): calls countInstances() on columnToArray() and subsquareToArray() and returns true if row count, column count, and subsquare count of val equals 1.

	columnToArray(fGrid, col): returns an array of the first value of every array in grid.

	subsquareToArray(fGrid, col): returns an array of a 3x3 section of the grid.

	countInstances(arr, val): returns a count of val in arr[].

	shuffle(grid): performs four steps to shuffle the grid: 1. swap the same columns of each subsquare 25 times, 2. swap all columns within each subsquare 25 times, 3. swap all rows within each subsquare 25 times, 4. swap one number with another 25 times.

	hideTiles(grid, hiddenGrid): copies shuffled grid into hiddenGrid and randomly chooses 6 to 7 tiles to hide among the 9 tiles available per line. This process is mirrored 180 degrees by subtracting the location of the chosen tile from (8, 8). The middle row performs the same function, but only to the first 4 tiles of the row. The middle tile is always visible.



sudoku.html methods:

	init(): intiates generateSudoku() and assigns every tile with their number, class, and onClick function.

	tOnClick(): called by JQuery click functions; sets a selectedTile variable with a class, or calls deselect() and removes the number pad from view.

	numberPad(value): sets a value to a selected tile and hides the number pad, and then checks if the fGrid from getFinishedGrid() using checkForEmptyCells(). If true, checks for a class name and calls isValid(). Displays a win screen if there are no errors in the puzzle.

	getFinishedGrid(): returns fGrid[][] with all values currently displayed in the grid.

	checkForEmptyCells(): returns true if all cells are full.

	deselect(): sets selectedTile variable to null.

	newGame(): reloads the page.

	solve(): sets every tile with the respective value from the unhidden grid.



Libraries, Applications, and Technologies:

JQuery 2.0 Compressed: used for easier onclick funtionality and effects.
Sublime Text Editor: used as the base script editor for color-coded HTML, CSS, and JavaScript.
JSHint: used to locate and correct JavaScript syntax errors quickly.
Jade: used for fast HTML preprossesing.
Adobe Photoshop CS6: used for the creation of the logo and easy hex color access.



Browsers and environments tested in:

Mozilla Firefox 35.0.1
Internet Explorer 10/11.0.96
Google Chrome 40.0.2214.93
Android 4.4.4 with Google Chrome 40.0.2214.89
iOS (Safari version unconfirmed)



Imported fonts:

Rakoon by Mans Greback (Used in logo design)



Trade-offs:

1. A number pad was chosen over keyboard listeners to provide mobile users an easier experience and desktop users the ability to play using only the mouse.

2. Simple and flat colors and layouts were chosen over gradients and embossing in order to keep the page clean and uncluttered. The colors are actually duller than they seem, but the white backdrop enhances their saturation, helping users draw their attention to important elements of the web page.

3. There are four rules to sudoku:
	1. A number from 1 to 9 may only appear once in every row and column.
	2. A number from 1 to 9 may only appear once in each 3x3 subsquare.
	3. Every empty cell should be mirrored in 180 degrees.
	4. Every sudoku puzzle must have only one solution available.
In the interest of time, each board is randomly generated, so it is possible that more than one solution is possible. Instead, the first three rules were implemented, while randomly generated boards simulate a "scattered" board.

4. Hover coloring was implemented to accompany the initial user reaction of mouse movement (or screen touch for mobile users). As users move their mouse over the table, instant color changes help confirm that the table is interactive.

5. JQuery was incorporated early in development to provide easier manipulation of onclick events and fading animations, along with other JQuery options.

6. It was ultimately decided that no hints for incorrect number choices (i.e. coloring the font a different color if the number was already within the row/column/subsquare) would be provided, to make the puzzles more difficult and closer to their paper counterparts.



Changes if more time was available:

1. Create boards with unique solutions instead of randomly generated hidden tiles.

2. Note and highlight functions to help users keep track of their progress.

3. Level options: Easy, Medium, and Hard.

4. A save and load option that exports a user's progress into a string of numbers and vice versa.

5. Revisit the New Game button with function calls instead of simply refreshing the page (refreshing the page may cause problems if the web page housed large-sized objects or live sessions. Fortunately, my web page does not contain any of these).
