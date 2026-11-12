# Free Smash

An arcade game for Zat.am. Drag or swipe across the play area to smash illustrated objects. Each object briefly reveals its Sanskrit name and English meaning when smashed.

- **Play** starts the game: keep smashing objects to earn points. A missed object counts as one strike, and the round ends at five strikes.
- Use the pause button or press **P** to pause and resume. The result screen offers another round or a return to the main menu.
- On a phone or tablet, swipe over the objects. If you switch apps or lock the screen, the game pauses so you can resume when you return.

The game displays the number of objects smashed and the current score. Its best score is stored locally in the browser.

## Run locally

From the repository root, run `npm run dev` and open `/048-fs/`.

To check the touch-input regression tests, run `node --test 048-fs/mobile-input.test.cjs` from the repository root.

## Files

- `index.html` contains the page, canvas, HUD, and menus.
- `gameStyle.css` styles the play area and game-specific controls using the shared theme.
- `gameLogic.js` handles rendering, input, vocabulary, and scoring.
- `mobile-input.test.cjs` checks quick touch swipes, tap handling, and interruptions.
- `../shared/game-theme.css` and `../js/navbar-loader.js` provide the shared Zat.am theme and navigation.
