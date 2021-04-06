"use strict";

const image_container = document.querySelector(".image-container");
let n = 0;
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
  let all_tags = [];
  let fetch_ref = firebase.database().ref("image_links"); //this is the ref variable of firebase database
  let tags_container = document.getElementsByClassName(
    "tags_container_home"
  )[0];
  fetch_ref.on("value", (snapshot) => {
    const fetchedImagesLink = snapshot.val();
    for (let id in fetchedImagesLink) {
      //console.log(fetchedImagesLink[id].img_indi_link);
      let image =
        `<div class='container-indi ${fetchedImagesLink[id].photoName}'> <img src="${fetchedImagesLink[id].img_indi_link}" onclick="PrintImage(this);" class="ctd-image"><span class="p-boilerplate" style="color:#9DD1F1">` +
        fetchedImagesLink[id].photoName +
        `</span></div>`;

      document.getElementsByClassName("image-container")[0].innerHTML += image;
    }
  });

  //getting tags from the firebase
  fetch_ref.on("value", (snapshot) => {
    const fetched_tags = snapshot.val();

    for (let id in fetched_tags) {
      // console.log(fetched_tags[id].tags_array);
      for (let i = 0; i < fetched_tags[id].tags_array.length; ++i) {
        all_tags.push(fetched_tags[id].tags_array[i]);
      }
    }

    let tags_set = new Set(all_tags);

    for (let i of tags_set) {
      if (i == undefined) {
        continue;
      }
      tags_container.innerHTML += `<span class='tags_indi' onclick=filteredImage(this) >${i}</span>`;
    }
  });
});
function filteredImage() {
  let displayAll = document.getElementsByClassName("container-indi");
  for (let elm of displayAll) {
    console.log("done");
    elm.style.display = "inline-block";
  }
  let n = 0;
  let tags_on_home = document.getElementsByClassName("tags_indi");

  for (let i = 0; i < tags_on_home.length; ++i) {
    tags_on_home[i].onclick = function () {
      let displayAll = document.getElementsByClassName("container-indi");
      for (let elm of displayAll) {
        console.log("done");
        elm.style.display = "inline-block";
      }
      //alert(tags_on_home[i].innerHTML);
      let fetch_ref = firebase.database().ref("image_links"); //this is the ref variable of firebase database
      fetch_ref.on("value", (snapshot) => {
        let selected_tags = snapshot.val();

        for (let id in selected_tags) {
          for (let m = 0; m < selected_tags[id].tags_array.length; ++m) {
            if (selected_tags[id].tags_array[m] !== tags_on_home[i].innerHTML) {
              // console.log(selected_tags[id].photoName);
              // console.log(
              //   selected_tags[id].tags_array[m] +
              //     " " +
              //     tags_on_home[i].innerHTML +
              //     " " +
              //     selected_tags[id].photoName
              // );
              n = n + 1;
            }
          }
          if (n === selected_tags[id].tags_array.length) {
            //console.log(selected_tags[id].photoName);
            let displayNone = document.getElementsByClassName(
              selected_tags[id].photoName
            );
            console.log(displayNone);
            for (let elm of displayNone) {
              elm.style.display = "none";
            }
          }
          n = 0;
        }
      });
    };
  }
}

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
