"use strict";

const image_container = document.querySelector(".image-container");

let address = [];

let img;
let words = [
  "चटका",
  "गज",
  "अभ्र",
  "चन्द्र",
  "नक्षत्रम्",
  "युतकम्",
  "पर्णम्",
  "हस्त",
  "भल्लूक",
  "उष्ट्र",
  "सेवम्",
  "हृदयम्",
  "दन्त",
  "left",
  "वर्तुल",
  "अण्ड",
  "left",
  "काष्ठीला",
  "फलम्",
  "अस्थि",
  "नरचिह्न",
  "प्रसेव",
  "चमस",
  "धेनु",
  "कादम्ब",
];
//hht
// var lnk = "";
// let i = 0;
// lnk +=
//   "https://api.github.com/repos/Samskrita-Bharati/zat.am/contents/ctd/Images";
// (async () => {
//   const response = await fetch(lnk);
//   const data = await response.json();
//   let htmlString = "";
//   console.log(data);
//   for (let file of data) {
//     htmlString +=
//       `<div class="container-indi"> <img src="Images/${file.name}" onclick="PrintImage(this);" class="ctd-image"><span class="p-boilerplate" style="color:#9DD1F1">` +
//       words[i] +
//       `</span></div>`;
//     i++;
//   }

//   document.getElementsByClassName("image-container")[0].innerHTML += htmlString;
// })();

window.addEventListener("load", function (e) {
  let fetch_ref = firebase.database().ref("image_links");
  fetch_ref.on("value", (snapshot) => {
    const fetchedImagesLink = snapshot.val();
    for (let id in fetchedImagesLink) {
      console.log(fetchedImagesLink[id].img_indi_link);
      let image =
        `<div class="container-indi"> <img src="${fetchedImagesLink[id].img_indi_link}" onclick="PrintImage(this);" class="ctd-image"><span class="p-boilerplate" style="color:#9DD1F1">` +
        fetchedImagesLink[id].photoName +
        `</span></div>`;
      document.getElementsByClassName("image-container")[0].innerHTML += image;
    }
  });
});
function ImagetoPrint(inp) {
  return (
    "<html><head><scri" +
    "pt>function step1(){\n" +
    "setTimeout('step2()', 10);}\n" +
    "function step2(){window.print();window.close()}\n" +
    "</scri" +
    "pt></head><body onload='step1()'>\n" +
    "<img src='" +
    inp +
    "' /></body></html>"
  );
}

function PrintImage(obj) {
  var Pagelink = "about:blank";
  var pwa = window.open(Pagelink, "_new");
  pwa.document.open();
  pwa.document.write(ImagetoPrint(obj.src));
  pwa.document.close();
}
