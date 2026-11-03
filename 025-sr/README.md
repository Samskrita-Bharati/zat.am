# Arrange सङ्क्षेपरामायणम्

A Sanskrit verse-order game based on the *Sankṣepa Rāmāyaṇam*. Each round
splits one verse into segments. Match the numbered cards to the segments to
rebuild the verse in its original order.

## How to play

1. Select a number card, then select the segment that belongs in that position.
   You can also drag a card onto its matching segment on devices that support
   dragging.
2. Correct matches lock into place. A wrong match costs 5 points.
3. Complete every segment to see the result and save your score to the
   leaderboard when signed in.
4. Use **Next verse** to move through all 100 verses. To open a particular
   verse, add `?s=1` through `?s=100` to the game URL.

## Scoring

- Every verse starts at 100 points.
- The timer starts with the first number-card selection or card drop.
- You receive at least 30 seconds, or 15 seconds per segment for longer
  verses. After that allowance, the score loses 1 point every 6 seconds.
- Each incorrect card-to-segment match deducts 5 points.
- Scores do not drop below 0.

## Run locally

From the repository root:

```powershell
cd C:\Zatam\zat.am-025-sr
npm install
npm run dev
```

Open the URL printed by Vite, then go to:

`http://localhost:5173/025-sr/`

## Files

- `index.html` contains the verse data connection, ordering game, scoring, and
  leaderboard integration.
- `../sr100.js` contains the 100 Sankṣepa Rāmāyaṇam verses.
- `../shared/ordering-game-theme.css` provides the board layout and responsive
  phone styles.
- `../shared/game-theme.css` provides the shared Zat.am visual theme.
- `../js/game-score.js` handles score submission and leaderboard status.
- `../js/navbar-loader.js` loads the shared navigation.

## Phone play

On a phone, tap a number card and then its matching verse segment. The number
cards are compact and remain visible while you scroll through the verse
segments. Dragging is optional on touch screens.

## Reference

The source text is the [Valmiki Ramayana](https://www.valmiki.iitk.ac.in/sloka?field_kanda_tid=1&language=dv&field_sarga_value=1).
