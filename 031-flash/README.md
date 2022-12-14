# flash
Flash card web app supporting multiple choice quizzes, with text, images, and audio. Written in Elm and compiled to javascript.

The cards in a deck are displayed in random order.

Each deck of flash cards contains its own Settings page which can be configured
for each deck.

## Training Mode
The training mode can be set to Review or a variation of a multiple choice quiz.

## Review
In review mode, the cards are displayed with all content and no quiz.
The user can navigate through the cards with Next or Previous buttons.

## Multiple Choice Quiz
For multiple choice quizzes, the correct answer is given in a random position
among a number of wrong answer choices that are randomly selected from other
cards in the deck. The user must select an answer, and a running score
is displayed showing the number correct out of the total number of cards,
and the number of cards remaining. The user can only navigate forwards through
the deck.

## File Structure
An entry page should provide links to decks to choose from. Currently
there is one entry page `index.html` which has links to the
three available sanskrit learning decks,
each of which has its own entry page in the root directory.

The content of a deck is located in `decks` and contains the following
structure:

`<deck name>/`: A directory for the content of a deck
- `config.js`: A javascript file containing the JSON configuration for the deck
- `assets/`
  - `images/`
  - `audio/`

## Decks
The currently available decks include the following:

### **alphabet**
The vowels and consonants in the Devanagari alphabet as it applies to Sanskrit.
Training Modes include:

#### Review
Review the content without a quiz

#### Devanagari
Provide the Devanagari letter given the ISO 15919 representation

#### ISO 15919 (Latin)
Provide the ISO 15919 letter given the Devanagari representation

### **Conjunct Consonants**
Similar to the alphabet deck but for learning conjunct consonants in Devanagari.

### **Present 3rd Person Singular**
Sentences in Sanskrit in the present thrid person singular with training modes for `Review`, `Sanskrit`, and `English`.
Also provides a setting for which script to show Sanskrit in, Devanagari or ISO 15919.

## Run

To try out the app locally, clone the repository then open one of the
index files in a browser. `index.html` is a landing page that
has links to all the Sanskrit decks.

## Build

To build the app, install [elm](https://guide.elm-lang.org/install.html) and then:

    elm make src/Main.elm --optimize --output=elm.js
