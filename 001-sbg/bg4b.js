var N_ROWS = 9;
var N_COLS = 9;
var N_WORDS_TO_FIND = 5;
var MAX_MARKER_IDX = 6;
seg = new Intl.Segmenter('sa');
var main = function () {
 for (tnum=0;tnum<sList.length;tnum++)
 {
  drawGrid(tnum);
  var nWordsPut = 0;
  do {
    var words = getWordsToFind(tnum);
    nWordsPut = putWords(words,tnum);
  } while (nWordsPut == 0);
  fillRandom();
  resizeGrid();
 }
};

var drawGrid = function (num) {
//	console.log(num);
  var table = $('<table id=t'+num+'><caption id=c'+num+'> '+sList[num]+'&nbsp; </caption></table>');
  var rowIdx = 0;
  var colIdx = 0;
  for (rowIdx = 0; rowIdx < N_ROWS; rowIdx++) {
    var row = $('<tr></tr>');
    for (colIdx = 0; colIdx < N_COLS; colIdx++) {
      var cell = $('<td id="' +num+"_"+ rowIdx + "_" + colIdx + '"></td>');
      row.append(cell);
    }
    table.append(row);
  }
  $("#grid").append(table);
};

var getWordsToFind = function (num) {
slistcl = sList[num].replaceAll("|","").replaceAll(".","").replace(/\d/g,"");
wordList = slistcl.split(" ");
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
  for (i = 0; wordsToFind.length < N_WORDS_TO_FIND ; i++) {
     segments = seg.segment(wordList[indices[i]])
//console.log(wordList[indices[i]] + " === " + [...segments].length)
     if ([...segments].length > 1)
       wordsToFind.push(wordList[indices[i]]);
  }
console.log(wordsToFind);
  return wordsToFind;
};
/**
 * Puts the given words into the grid randomly
 * @param {*} words - Words to put into the grid
 */
var putWords = function (words,tnum) {
  var wordsIdx = 0;
  var nWordsPut = 0;
  for (wordsIdx = 0; wordsIdx < words.length; wordsIdx++) {
    if (putWord(words[wordsIdx],tnum)) {
      nWordsPut++;
    }
  }
  return nWordsPut;
};
/**
 * Puts the given word into the grid at a random location
 * @param {*} strWord - Word to place into the grid
 */
var putWord = function (strWord,tnum) {
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
              "#"+tnum+"_" + slotRowIdx + "_" + (slotColIdx + wordIdx);
            break;
          case "V":
            targetCell =
              "#"+tnum+"_" + (slotRowIdx + wordIdx) + "_" + slotColIdx;
            break;
          case "D":
            targetCell =
              "#"+tnum+"_" +
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
              "#"+tnum+"_" + slotRowIdx + "_" + (slotColIdx + wordIdx);
            break;
          case "V":
            targetCell =
              "#"+tnum+"_" + (slotRowIdx + wordIdx) + "_" + slotColIdx;
            break;
          case "D":
            targetCell =
              "#"+tnum+"_" +
              (slotRowIdx + wordIdx) +
              "_" +
              (slotColIdx + wordIdx);
          default:
        }
        $(targetCell).html("<span>"+charToPut+"</span>");
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
      $(cell).html("<span>"+ra+"</span>");
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
//
chv=[0,46,72,43,42,29,47,30,28,34,42,55,20,35,27,20,24,28,78];
vCount = [0,46,118,161,203,232,279,309,337,371,413,468,488,523,550,570,594,622,700];
//var t = vCount[parseInt(ch)-1] + parseInt(v)-1;
var wordList = "";
var sList = [
'धृतराष्ट्रः उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेताः युयुत्सवः | मामकाः पाण्डवाः च एव किम् अकुर्वत सञ्जय ||1.1||',
'न एनम् छिन्दन्ति शस्त्राणि न एनम् दहति पावकः | न च एनम् क्लेदयन्ति आपः न शोषयति मारुतः ||2.23||',
'कर्मणि एव अधिकारः ते मा फलेषु कदाचन | मा कर्मफलहेतुः भूः मा ते सङ्गः अस्तु अकर्मणि ||2.47||',
'योगस्थः कुरु कर्माणि सङ्गम् त्यक्त्वा धनञ्जय | सिद्ध्यसिद्ध्योः समः भूत्वा समत्वम् योगः उच्यते ||2.48||',
'यदा यदा हि धर्मस्य ग्लानिः भवति भारत | अभ्युत्थानम् अधर्मस्य तदा आत्मानम् सृजामि अहम् ||4.7||',
'यो माम् पश्यति सर्वत्र सर्वम् च मयि पश्यति |, तस्य अहम् न प्रणश्यामि स च मे न प्रणश्यति ||6.30||',
'पत्रम् पुष्पम् फलम् तोयम् यो मे भक्त्या प्रयच्छति तत् अहम् भक्त्युपहृतम् अश्नामि प्रयतात्मनः ||9.26||',
'अर्जुनः उवाच | एवम् सततयुक्ताः ये भक्ताः त्वाम् पर्युपासते ये च अपि अक्षरम् अव्यक्तम् तेषाम् के योगवित्तमाः ||12.1||',
'श्रोत्रम् चक्षुः स्पर्शनम् च रसनम् घ्राणम् एव च अधिष्ठाय मनः च अयम् विषयान् उपसेवते ||15.9||',
'यत्र योगेश्वरः कृष्णः यत्र पार्थः धनुर्धरः तत्र श्रीः विजयः भूतिः ध्रुवा नीतिः मतिः मम ||18.78||'];