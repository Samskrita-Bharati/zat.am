# Arrange सुभाषितम्

A Sanskrit word-order game. Each round presents one subhāṣita (saying) split
into segments. Place the numbered cards onto the matching segments to rebuild
the saying in its original order.

## How to play

1. Choose a number card, then choose the segment that belongs in that position.
   You can also drag the card onto its matching segment.
2. A correct match locks the card in place. A wrong match costs 5 points.
3. Complete every match to see your final score and save it to the leaderboard
   when signed in.
4. Use **Next shloka** to move through all 16 sayings. You can open a specific
   saying with `?snum=0` through `?snum=15` in the URL.

## Scoring

- Every shloka starts at 100 points.
- The timer begins with the first number-card selection or card drop.
- There is a time allowance of at least 30 seconds (15 seconds per segment for
  longer sayings). After that, the score loses 1 point for every 6 seconds.
- Each incorrect card-to-segment match deducts 5 points.
- Scores never fall below 0.

## Run locally

From the repository root:

```powershell
cd C:\Zatam\zat.am-018-as
npm install
npm run dev
```

Open the URL printed by Vite, then go to:

`http://localhost:5173/018-as/`

## Files

- `index.html` contains the game, sayings, interaction logic, scoring, and
  leaderboard integration.
- `../shared/ordering-game-theme.css` provides the game board layout and
  responsive styles.
- `../shared/game-theme.css` provides the shared Zat.am visual theme.
- `../js/game-score.js` handles score submission and leaderboard status.
- `../js/navbar-loader.js` loads the shared navigation.

## Responsive behavior

The board has two columns on wide screens. On tablet and phone screens, the
number cards and saying segments stack into a single easy-to-tap column. The
progress cards remain in a compact two-column grid, and card text wraps rather
than overflowing.

## Credits

The original drag-and-drop concept was based on
[Jason Chui's CodePen](https://codepen.io/JasonChui/pen/jeZywq), which cites an
[Elated.com drag-and-drop article](http://www.elated.com/articles/drag-and-drop-with-jquery-your-essential-guide/).
