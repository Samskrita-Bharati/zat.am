var sentences = {
  "deckId": "pres-3-sing",
  "deckTitle": "Present-3rd Person-Singular",
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
      "audioUrl": null,
      "unicode": "बालः धावति",
      "latin": "Bālaḥ dhāvati",
      "localName": "A boy runs.",
      "description": ""
    },
    {
      "subjectId": 1,
      "audioUrl": null,
      "unicode": "बाला गच्छति",
      "latin": "Bālā gacchati",
      "localName": "A girl goes.",
      "description": ""
    },
    {
      "subjectId": 2,
      "audioUrl": null,
      "unicode": "अश्वः धावति",
      "latin": "Aśvaḥ dhāvati",
      "localName": "The horse eats.",
      "description": ""
    },
    {
      "subjectId": 3,
      "audioUrl": null,
      "unicode": "सः पचति",
      "latin": "Saḥ pacati",
      "localName": "He cooks.",
      "description": ""
    },
    {
      "subjectId": 4,
      "audioUrl": null,
      "unicode": "अम्बा पचति",
      "latin": "Ambā pacati",
      "localName": "Mother sings.",
      "description": ""
    },
    {
      "subjectId": 5,
      "audioUrl": null,
      "unicode": "जनकः पठति",
      "latin": "Janakaḥ paṭhati",
      "localName": "Father reads.",
      "description": ""
    },
  ]
}

var app = Elm.Main.init({
  node: document.getElementById('elm'),
  flags: sentences
});