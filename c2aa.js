let fullSwaras = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ॠ", "ए", "ऐ", "ओ", "औ"];
let swaras = [
  "\u093e",  "\u093f",  "\u0940",  "\u0941",  "\u0942",  "\u0943",
  "\u0944",  "\u0947",  "\u0948",  "\u094b",  "\u094c",
];
let vyanjanas = [
  "क",  "ख",  "ग",  "घ",  "ङ",  "च",  "छ",  "ज",  "झ",  "ञ",  "त",  "थ",  "द",  "ध",  "न",
  "ट",  "ठ",  "ड",  "ढ",  "ण",  "प",  "फ",  "ब",  "भ",  "म",  "य",  "र",  "ल",  "व",
  "स",  "श",  "ष",  "ह",  "क्ष",  "ज्ञ",
];
let halant = "\u094d";
let anuswara = "\u0902";
let visarga = "\u0903";
let convertToArrayOfAksharas = function (strWord) {
  let aksharas = [];
  let currentAkshara = "";
  let charIdx = 0;
  for (charIdx = 0; charIdx < strWord.length; charIdx++) {
    let char = strWord[charIdx];
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