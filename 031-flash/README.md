# Sanskrit Flash Cards

A Sanskrit learning game with six focused flash-card decks. Each deck supports
calm review and randomized quiz practice, with text, images, and audio where
the deck provides them.

## Decks

- **Alphabet** — Sanskrit vowels and consonants.
- **Conjunct consonants** — common consonant combinations.
- **Common phrases** — everyday Sanskrit expressions.
- **Digits** — Sanskrit numbers and place values.
- **Numbers** — expanded number practice.
- **Present tense** — third-person singular Sanskrit sentences.

## How to use a deck

1. Open a deck from the landing page.
2. Choose **Review** to browse every card, or choose a quiz mode to practice.
3. Select the script, group, and question type where the deck offers those
   options.
4. Use **Next** and **Previous** in review mode. Quiz decks randomize the cards
   and show your score and progress.
5. Use **Change Deck** to return to the deck chooser.

On phones, tap the answer options and controls. Audio controls, images, text
answers, and navigation buttons resize to fit the screen.

## Run locally

From the repository root:

```powershell
cd C:\Zatam\zat.am-031-flash
npm install
npm run dev
```

Open the URL printed by Vite, then visit:

`http://localhost:5173/031-flash/`

## Project structure

- `index.html` is the deck chooser.
- `index-*.html` starts each individual deck.
- `decks/<deck>/config.js` supplies a deck's card data and settings.
- `decks/<deck>/assets/` contains its audio and image material.
- `src/` contains the Elm source for the shared flash-card experience.
- `elm.js` is the compiled Elm application used by the deck pages.
- `styles.css` provides the flash-card and phone-responsive styles.
- `../shared/game-theme.css` and `../js/navbar-loader.js` provide the Zat.am
  landing-page theme and navigation.

## Rebuilding the Elm application

The repository includes the compiled `elm.js`, so normal local play does not
require Elm. If you change files under `src/`, install Elm and rebuild it:

```powershell
elm make src/Main.elm --optimize --output=elm.js
```

## License

See [LICENSE](LICENSE).
