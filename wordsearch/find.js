var N_ROWS = 10;
var N_COLS = 10;
var N_WORDS_TO_FIND = 5;

var size = parseInt(getQueryStringValue("size"));
if (size && size >= 4 && size <= 15) {
  N_ROWS = size;
  N_COLS = size;
  N_WORDS_TO_FIND = Math.floor(size / 2);
}

var MAX_MARKER_IDX = 6;
var main = function () {
  drawGrid();
  var nWordsPut = 0;
  do {
    var words = getWordsToFind();
    nWordsPut = putWords(words);
  } while (nWordsPut == 0);
  fillRandom();
  countAnswers();
  hideHint();
  resizeGrid();
  registerEventListeners();
};
var registerEventListeners = function () {
  $("#grid").on("selectstart", function (e) {
    return false;
  });
  $("#grid td").bind("click", cellClick);
};
var drawGrid = function () {
  var table = $("<table></table>");
  var rowIdx = 0;
  var colIdx = 0;
  for (rowIdx = 0; rowIdx < N_ROWS; rowIdx++) {
    var row = $('<tr id="tblRow_"' + rowIdx + '"></tr>');
    for (colIdx = 0; colIdx < N_COLS; colIdx++) {
      var cell = $('<td id="tblCell_' + rowIdx + "_" + colIdx + '"></td>');
      row.append(cell);
    }
    table.append(row);
  }
  $("#grid").append(table);
};

var foundStrings = {}; /* key: cell id. value: a dict of 'match entries' for strings found that pass involve this cell */
var stringToCss = {}; /*key: string that was found. value: a css class name for it*/
var nAnswersPresent = 0;
var nAnswersDiscovered = 0;
var answers = [];

var countAnswers = function () {
  var rowIdx = 0;
  var colIdx = 0;
  for (rowIdx = 0; rowIdx < N_ROWS; rowIdx++) {
    for (colIdx = 0; colIdx < N_COLS; colIdx++) {
      var matches = processCell(
        $("#tblCell_" + rowIdx + "_" + colIdx).get(0),
        true
      );
      answers = answers.concat(matches);
      nAnswersPresent += matches.length;
    }
  }
  $("#finishMessage").hide();
  $("#nPresent").text(String.fromCharCode(0x0966 + nAnswersPresent));
  $("#nFound").text(0);
  var answerIdx = 0;
  for (answerIdx = 0; answerIdx < answers.length; answerIdx++) {
    $("#answers").append("<li>" + answers[answerIdx] + "</li>");
  }
};
var cellClick = function (e) {
  var cell = $(e.target).closest("td").get(0);
  nAnswersDiscovered += processCell(cell).length;
  $("#nFound").text(String.fromCharCode(0x0966 + nAnswersDiscovered));
  if (nAnswersDiscovered == nAnswersPresent) {
    $("#finishMessage").show();
    $("#statusMessage").hide();
    $("#lead").hide();
  }
};
var processCell = function (cell, doNotMark) {
  if ($(cell).hasClass("found")) {
    showDetails(cell.id);
    return [];
  }

  var cellRowIdx = parseInt(cell.id.split("_")[1]);
  var cellColIdx = parseInt(cell.id.split("_")[2]);

  var matches = [];

  //check if there are any horizontal matches
  var rowIdx = 0;
  var colIdx = 0;
  var matchCandidate = "";
  for (colIdx = cellColIdx; colIdx < N_COLS; colIdx++) {
    matchCandidate =
      matchCandidate + $("#tblCell_" + cellRowIdx + "_" + colIdx).text();
    if (isProperMatch(matchCandidate)) {
      matches.push(matchCandidate);
      if (doNotMark) {
        continue;
      }
      markMatch(cellRowIdx, cellColIdx, cellRowIdx, colIdx, matchCandidate);
    }
  }
  //check if there are any vertical matches
  matchCandidate = "";
  rowIdx = 0;
  colIdx = 0;
  for (rowIdx = cellRowIdx; rowIdx < N_ROWS; rowIdx++) {
    matchCandidate =
      matchCandidate + $("#tblCell_" + rowIdx + "_" + cellColIdx).text();
    if (
      convertToArrayOfAksharas(matchCandidate).length > 1 &&
      isProperMatch(matchCandidate)
    ) {
      matches.push(matchCandidate);
      if (doNotMark) {
        continue;
      }
      markMatch(cellRowIdx, cellColIdx, rowIdx, cellColIdx, matchCandidate);
    }
  }
  //check if there are any diagonal matches
  matchCandidate = "";
  rowIdx = 0;
  colIdx = 0;
  for (
    diagIdx = 0;
    diagIdx + cellRowIdx < N_ROWS && diagIdx + cellColIdx < N_COLS;
    diagIdx++
  ) {
    matchCandidate =
      matchCandidate +
      $(
        "#tblCell_" + (diagIdx + cellRowIdx) + "_" + (diagIdx + cellColIdx)
      ).text();
    if (
      convertToArrayOfAksharas(matchCandidate).length > 1 &&
      isProperMatch(matchCandidate)
    ) {
      matches.push(matchCandidate);
      if (doNotMark) {
        continue;
      }
      markMatch(
        cellRowIdx,
        cellColIdx,
        diagIdx + cellRowIdx,
        diagIdx + cellColIdx,
        matchCandidate
      );
    }
  }
  return matches;
};

var markMatch = function (
  startRowIdx,
  startColIdx,
  endRowIdx,
  endColIdx,
  word
) {
  if (!stringToCss[word]) {
    var nCssUsed = Object.keys(stringToCss).length;
    if (nCssUsed > MAX_MARKER_IDX) {
      stringToCss[word] = "markerX";
    } else {
      stringToCss[word] = "marker" + Object.keys(stringToCss).length;
    }
  }
  $("#tblCell_" + startRowIdx + "_" + startColIdx).addClass("found");
  if (startRowIdx == endRowIdx) {
    var colIdx;
    for (colIdx = startColIdx; colIdx <= endColIdx; colIdx++) {
      var cellId = "tblCell_" + startRowIdx + "_" + colIdx;
      markCell(cellId, word);
    }
    return;
  }
  if (startColIdx == endColIdx) {
    var rowIdx;
    for (rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx++) {
      var cellId = "tblCell_" + rowIdx + "_" + startColIdx;
      markCell(cellId, word);
    }
    return;
  }
  var cellIdx = 0;
  for (cellIdx = 0; cellIdx < endColIdx - startColIdx + 1; cellIdx++) {
    var cellId =
      "tblCell_" + (startRowIdx + cellIdx) + "_" + (startColIdx + cellIdx);
    markCell(cellId, word);
  }
};
var markCell = function (cellId, word) {
  if (!foundStrings[cellId]) {
    foundStrings[cellId] = {};
    var markersDiv = $("#" + cellId).append('<div class="markers"></div>');
  }
  if (!foundStrings[cellId][word]) {
    foundStrings[cellId][word] = {}; //TODO: is anything needed to be stored in this object?
  }
  $("#" + cellId + " .markers").append(
    $("<div class='marker'></div>").addClass(stringToCss[word])
  );
};
var isProperMatch = function (candidate) {
  var wordListIdx = 0;
  for (wordListIdx = 0; wordListIdx < wordList.length; wordListIdx++) {
    if (wordList[wordListIdx] === candidate) {
      return true;
    }
  }
  return false;
};

var showDetails = function (cellId) {
  console.log("show details for " + cellId);
};
var showHint = function () {
  $("#hintPopup").show();
  return false;
};
var hideHint = function () {
  $("#hintPopup").hide();
};
var getWordsToFind = function () {
  var indices = [];
  var i = 0;
  for (i = 0; i < wordList.length; i++) {
    indices.push(i);
  }
  // shuffle the array of indices
  for (i = indices.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }
  var wordsToFind = [];
  for (i = 0; i < N_WORDS_TO_FIND; i++) {
    wordsToFind.push(wordList[indices[i]]);
  }
  return wordsToFind;
};
/**
 * Puts the given words into the grid randomly
 * @param {*} words - Words to put into the grid
 */
var putWords = function (words) {
  var wordsIdx = 0;
  var nWordsPut = 0;
  for (wordsIdx = 0; wordsIdx < words.length; wordsIdx++) {
    if (putWord(words[wordsIdx])) {
      nWordsPut++;
    }
  }
  return nWordsPut;
};
/**
 * Puts the given word into the grid at a random location
 * @param {*} strWord - Word to place into the grid
 */
var putWord = function (strWord) {
  var word = convertToArrayOfAksharas(strWord);
  var emptySlots = findEmptySlots();
  var attemptedSlots = [];
  while (attemptedSlots.length < emptySlots.length) {
    // Compute which slots haven't been attempted
    var remainingSlots = [];
    remainingSlots = remainingSlots.concat(emptySlots);
    var remainingSlotIdx = remainingSlots.length;
    while (remainingSlotIdx--) {
      if (attemptedSlots.indexOf(remainingSlots[remainingSlotIdx]) >= 0) {
        remainingSlots.splice(remainingSlotIdx, 1);
      }
    }

    // Find a random slot to attempt
    var slot =
      remainingSlots[Math.floor(Math.random() * remainingSlots.length)];
    attemptedSlots.push(slot);

    var slotRowIdx = parseInt(slot.split("_")[1]);
    var slotColIdx = parseInt(slot.split("_")[2]);

    var directionsRemaining = ["H", "V", "D"]; //horizontal, vertical, diagonal
    nextDirection: while (directionsRemaining.length > 0) {
      var direction =
        directionsRemaining[
          Math.floor(Math.random() * directionsRemaining.length)
        ];
      directionsRemaining.splice(directionsRemaining.indexOf(direction), 1);
      var rowIdx = 0;
      var colIdx = 0;
      var wordIdx = 0;
      //check if this word can be placed in the direction specified
      for (wordIdx = 0; wordIdx < word.length; wordIdx++) {
        var charToPut = word[wordIdx];
        var targetCell = undefined;
        switch (direction) {
          case "H":
            targetCell =
              "#tblCell_" + slotRowIdx + "_" + (slotColIdx + wordIdx);
            break;
          case "V":
            targetCell =
              "#tblCell_" + (slotRowIdx + wordIdx) + "_" + slotColIdx;
            break;
          case "D":
            targetCell =
              "#tblCell_" +
              (slotRowIdx + wordIdx) +
              "_" +
              (slotColIdx + wordIdx);
          default:
        }
        if ($(targetCell).length == 0) {
          // target cell is out of the grid boundaries
          break nextDirection;
        }
        if ($(targetCell).text().trim().length == 0) {
          continue;
        }
        if ($(targetCell).text().trim() != charToPut) {
          // there is a conflicting character at the target cell
          break nextDirection;
        }
      }
      //place the word
      for (wordIdx = 0; wordIdx < word.length; wordIdx++) {
        var charToPut = word[wordIdx];
        var targetCell = undefined;
        switch (direction) {
          case "H":
            targetCell =
              "#tblCell_" + slotRowIdx + "_" + (slotColIdx + wordIdx);
            break;
          case "V":
            targetCell =
              "#tblCell_" + (slotRowIdx + wordIdx) + "_" + slotColIdx;
            break;
          case "D":
            targetCell =
              "#tblCell_" +
              (slotRowIdx + wordIdx) +
              "_" +
              (slotColIdx + wordIdx);
          default:
        }
        $(targetCell).html("<span>" + charToPut + "</span>");
      }
      //placed the word
      return true;
    }
  }
  //the word could not be placed
  return false;
};
var convertToArrayOfAksharas = function (strWord) {
  var aksharas = [];

  var currentAkshara = "";
  var charIdx = 0;
  for (charIdx = 0; charIdx < strWord.length; charIdx++) {
    var char = strWord[charIdx];
    if (fullSwaras.indexOf(char) >= 0) {
      currentAkshara = currentAkshara + char;
      /*if(currentAkshara.length>0){
                aksharas.push(currentAkshara);
                currentAkshara = '';
            }
            aksharas.push(char);
            */
      continue;
    }
    if (anuswara == char || visarga == char) {
      currentAkshara = currentAkshara + char;
      aksharas.push(currentAkshara);
      currentAkshara = "";
      continue;
    }
    if (swaras.indexOf(char) >= 0) {
      currentAkshara = currentAkshara + char;
      //aksharas.push(currentAkshara)
      //currentAkshara = '';
      continue;
    }
    if (halant == char) {
      currentAkshara = currentAkshara + char;
      continue;
    }
    if (vyanjanas.indexOf(char) >= 0) {
      if (
        currentAkshara.length > 0 &&
        halant != currentAkshara[currentAkshara.length - 1]
      ) {
        aksharas.push(currentAkshara);
        currentAkshara = "";
      }
      currentAkshara = currentAkshara + char;
      continue;
    }
    if (currentAkshara.length > 0) {
      aksharas.push(currentAkshara);
      currentAkshara = "";
    }
    aksharas.push(char);
  }
  if (currentAkshara.length > 0) {
    aksharas.push(currentAkshara);
  }
  return aksharas;
};
var findEmptySlots = function () {
  var emptySlots = [];
  $("#grid td").each(function (idx, cell) {
    if ($(cell).text().trim().length == 0) {
      emptySlots.push($(cell).attr("id"));
    }
  });
  return emptySlots;
};
var fillRandom = function () {
  $("#grid td").each(function (idx, cell) {
    if ($(cell).text().trim().length == 0) {
      $(cell).html("<span>" + getRandomAkshara() + "</span>");
    }
  });
};
var fullSwaras = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ॠ", "ए", "ऐ", "ओ", "औ"];
var swaras = [
  "\u093e",
  "\u093f",
  "\u0940",
  "\u0941",
  "\u0942",
  "\u0943",
  "\u0944",
  "\u0947",
  "\u0948",
  "\u094b",
  "\u094c",
];
var vyanjanas = [
  "क",
  "ख",
  "ग",
  "घ",
  "ङ",
  "च",
  "छ",
  "ज",
  "झ",
  "ञ",
  "त",
  "थ",
  "द",
  "ध",
  "न",
  "ट",
  "ठ",
  "ड",
  "ढ",
  "ण",
  "प",
  "फ",
  "ब",
  "भ",
  "म",
  "य",
  "र",
  "ल",
  "व",
  "स",
  "श",
  "ष",
  "ह",
  "क्ष",
  "ज्ञ",
];
var halant = "\u094d";
var anuswara = "\u0902";
var visarga = "\u0903";

var getRandomAkshara = function () {
  //return '-'
  var numLetters = Math.floor(Math.random() * 2) + 1;
  if (numLetters == 1) {
    var rand = Math.floor(
      Math.random() * (fullSwaras.length + vyanjanas.length)
    );
    if (rand >= fullSwaras.length) {
      return vyanjanas[rand - fullSwaras.length];
    }
    return fullSwaras[rand];
  }
  var akshara = "";
  var lettersLeft = numLetters;
  while (lettersLeft > 1) {
    var rand = Math.floor(Math.random() * vyanjanas.length);
    if (akshara.length != 0) {
      akshara = akshara + halant;
    }
    akshara = akshara + vyanjanas[rand];
    lettersLeft = lettersLeft - 1;
  }
  akshara = akshara + swaras[Math.floor(Math.random() * swaras.length)];
  var rand = Math.floor(Math.random() * 10);
  if (rand < 2) {
    akshara = akshara + visarga;
  }
  return akshara;
};
var resizeGrid = function () {
  var width = $(window).width();
  var height = $(window).height();
  var minDim = width;
  if (minDim > height) {
    minDim = height;
  }
  $("#grid").width(minDim * 0.85);
  $("#grid").height(minDim * 0.85);
};
$(window).resize(resizeGrid);
$(document).ready(main);

//https://stackoverflow.com/questions/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
function getQueryStringValue(key) {
  return decodeURIComponent(
    window.location.search.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
          encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") +
          "(?:\\=([^&]*))?)?.*$",
        "i"
      ),
      "$1"
    )
  );
}

//TODO: Externalize this

//fetch
//for drop down chapters
let makingChapterDropDown = () => {
  let dropDownContainer = document.querySelector(".dropdown");
  let dropDownMenu = document.querySelector(".dropdown-menu");

  for (let i = 1; i <= 18; ++i) {
    //making drop down items   <a class="dropdown-item" href="#">Action</a>
    let a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.innerHTML = i;
    dropDownMenu.appendChild(a);
    dropDownContainer.appendChild(dropDownMenu);
  }
};
makingChapterDropDown();

//for drop down verses
//knowing selextion of chapter
let allChaptersFromDropDown = document.querySelectorAll('.dropdown-item');
let chap_btn = document.getElementsByClassName('chapter-btn')[0];
let verse_btn = document.getElementsByClassName('verse-btn')[0];

let chapterSelected =  0;
let getTotalVerse = 0;
let doThis = () => {
    for(let i = 0  ;  i<18; ++i){
        allChaptersFromDropDown[i].onclick = () => {
            chapterSelected =  allChaptersFromDropDown[i].innerHTML;
            let apiUrl = "https://vedicscripturesapi.herokuapp.com/gita/" + chapterSelected;
            fetch(apiUrl)
                .then(rep => rep.json())
                .then(data => {getTotalVerse = data.verses_count
                    chap_btn.innerHTML = chapterSelected;
                    verse_btn.innerHTML = getTotalVerse;
                    getAllVerses();
                 });
        }
        
    }
}
doThis();

let getAllVerses = () => {
    let dropdown = document.getElementById('dropdown-verse');
    let dropmenu = document.getElementById('menu-verses');
    for(let i = 1 ; i<=getTotalVerse ;++i){
        let a = document.createElement('a');
        a.classList.add('dropdown-item','dropdown-item-verse');
        a.innerHTML = i;
        dropmenu.appendChild(a);
        dropdown.appendChild(dropmenu);
    }
   
}


let selectVerse = () => {
    
    console.log(getTotalVerse);
    let verse = document.querySelectorAll('.dropdown-item-verse');
    for(let i = 1 ; i<=getTotalVerse ;++i){
       verse[i].onclick = () => {
           console.log(verse[i]);
           verse_btn.innerHTML = verse[i];
       }
    }
    
}




var wordList = [
  "विश्वम्",
  "विष्णुः",
  "वषट्कारः",
  "भूतभव्यभवत्प्रभुः",
  "भूतकृत्",
  "भूतभृत्",
  "भावः",
  "भूतात्मा",
  "भूतभावनः",
  "पूतात्मा",
  "परमात्मा",
  "मुक्तानां-परमा-गतिः",
  "अव्ययः",
  "पुरुषः",
  "साक्षी",
  "क्षेत्रज्ञः",
  "अक्षरः",
  "योगः",
  "योगविदां-नेता",
  "प्रधानपुरुषेश्वरः",
  "नारसिंहवपुः",
  "श्रीमान्",
  "केशवः",
  "पुरुषोत्तमः",
  "सर्वः",
  "शर्वः",
  "शिवः",
  "स्थाणुः",
  "भूतादिः",
  "निधिरव्ययः",
  "सम्भवः",
  "भावनः",
  "भर्ता",
  "प्रभवः",
  "प्रभुः",
  "ईश्वरः",
  "स्वयम्भूः",
  "शम्भुः",
  "आदित्यः",
  "पुष्कराक्षः",
  "महास्वनः",
  "अनादिनिधनः",
  "धाता",
  "विधाता",
  "धातुरुत्तमः",
  "अप्रमेयः",
  "हृषीकेशः",
  "पद्मनाभः",
  "अमरप्रभुः",
  "विश्वकर्मा",
  "मनुः",
  "त्वष्टा",
  "स्थविष्ठः",
  "स्थविरो-ध्रुवः",
  "अग्राह्यः",
  "शाश्वतः",
  "कृष्णः",
  "लोहिताक्षः",
  "प्रतर्दनः",
  "प्रभूतस्",
  "त्रिकाकुब्धाम",
  "पवित्रम्",
  "मंगलं-परम्",
  "ईशानः",
  "प्राणदः",
  "प्राणः",
  "ज्येष्ठः",
  "श्रेष्ठः",
  "प्रजापतिः",
  "हिरण्यगर्भः",
  "भूगर्भः",
  "माधवः",
  "मधुसूदनः",
  "ईश्वरः",
  "विक्रमः",
  "धन्वी",
  "मेधावी",
  "विक्रमः",
  "क्रमः",
  "अनुत्तमः",
  "दुराधर्षः",
  "कृतज्ञः",
  "कृतिः",
  "आत्मवान्",
  "सुरेशः",
  "शरणम्",
  "शर्म",
  "विश्वरेताः",
  "प्रजाभवः",
  "अहः",
  "संवत्सरः",
  "व्यालः",
  "प्रत्ययः",
  "सर्वदर्शनः",
  "अजः",
  "सर्वेश्वरः",
  "सिद्धः",
  "सिद्धिः",
  "सर्वादिः",
  "अच्युतः",
  "वृषाकपिः",
  "अमेयात्मा",
  "सर्वयोगविनिसृतः",
  "वसुः",
  "वसुमनाः",
  "सत्यः",
  "समात्मा",
  "सम्मितः",
  "समः",
  "अमोघः",
  "पुण्डरीकाक्षः",
  "वृषकर्मा",
  "वृषाकृतिः",
  "रुद्रः",
  "बहुशिरः",
  "बभ्रुः",
  "विश्वयोनिः",
  "शुचिश्रवाः",
  "अमृतः",
  "शाश्वतः-स्थाणुः",
  "वरारोहः",
  "महातपः",
  "सर्वगः",
  "सर्वविद्भानुः",
  "विष्वक्सेनः",
  "जनार्दनः",
  "वेदः",
  "वेदविद्",
  "अव्यंगः",
  "वेदांगः",
  "वेदविद्",
  "कविः",
  "लोकाध्यक्षः",
  "सुराध्यक्षः",
  "धर्माध्यक्षः",
  "कृताकृतः",
  "चतुरात्मा",
  "चतुर्व्यूहः",
  "चतुर्दंष्ट्रः",
  "चतुर्भुजः",
  "भ्राजिष्णुः",
  "भोजनम्",
  "भोक्ता",
  "सहिष्णुः",
  "जगदादिजः",
  "अनघः",
  "विजयः",
  "जेता",
  "विश्वयोनिः",
  "पुनर्वसुः",
  "उपेन्द्रः",
  "वामनः",
  "प्रांशुः",
  "अमोघः",
  "शुचिः",
  "ऊर्जितः",
  "अतीन्द्रः",
  "संग्रहः",
  "सर्गः",
  "धृतात्मा",
  "नियमः",
  "यमः",
  "वेद्यः",
  "वैद्यः",
  "सदायोगी",
  "वीरहा",
  "माधवः",
  "मधुः",
  "अतीन्द्रियः",
  "महामायः",
  "महोत्साहः",
  "महाबलः",
  "महाबुद्धिः",
  "महावीर्यः",
  "महाशक्तिः",
  "महाद्युतिः",
  "अनिर्देश्यवपुः",
  "श्रीमान्",
  "अमेयात्मा",
  "महाद्रिधृक्",
  "महेष्वासः",
  "महीभर्ता",
  "श्रीनिवासः",
  "सतां-गतिः",
  "अनिरुद्धः",
  "सुरानन्दः",
  "गोविन्दः",
  "गोविदां-पतिः",
  "मरीचिः",
  "दमनः",
  "हंसः",
  "सुपर्णः",
  "भुजगोत्तमः",
  "हिरण्यनाभः",
  "सुतपाः",
  "पद्मनाभः",
  "प्रजापतिः",
  "अमृत्युः",
  "सर्वदृक्",
  "सिंहः",
  "सन्धाता",
  "सन्धिमान्",
  "स्थिरः",
  "अजः",
  "दुर्मषणः",
  "शास्ता",
  "विश्रुतात्मा",
  "सुरारिहा",
  "गुरुः",
  "गुरुतमः",
  "धाम",
  "सत्यः",
  "सत्यपराक्रमः",
  "निमिषः",
  "अनिमिषः",
  "स्रग्वी",
  "वाचस्पतिः-उदारधीः",
  "अग्रणीः",
  "ग्रामणीः",
  "श्रीमान्",
  "न्यायः",
  "नेता",
  "समीरणः",
  "सहस्रमूर्धा",
  "विश्वात्मा",
  "सहस्राक्षः",
  "सहस्रपात्",
  "आवर्तनः",
  "निवृत्तात्मा",
  "संवृतः",
  "संप्रमर्दनः",
  "अहः-संवर्तकः",
  "वह्निः",
  "अनिलः",
  "धरणीधरः",
  "सुप्रसादः",
  "प्रसन्नात्मा",
  "विश्वधृक्",
  "विश्वभुक्",
  "विभुः",
  "सत्कर्ता",
  "सत्कृतः",
  "साधुः",
  "जह्नुः",
  "नारायणः",
  "नरः",
  "असंख्येयः",
  "अप्रमेयात्मा",
  "विशिष्टः",
  "शिष्टकृत्",
  "शुचिः",
  "सिद्धार्थः",
  "सिद्धसंकल्पः",
  "सिद्धिदः",
  "सिद्धिसाधनः",
  "वृषाही",
  "वृषभः",
  "विष्णुः",
  "वृषपर्वा",
  "वृषोदरः",
  "वर्धनः",
  "वर्धमानः",
  "विविक्तः",
  "श्रुतिसागरः",
  "सुभुजः",
  "दुर्धरः",
  "वाग्मी",
  "महेन्द्रः",
  "वसुदः",
  "वसुः",
  "नैकरूपः",
  "बृहद्रूपः",
  "शिपिविष्टः",
  "प्रकाशनः",
  "ओजस्तेजोद्युतिधरः",
  "प्रकाशात्मा",
  "प्रतापनः",
  "ऋद्धः",
  "स्पष्टाक्षरः",
  "मन्त्रः",
  "चन्द्रांशुः",
  "भास्करद्युतिः",
  "अमृतांशोद्भवः",
  "भानुः",
  "शशबिन्दुः",
  "सुरेश्वरः",
  "औषधम्",
  "जगतः-सेतुः",
  "सत्यधर्मपराक्रमः",
  "भूतभव्यभवन्नाथः",
  "पवनः",
  "पावनः",
  "अनलः",
  "कामहा",
  "कामकृत्",
  "कान्तः",
  "कामः",
  "कामप्रदः",
  "प्रभुः",
  "युगादिकृत्",
  "युगावर्तः",
  "नैकमायः",
  "महाशनः",
  "अदृश्यः",
  "व्यक्तरूपः",
  "सहस्रजित्",
  "अनन्तजित्",
  "इष्टः",
  "विशिष्टः",
  "शिष्टेष्टः",
  "सिद्धार्थ",
  "नहुषः",
  "वृषः",
  "क्रोधहा",
  "क्रोधकृत्कर्ता",
  "विश्वबाहुः",
  "महीधरः",
  "अच्युतः",
  "प्रथितः",
  "प्राणः",
  "प्राणदः",
  "वासवानुजः",
  "अपां-निधिः",
  "अधिष्ठानम्",
  "अप्रमत्तः",
  "प्रतिष्ठितः",
  "स्कन्दः",
  "स्कन्दधरः",
  "धूर्यः",
  "वरदः",
  "वायुवाहनः",
  "वासुदेवः",
  "बृहद्भानुः",
  "आदिदेवः",
  "पुरन्दरः",
  "अशोकः",
  "तारणः",
  "तारः",
  "शूरः",
  "शौरिः",
  "जनेश्वरः",
  "अनुकूलः",
  "शतावर्तः",
  "पद्मी",
  "पद्मनिभेक्षणः",
  "पद्मनाभः",
  "अरविन्दाक्षः",
  "पद्मगर्भः",
  "शरीरभृत्",
  "महर्द्धिः",
  "ऋद्धः",
  "वृद्धात्मा",
  "महाक्षः",
  "गरुडध्वजः",
  "अतुलः",
  "शरभः",
  "भीमः",
  "समयज्ञः",
  "हविर्हरिः",
  "सर्वलक्षणलक्षण्यः",
  "लक्ष्मीवान्",
  "समितिञ्जयः",
  "विक्षरः",
  "रोहितः",
  "मार्गः",
  "हेतुः",
  "दामोदरः",
  "सहः",
  "महीधरः",
  "महाभागः",
  "वेगवान्",
  "अमिताशनः",
  "उद्भवः",
  "क्षोभणः",
  "देवः",
  "श्रीगर्भः",
  "परमेश्वरः",
  "करणम्",
  "कारणम्",
  "कर्ता",
  "विकर्ता",
  "गहनः",
  "गुहः",
  "व्यवसायः",
  "व्यवस्थानः",
  "संस्थानः",
  "स्थानदः",
  "ध्रुवः",
  "परर्धिः",
  "परमस्पष्टः",
  "तुष्टः",
  "पुष्टः",
  "शुभेक्षणः",
  "रामः",
  "विरामः",
  "विरजः",
  "मार्गः",
  "नेयः",
  "नयः",
  "अनयः",
  "वीरः",
  "शक्तिमतां-श्रेष्ठः",
  "धर्मः",
  "धर्मविदुत्तमः",
  "वैकुण्ठः",
  "पुरुषः",
  "प्राणः",
  "प्राणदः",
  "प्रणवः",
  "पृथुः",
  "हिरण्यगर्भः",
  "शत्रुघ्नः",
  "व्याप्तः",
  "वायुः",
  "अधोक्षजः",
  "ऋतुः",
  "सुदर्शनः",
  "कालः",
  "परमेष्ठी",
  "परिग्रहः",
  "उग्रः",
  "संवत्सरः",
  "दक्षः",
  "विश्रामः",
  "विश्वदक्षिणः",
  "विस्तारः",
  "स्थावरः-स्थााणुः",
  "प्रमाणम्",
  "बीजमव्ययम्",
  "अर्थः",
  "अनर्थः",
  "महाकोशः",
  "महाभोगः",
  "महाधनः",
  "अनिर्विण्णः",
  "स्थविष्ठः",
  "अभूः",
  "धर्मयूपः",
  "महामखः",
  "नक्षत्रनेमिः",
  "नक्षत्री",
  "क्षमः",
  "क्षामः",
  "समीहनः",
  "यज्ञः",
  "इज्यः",
  "महेज्यः",
  "क्रतुः",
  "सत्रम्",
  "सतां-गतिः",
  "सर्वदर्शी",
  "विमुक्तात्मा",
  "सर्वज्ञः",
  "ज्ञानमुत्तमम्",
  "सुव्रतः",
  "सुमुखः",
  "सूक्ष्मः",
  "सुघोषः",
  "सुखदः",
  "सुहृत्",
  "मनोहरः",
  "जितक्रोधः",
  "वीरबाहुः",
  "विदारणः",
  "स्वापनः",
  "स्ववशः",
  "व्यापी",
  "नैकात्मा",
  "नैककर्मकृत्",
  "वत्सरः",
  "वत्सलः",
  "वत्सी",
  "रत्नगर्भः",
  "धनेश्वरः",
  "धर्मगुब्",
  "धर्मकृत्",
  "धर्मी",
  "सत्",
  "असत्",
  "क्षरम्",
  "अक्षरम्",
  "अविज्ञाता",
  "सहस्रांशुः",
  "विधाता",
  "कृतलक्षणः",
  "गभस्तिनेमिः",
  "सत्त्वस्थः",
  "सिंहः",
  "भूतमहेश्वरः",
  "आदिदेवः",
  "महादेवः",
  "देवेशः",
  "देवभृद्गुरुः",
  "उत्तरः",
  "गोपतिः",
  "गोप्ता",
  "ज्ञानगम्यः",
  "पुरातनः",
  "शरीरभूतभृत्",
  "भोक्ता",
  "कपीन्द्रः",
  "भूरिदक्षिणः",
  "सोमपः",
  "अमृतपः",
  "सोमः",
  "पुरुजित्",
  "पुरुसत्तमः",
  "विनयः",
  "जयः",
  "सत्यसन्धः",
  "दाशार्हः",
  "सात्त्वतां-पतिः",
  "जीवः",
  "विनयितासाक्षी",
  "मुकुन्दः",
  "अमितविक्रमः",
  "अम्भोनिधिः",
  "अनन्तात्मा",
  "महोदधिशयः",
  "अन्तकः",
  "अजः",
  "महार्हः",
  "स्वाभाव्यः",
  "जितामित्रः",
  "प्रमोदनः",
  "आनन्दः",
  "नन्दनः",
  "नन्दः",
  "सत्यधर्मा",
  "त्रिविक्रमः",
  "महर्षिः-कपिलाचार्यः",
  "कृतज्ञः",
  "मेदिनीपतिः",
  "त्रिपदः",
  "त्रिदशाध्यक्षः",
  "महाशृंगः",
  "कृतान्तकृत्",
  "महावराहः",
  "गोविन्दः",
  "सुषेणः",
  "कनकांगदी",
  "गुह्यः",
  "गभीरः",
  "गहनः",
  "गुप्तः",
  "चक्रगदाधरः",
  "वेधाः",
  "स्वांगः",
  "अजितः",
  "कृष्णः",
  "दृढः",
  "संकर्षणोऽच्युतः",
  "वरुणः",
  "वारुणः",
  "वृक्षः",
  "पुष्कराक्षः",
  "महामनः",
  "भगवान्",
  "भगहा",
  "आनन्दी",
  "वनमाली",
  "हलायुधः",
  "आदित्यः",
  "ज्योतिरादित्यः",
  "सहिष्णुः",
  "गतिसत्तमः",
  "सुधन्वा",
  "खण्डपरशु:",
  "दारुणः",
  "द्रविणप्रदः",
  "दिवःस्पृक्",
  "सर्वदृग्व्यासः",
  "वाचस्पतिरयोनिजः",
  "त्रिसामा",
  "सामगः",
  "साम",
  "निर्वाणम्",
  "भेषजम्",
  "भृषक्",
  "संन्यासकृत्",
  "समः",
  "शान्तः",
  "निष्ठा",
  "शान्तिः",
  "परायणम्",
  "शुभांगः",
  "शान्तिदः",
  "स्रष्टा",
  "कुमुदः",
  "कुवलेशयः",
  "गोहितः",
  "गोपतिः",
  "गोप्ता",
  "वृषभाक्षः",
  "वृषप्रियः",
  "अनिवर्ती",
  "निवृतात्मा",
  "संक्षेप्ता",
  "क्षेमकृत्",
  "शिवः",
  "श्रीवत्सवत्साः",
  "श्रीवासः",
  "श्रीपतिः",
  "श्रीमतां-वरः",
  "श्रीदः",
  "श्रीशः",
  "श्रीनिवासः",
  "श्रीनिधिः",
  "श्रीविभावनः",
  "श्रीधरः",
  "श्रीकरः",
  "श्रेयः",
  "श्रीमान्",
  "लोकत्रयाश्रयः",
  "स्वक्षः",
  "स्वङ्गः",
  "शतानन्दः",
  "नन्दिः",
  "ज्योतिर्गणेश्वरः",
  "विजितात्मा",
  "विधेयात्मा",
  "सत्कीर्तिः",
  "छिन्नसंशयः",
  "उदीर्णः",
  "सर्वतश्चक्षुः",
  "अनीशः",
  "शाश्वतः-स्थिरः",
  "भूशयः",
  "भूषणः",
  "भूतिः",
  "विशोकः",
  "शोकनाशनः",
  "अर्चिष्मान्",
  "अर्चितः",
  "कुम्भः",
  "विशुद्धात्मा",
  "विशोधनः",
  "अनिरुद्धः",
  "अप्रतिरथः",
  "प्रद्युम्नः",
  "अमितविक्रमः",
  "कालनेमीनिहा",
  "वीरः",
  "शौरी",
  "शूरजनेश्वरः",
  "त्रिलोकात्मा",
  "त्रिलोकेशः",
  "केशवः",
  "केशिहा",
  "हरिः",
  "कामदेवः",
  "कामपालः",
  "कामी",
  "कान्तः",
  "कृतागमः",
  "अनिर्देश्यवपुः",
  "विष्णुः",
  "वीरः",
  "अनन्तः",
  "धनञ्जयः",
  "ब्रह्मण्यः",
  "ब्रह्मकृत्",
  "ब्रह्मा",
  "ब्रहम",
  "ब्रह्मविवर्धनः",
  "ब्रह्मविद्",
  "ब्राह्मणः",
  "ब्रह्मी",
  "ब्रह्मज्ञः",
  "ब्राह्मणप्रियः",
  "महाकर्मः",
  "महाकर्मा",
  "महातेजा",
  "महोरगः",
  "महाक्रतुः",
  "महायज्वा",
  "महायज्ञः",
  "महाहविः",
  "स्तव्यः",
  "स्तवप्रियः",
  "स्तोत्रम्",
  "स्तुतिः",
  "स्तोता",
  "रणप्रियः",
  "पूर्णः",
  "पूरयिता",
  "पुण्यः",
  "पुण्यकीर्तिः",
  "अनामयः",
  "मनोजवः",
  "तीर्थकरः",
  "वसुरेताः",
  "वसुप्रदः",
  "वसुप्रदः",
  "वासुदेवः",
  "वसुः",
  "वसुमना",
  "हविः",
  "सद्गतिः",
  "सत्कृतिः",
  "सत्ता",
  "सद्भूतिः",
  "सत्परायणः",
  "शूरसेनः",
  "यदुश्रेष्ठः",
  "सन्निवासः",
  "सुयामुनः",
  "भूतावासः",
  "वासुदेवः",
  "सर्वासुनिलयः",
  "अनलः",
  "दर्पहा",
  "दर्पदः",
  "दृप्तः",
  "दुर्धरः",
  "अथापराजितः",
  "विश्वमूर्तिः",
  "महामूर्तिः",
  "दीप्तमूर्तिः",
  "अमूर्तिमान्",
  "अनेकमूर्तिः",
  "अव्यक्तः",
  "शतमूर्तिः",
  "शताननः",
  "एकः",
  "नैकः",
  "सवः",
  "कः",
  "किम्",
  "यत्",
  "तत्",
  "पदमनुत्तमम्",
  "लोकबन्धुः",
  "लोकनाथः",
  "माधवः",
  "भक्तवत्सलः",
  "सुवर्णवर्णः",
  "हेमांगः",
  "वरांगः",
  "चन्दनांगदी",
  "वीरहा",
  "विषमः",
  "शून्यः",
  "घृताशी",
  "अचलः",
  "चलः",
  "अमानी",
  "मानदः",
  "मान्यः",
  "लोकस्वामी",
  "त्रिलोकधृक्",
  "सुमेधा",
  "मेधजः",
  "धन्यः",
  "सत्यमेधः",
  "धराधरः",
  "तेजोवृषः",
  "द्युतिधरः",
  "सर्वशस्त्रभृतां-वरः",
  "प्रग्रहः",
  "निग्रहः",
  "व्यग्रः",
  "नैकशृंगः",
  "गदाग्रजः",
  "चतुर्मूर्तिः",
  "चतुर्बाहुः",
  "चतुर्व्यूहः",
  "चतुर्गतिः",
  "चतुरात्मा",
  "चतुर्भावः",
  "चतुर्वेदविद्",
  "एकपात्",
  "समावर्तः",
  "निवृत्तात्मा",
  "दुर्जयः",
  "दुरतिक्रमः",
  "दुर्लभः",
  "दुर्गमः",
  "दुर्गः",
  "दुरावासः",
  "दुरारिहा",
  "शुभांगः",
  "लोकसारंगः",
  "सुतन्तुः",
  "तन्तुवर्धनः",
  "इन्द्रकर्मा",
  "महाकर्मा",
  "कृतकर्मा",
  "कृतागमः",
  "उद्भवः",
  "सुन्दरः",
  "सुन्दः",
  "रत्ननाभः",
  "सुलोचनः",
  "अर्कः",
  "वाजसनः",
  "शृंगी",
  "जयन्तः",
  "सर्वविज्जयी",
  "सुवर्णबिन्दुः",
  "अक्षोभ्यः",
  "सर्ववागीश्वरेश्वरः",
  "महाहृदः",
  "महागर्तः",
  "महाभूतः",
  "महानिधिः",
  "कुमुदः",
  "कुन्दरः",
  "कुन्दः",
  "पर्जन्यः",
  "पावनः",
  "अनिलः",
  "अमृतांशः",
  "अमृतवपुः",
  "सर्वज्ञः",
  "सर्वतोमुखः",
  "सुलभः",
  "सुव्रतः",
  "सिद्धः",
  "शत्रुजित्",
  "शत्रुतापनः",
  "न्यग्रोधः",
  "उदुम्बरः",
  "अश्वत्थः",
  "चाणूरान्ध्रनिषूदनः",
  "सहस्रार्चिः",
  "सप्तजिह्वः",
  "सप्तैधाः",
  "सप्तवाहनः",
  "अमूर्तिः",
  "अनघः",
  "अचिन्त्यः",
  "भयकृत्",
  "भयनाशनः",
  "अणुः",
  "बृहत्",
  "कृशः",
  "स्थूलः",
  "गुणभृत्",
  "निर्गुणः",
  "महान्",
  "अधृतः",
  "स्वधृतः",
  "स्वास्यः",
  "प्राग्वंशः",
  "वंशवर्धनः",
  "भारभृत्",
  "कथितः",
  "योगी",
  "योगीशः",
  "सर्वकामदः",
  "आश्रमः",
  "श्रमणः",
  "क्षामः",
  "सुपर्णः",
  "वायुवाहनः",
  "धनुर्धरः",
  "धनुर्वेदः",
  "दण्डः",
  "दमयिता",
  "दमः",
  "अपराजितः",
  "सर्वसहः",
  "अनियन्ता",
  "नियमः",
  "अयमः",
  "सत्त्ववान्",
  "सात्त्विकः",
  "सत्यः",
  "सत्यधर्मपराक्रमः",
  "अभिप्रायः",
  "प्रियार्हः",
  "अर्हः",
  "प्रियकृत्",
  "प्रीतिवर्धनः",
  "विहायसगतिः",
  "ज्योतिः",
  "सुरुचिः",
  "हुतभुक्",
  "विभुः",
  "रविः",
  "विरोचनः",
  "सूर्यः",
  "सविता",
  "रविलोचनः",
  "अनन्तः",
  "हुतभुक्",
  "भोक्ता",
  "सुखदः",
  "नैकजः",
  "अग्रजः",
  "अनिर्विण्णः",
  "सदामर्षी",
  "लोकाधिष्ठानम्",
  "अद्भुतः",
  "सनात्",
  "सनातनतमः",
  "कपिलः",
  "कपिः",
  "अव्ययः",
  "स्वस्तिदः",
  "स्वस्तिकृत्",
  "स्वस्ति",
  "स्वस्तिभुक्",
  "स्वस्तिदक्षिणः",
  "अरौद्रः",
  "कुण्डली",
  "चक्री",
  "विक्रमी",
  "ऊर्जितशासनः",
  "शब्दातिगः",
  "शब्दसहः",
  "शिशिरः",
  "शर्वरीकरः",
  "अक्रूरः",
  "पेशलः",
  "दक्षः",
  "दक्षिणः",
  "क्षमिणांवरः",
  "विद्वत्तमः",
  "वीतभयः",
  "पुण्यश्रवणकीर्तनः",
  "उत्तारणः",
  "दुष्कृतिहा",
  "पुण्यः",
  "दुःस्वप्ननाशनः",
  "वीरहा",
  "रक्षणः",
  "सन्तः",
  "जीवनः",
  "पर्यवस्थितः",
  "अनन्तरूपः",
  "अनन्तश्रीः",
  "जितमन्युः",
  "भयापहः",
  "चतुरश्रः",
  "गभीरात्मा",
  "विदिशः",
  "व्यादिशः",
  "दिशः",
  "अनादिः",
  "भूर्भूवः",
  "लक्ष्मीः",
  "सुवीरः",
  "रुचिरांगदः",
  "जननः",
  "जनजन्मादिः",
  "भीमः",
  "भीमपराक्रमः",
  "आधारनिलयः",
  "अधाता",
  "पुष्पहासः",
  "प्रजागरः",
  "ऊर्ध्वगः",
  "सत्पथाचारः",
  "प्राणदः",
  "प्रणवः",
  "पणः",
  "प्रमाणम्",
  "प्राणनिलयः",
  "प्राणभृत्",
  "प्राणजीवनः",
  "तत्त्वम्",
  "तत्त्वविद्",
  "एकात्मा",
  "जन्ममृत्युजरातिगः",
  "भूर्भुवःस्वस्तरुः",
  "तारः",
  "सविताः",
  "प्रपितामहः",
  "यज्ञः",
  "यज्ञपतिः",
  "यज्वा",
  "यज्ञांगः",
  "यज्ञवाहनः",
  "यज्ञभृद्",
  "यज्ञकृत्",
  "यज्ञी",
  "यज्ञभुक्",
  "यज्ञसाधनः",
  "यज्ञान्तकृत्",
  "यज्ञगुह्यम्",
  "अन्नम्",
  "अन्नादः",
  "आत्मयोनिः",
  "स्वयंजातः",
  "वैखानः",
  "सामगायनः",
  "देवकीनन्दनः",
  "स्रष्टा",
  "क्षितीशः",
  "पापनाशनः",
  "शंखभृत्",
  "नन्दकी",
  "चक्री",
  "शार्ङ्गधन्वा",
  "गदाधरः",
  "रथांगपाणिः",
  "अक्षोभ्यः",
  "सर्वप्रहरणायुधः",
];
