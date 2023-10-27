var digits = {
  "deckId": "digits",
  "deckTitle": "Sanskrit Digits",
  "landingPage": "index.html",
  "initialScript": "Unicode",
  "scriptCanBeSet": false,
  "mainPartFontSize": "32pt",
  "showAudioWithLocalNameQuiz": false,
  "showAudioWithUrNameQuiz": false,
  "showAudioWithUrnameQuizAnswers": true,
  "showDescription": false,
  "groupCanBeSet": true,
  "groupDisplay": "Group",
  "trainingModes": [
    "Review",
    "Urname",
    "LocalName"
  ],
  "pluralSubjectName": "Digits",
  "copyrightNotice": "Audio excerpted from Pravesha © Samskrita Bharati 2014",
  "numChoices": 10,
  "trainModeDisplay": {
    "Review": "Review",
    "Urname": "Devanagari",
    "LocalName": "ISO 15919 (Latin)",
  },
  "scriptHeading": "Sanskrit Script",
  "allSubjects": [
    {
      "subjectId": 1,
      "audioUrl": "decks/digits/assets/audio/00000001.mp3",
      "unicode": "१",
      "latin": "",
      "localNames": ["1"],
      "description": "",
      "group": "1-10",
    },
    {
      "subjectId": 2,
      "audioUrl": "decks/digits/assets/audio/00000002.mp3",
      "unicode": "२",
      "latin": "",
      "localNames": ["2"],
      "description": "",
      "group": "1-10",
    },
    {
      "subjectId": 3,
      "audioUrl": "decks/digits/assets/audio/00000003.mp3",
      "unicode": "३",
      "latin": "",
      "localNames": ["3"],
      "description": "",
      "group": "1-10",
    },
    {
      "subjectId": 4,
      "audioUrl": "decks/digits/assets/audio/00000004.mp3",
      "unicode": "४",
      "latin": "",
      "localNames": ["4"],
      "description": "",
      "group": "1-10",
    },
    {
      "subjectId": 5,
      "audioUrl": "decks/digits/assets/audio/00000005.mp3",
      "unicode": "५",
      "latin": "",
      "localNames": ["5"],
      "description": "",
      "group": "1-10",
    },
    {
      "subjectId": 6,
      "audioUrl": "decks/digits/assets/audio/00000006.mp3",
      "unicode": "६",
      "latin": "",
      "localNames": ["6"],
      "description": "",
      "group": "1-10",
    },
    {
      "subjectId": 7,
      "audioUrl": "decks/digits/assets/audio/00000007.mp3",
      "unicode": "७",
      "latin": "",
      "localNames": ["7"],
      "description": "",
      "group": "1-10",
    },
    {
      "subjectId": 8,
      "audioUrl": "decks/digits/assets/audio/00000008.mp3",
      "unicode": "८",
      "latin": "",
      "localNames": ["8"],
      "description": "",
      "group": "1-10",
    },
    {
      "subjectId": 9,
      "audioUrl": "decks/digits/assets/audio/00000009.mp3",
      "unicode": "९",
      "latin": "",
      "localNames": ["9"],
      "description": "",
      "group": "1-10",
    },
    {
      "subjectId": 10,
      "audioUrl": "decks/digits/assets/audio/00000010.mp3",
      "unicode": "१०",
      "latin": "",
      "localNames": ["10"],
      "description": "",
      "group": "1-10",
    },
    {
      "subjectId": 20,
      "audioUrl": "decks/digits/assets/audio/00000020.mp3",
      "unicode": "२०",
      "latin": "",
      "localNames": ["20"],
      "description": ""
    },
    {
      "subjectId": 30,
      "audioUrl": "decks/digits/assets/audio/00000030.mp3",
      "unicode": "३०",
      "latin": "",
      "localNames": ["30"],
      "description": ""
    },
    {
      "subjectId": 40,
      "audioUrl": "decks/digits/assets/audio/00000040.mp3",
      "unicode": "४०",
      "latin": "",
      "localNames": ["40"],
      "description": ""
    },
    {
      "subjectId": 50,
      "audioUrl": "decks/digits/assets/audio/00000050.mp3",
      "unicode": "५०",
      "latin": "",
      "localNames": ["50"],
      "description": ""
    },
    {
      "subjectId": 60,
      "audioUrl": "decks/digits/assets/audio/00000060.mp3",
      "unicode": "६०",
      "latin": "",
      "localNames": ["60"],
      "description": ""
    },
    {
      "subjectId": 70,
      "audioUrl": "decks/digits/assets/audio/00000070.mp3",
      "unicode": "७०",
      "latin": "",
      "localNames": ["70"],
      "description": ""
    },
    {
      "subjectId": 80,
      "audioUrl": "decks/digits/assets/audio/00000080.mp3",
      "unicode": "८०",
      "latin": "",
      "localNames": ["80"],
      "description": ""
    },
    {
      "subjectId": 90,
      "audioUrl": "decks/digits/assets/audio/00000090.mp3",
      "unicode": "९०",
      "latin": "",
      "localNames": ["90"],
      "description": ""
    },
    {
      "subjectId": 100,
      "audioUrl": "decks/digits/assets/audio/00000100.mp3",
      "unicode": "१००",
      "latin": "",
      "localNames": ["100"],
      "description": ""
    },
    {
      "subjectId": 1000,
      "audioUrl": "decks/digits/assets/audio/00001000.mp3",
      "unicode": "१०००",
      "latin": "",
      "localNames": ["1000"],
      "description": ""
    },
    {
      "subjectId": 100000,
      "audioUrl": "decks/digits/assets/audio/00100000.mp3",
      "unicode": "१,००,०००",
      "latin": "",
      "localNames": ["1,00,000"],
      "description": ""
    },
    {
      "subjectId": 10000000,
      "audioUrl": "decks/digits/assets/audio/10000000.mp3",
      "unicode": "१,००,००,०००",
      "latin": "",
      "localNames": ["1,00,00,000"],
      "description": ""
    },
  ]
}

var app = Elm.Main.init({
  node: document.getElementById('elm'),
  flags: digits
});