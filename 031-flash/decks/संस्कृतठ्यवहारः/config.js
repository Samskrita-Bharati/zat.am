var संस्कृतठ्यवहारः = {
  "deckId": "संस्कृतठ्यवहारः",
  "deckTitle": "Sanskrit Common Phrases",
  "landingPage": "index.html",
  "initialScript": "Unicode",
  "scriptCanBeSet": true,
  "mainPartFontSize": "32pt",
  "showAudioWithUrNameQuiz": false,
  "showDescription": false,
  "trainingModes": [
    "Review",
    "Urname",
    "LocalName"
  ],
  "pluralSubjectName": "Sentences",
  "copyrightNotice": "",
  "numChoices": 4,
  "trainModeDisplay": {
    "Review": "Review",
    "Urname": "Sanskrit",
    "LocalName": "English",
  },
  "scriptHeading": "Sanskrit Script",
  "allSubjects": [
    {
      "subjectId": 0,
      "audioUrl": "decks/संस्कृतठ्यवहारः/assets/audio/हरिः-ॐ.mp3",
      "unicode": "हरिः ॐ",
      "latin": "hariḥ oṃ",
      "localName": "Hello",
      "description": ""
    },
    {
      "subjectId": 1,
      "audioUrl": "decks/संस्कृतठ्यवहारः/assets/audio/नमस्ते.mp3",
      "unicode": "नमस्ते",
      "latin": "namastē",
      "localName": "I bow to you",
      "description": "long velar vowel"
    },
    {
      "subjectId": 2,
      "audioUrl": "decks/संस्कृतठ्यवहारः/assets/audio/धन्यवादः.mp3",
      "unicode": "धन्यवादः",
      "latin": "dhanyavādaḥ",
      "localName": "Thank you",
      "description": ""
    },
    {
      "subjectId": 3,
      "audioUrl": "decks/संस्कृतठ्यवहारः/assets/audio/स्वागतम्.mp3",
      "unicode": "स्वागतम्",
      "latin": "svāgatam",
      "localName": "Welcome",
      "description": ""
    },
  ]
}

var app = Elm.Main.init({
  node: document.getElementById('elm'),
  flags: संस्कृतठ्यवहारः
});