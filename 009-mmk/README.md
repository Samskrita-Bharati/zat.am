# 009-mmk — Memory क्रीडा

A Sanskrit memory-matching game where players match pictures with the corresponding Sanskrit words.

## Original Source

This game was originally based on:

https://github.com/amrali21/dynamic-memory-game

It has since been adapted for Zat.am and updated to use the shared Zat.am game theme and scoring system.

## How to Play

- The board contains 12 matching picture-and-word pairs.
- Select two cards at a time.
- Match each picture with the correct Sanskrit word.
- The game is complete when all 12 pairs have been matched.

## Scoring

The game uses the shared Zat.am scoring system:

`/js/game-score.js`

The final score is between **0 and 100**.

### Score Formula

- Starting score: **100**
- Each wrong move: **-5 points**
- First 2 minutes: **no time penalty**
- After 2 minutes: **-1 point for every additional full minute**
- Maximum time penalty: **20 points**
- Minimum final score: **0**

The score is submitted only after the player completes all 12 pairs.

The player's completion time, wrong moves, and match count are also recorded with the score.

## Zat.am Shared Theme

The game uses:

`/shared/game-theme.css`

The shared theme provides consistent styling for:

- Game title
- Instructions
- Score and statistics
- Buttons
- Progress display
- Completion result
- Responsive/mobile layout

The Memory board keeps its own game-specific styling in:

`009-mmk/mmk.css`

## Game Statistics

During gameplay, the page displays:

- Score
- Wrong Moves
- Time
- Matches completed
- Progress bar

## URL Options

The existing game supports several query-string options.

### Open Mode

```text
?o=1
```
