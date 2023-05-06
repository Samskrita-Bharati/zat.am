var संस्कृतठ्यवहारः = {
  "deckId": "phrases",
  "deckTitle": "Sanskrit Common Phrases",
  "landingPage": "index.html",
  "initialScript": "Unicode",
  "scriptCanBeSet": true,
  "autoPlayCanBeSet": true,
  "mainPartFontSize": "32pt",
  "showAudioWithUrNameQuiz": false,
  "showAudioWithLocalNameQuiz": true,
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
      "audioUrl": "decks/phrases/assets/audio/hariḥ-ōṁ.mp3",
      "unicode": "हरिः ॐ",
      "latin": "hariḥ ōṁ",
      "localName": "Hello",
      "description": ""
    },
    {
      "subjectId": 1,
      "audioUrl": "decks/phrases/assets/audio/namastē.mp3",
      "unicode": "नमस्ते",
      "latin": "namastē",
      "localName": "I bow to you",
      "description": ""
    },
    {
      "subjectId": 2,
      "audioUrl": "decks/phrases/assets/audio/namaskāraḥ.mp3",
      "unicode": "नमस्कारः",
      "latin": "namaskāraḥ",
      "localName": "Salutations",
      "description": ""
    },
    {
      "subjectId": 3,
      "audioUrl": "decks/phrases/assets/audio/suprabhātam.mp3",
      "unicode": "सुप्रभातम्",
      "latin": "suprabhātam",
      "localName": "Good morning",
      "description": ""
    },
    {
      "subjectId": 4,
      "audioUrl": "decks/phrases/assets/audio/śubhamadhyāhnaḥ.mp3",
      "unicode": "शुभमध्याह्नः",
      "latin": "śubhamadhyāhnaḥ",
      "localName": "Good afternoon",
      "description": ""
    },
    {
      "subjectId": 5,
      "audioUrl": "decks/phrases/assets/audio/śubhasandhyā.mp3",
      "unicode": "शुभसन्ध्या",
      "latin": "śubhasandhyā",
      "localName": "Good evening",
      "description": ""
    },
    {
      "subjectId": 6,
      "audioUrl": "decks/phrases/assets/audio/śubharātriḥ.mp3",
      "unicode": "शुभरात्रिः",
      "latin": "śubharātriḥ",
      "localName": "Good night",
      "description": ""
    },
    {
      "subjectId": 7,
      "audioUrl": "decks/phrases/assets/audio/dhanyavādaḥ.mp3",
      "unicode": "धन्यवादः",
      "latin": "dhanyavādaḥ",
      "localName": "Thank you",
      "description": ""
    },
    {
      "subjectId": 8,
      "audioUrl": "decks/phrases/assets/audio/svāgatam.mp3",
      "unicode": "स्वागतम्",
      "latin": "svāgatam",
      "localName": "Welcome",
      "description": ""
    },
    {
      "subjectId": 9,
      "audioUrl": "decks/phrases/assets/audio/mānyē.mp3",
      "unicode": "मान्ये",
      "latin": "mānyē",
      "localName": "Madam",
      "description": ""
    },
    {
      "subjectId": 10,
      "audioUrl": "decks/phrases/assets/audio/āryē.mp3",
      "unicode": "आर्ये",
      "latin": "āryē",
      "localName": "Madam!",
      "description": ""
    },
    {
      "subjectId": 11,
      "unicode": "श्रीमन्",
      "latin": "śrīman",
      "localName": "Sir",
      "description": "invocative use"
    },
    {
      "subjectId": 12,
      "unicode": "अस्तु",
      "latin": "astu",
      "localName": "All right/OK",
      "description": ""
    },
    {
      "subjectId": 13,
      "unicode": "कृपया",
      "latin": "kṛpayā",
      "localName": "Please",
      "description": ""
    },
    {
      "subjectId": 14,
      "unicode": "चिन्ता मास्तु",
      "latin": "cintā māstu",
      "localName": "Don't worry",
      "description": ""
    },
    {
      "subjectId": 15,
      "unicode": "क्षम्यताम्",
      "latin": "kṣamyatām",
      "localName": "Excuse me",
      "description": ""
    },
    {
      "subjectId": 16,
      "unicode": "पुनः मिलामः",
      "latin": "punaḥ milāmaḥ",
      "localName": "See you again",
      "description": ""
    },
    {
      "subjectId": 17,
      "unicode": "साधु साधु",
      "latin": "sādhu sādhu",
      "localName": "Very good",
      "description": ""
    },
    {
      "subjectId": 18,
      "unicode": "उत्तमम्",
      "latin": "uttamam",
      "localName": "Good",
      "description": ""
    },
    {
      "subjectId": 19,
      "unicode": "बहु समीचीनम्",
      "latin": "bahu samīcīnam",
      "localName": "Very fine",
      "description": ""
    },
    {
      "subjectId": 20,
      "unicode": "शुभाशयाः",
      "latin": "śubhāśayāḥ",
      "localName": "Best wishes",
      "description": ""
    },
    {
      "subjectId": 21,
      "unicode": "अभिनन्दनानि",
      "latin": "abhinandanāni",
      "localName": "Congratulations",
      "description": ""
    },
  ]
}

var app = Elm.Main.init({
  node: document.getElementById('elm'),
  flags: संस्कृतठ्यवहारः
});