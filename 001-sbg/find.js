var N_ROWS = 10;
var N_COLS = 10;
var N_WORDS_TO_FIND = 5;
let chapterSelected =  0;
var ch = parseInt(getQueryStringValue("ch"));
if (ch && ch >= 1 && ch <= 18) {
}
else
	ch=Math.floor(Math.random() * (18 - 1) + 1);
chapterSelected =  ch;
var v = parseInt(getQueryStringValue("v"));
if (!v || isNaN(v))
	v=1;
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
        $(targetCell).html("<span title='"+Sanscript.t(String(charToPut), 'devanagari','iast')+"'>" + charToPut + "</span>");
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
		ra=getRandomAkshara();
      $(cell).html("<span title='"+Sanscript.t(String(ra), 'devanagari','itrans')+"'>" + ra + "</span>");
    }
  });
};
var fullSwaras = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ॠ", "ए", "ऐ", "ओ", "औ"];
var swaras = [
  "\u093e",  "\u093f",  "\u0940",  "\u0941",  "\u0942",  "\u0943",
  "\u0944",  "\u0947",  "\u0948",  "\u094b",  "\u094c",
];
var vyanjanas = [
  "क",  "ख",  "ग",  "घ",  "ङ",  "च",  "छ",  "ज",  "झ",  "ञ",  "त",  "थ",  "द",  "ध",  "न",
  "ट",  "ठ",  "ड",  "ढ",  "ण",  "प",  "फ",  "ब",  "भ",  "म",  "य",  "र",  "ल",  "व",
  "स",  "श",  "ष",  "ह",  "क्ष",  "ज्ञ",
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

let getTotalVerse = 0;
let doThis = () => {
    for(let i = 0  ;  i<18; ++i){
        allChaptersFromDropDown[i].onclick = () => {
            chapterSelected =  allChaptersFromDropDown[i].innerHTML;
			getTotalVerse = chv[chapterSelected];
                    chap_btn.innerHTML = chapterSelected;
                    verse_btn.innerHTML = getTotalVerse;
                    getAllVerses();
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
		a.onclick = () => {
            verse_btn.innerHTML = i;
			document.getElementById("gobtn").disabled = false;
		}
        dropmenu.appendChild(a);
        dropdown.appendChild(dropmenu);
    }
}

let selectVerse = () => {
window.location = window.location.origin + window.location.pathname + "?size=" + size + "&ch=" + chapterSelected + "&v=" + verse_btn.innerText;
}
function sV(obj) {
obj.href+="&ch="+getQueryStringValue("ch")+"&v="+getQueryStringValue("v");
//window.location = window.location.origin + window.location.pathname + "?size=" + size + "&ch=" + chapterSelected + "&v=" + verse_btn.innerText;
}
var chv=[0,46,72,43,42,29,47,30,28,34,42,55,20,35,27,20,24,28,78];
var vCount = [0,46,118,161,203,232,279,309,337,371,413,468,488,523,550,570,594,622,700];
var t = vCount[parseInt(ch)-1] + parseInt(v)-1;
var wordList = Sanscript.t(data[t]["t"],'iast', 'devanagari').split(" ");
for (var i=0;i<wordList.length;i++)
{
	$("#lead2").append("<span class=nob title='"+Sanscript.t(wordList[i], 'devanagari','iast')+"'>"+wordList[i]+" </span>");
}
$("#lead2").append("। ");
$("#lead2").append(String.fromCharCode(0x0966 + parseInt(String(ch).charAt(0))));
if (ch > 10)
	$("#lead2").append(String.fromCharCode(0x0966 + parseInt(String(ch).charAt(1))));
$("#lead2").append(".");
$("#lead2").append(String.fromCharCode(0x0966 + parseInt(String(v).charAt(0))));
$("#lead2").append(String.fromCharCode(0x0966 + parseInt(String(v).charAt(1))));
function showHint2()
{
$("#lead2").html("");
for (var i=0;i<wordList.length;i++)
{
	if (answers.includes(wordList[i]))
	$("#lead2").append("<strong>"+wordList[i]+"</strong> ");
else
	$("#lead2").append("<span class=nob title='"+Sanscript.t(wordList[i], 'devanagari','iast')+"'>"+wordList[i]+" </span>");
}
$("#lead2").append("। ");
$("#lead2").append(String.fromCharCode(0x0966 + parseInt(String(ch).charAt(0))));
if (ch > 10)
	$("#lead2").append(String.fromCharCode(0x0966 + parseInt(String(ch).charAt(1))));
$("#lead2").append(".");
$("#lead2").append(String.fromCharCode(0x0966 + parseInt(String(v).charAt(0))));
$("#lead2").append(String.fromCharCode(0x0966 + parseInt(String(v).charAt(1))));
};