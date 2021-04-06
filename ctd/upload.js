"use strict";
/*--------------------------
        |  FIREBASE CONFIGURATIONS  |
        ----------------------------*/
var firebaseConfig = {
  apiKey: "AIzaSyB_Ef-PKY6fIonfQqhwDcFF1YdNXQKkQNM",
  authDomain: "ctdimagedatabase.firebaseapp.com",
  projectId: "ctdimagedatabase",
  storageBucket: "ctdimagedatabase.appspot.com",
  messagingSenderId: "113395032208",
  appId: "1:113395032208:web:a87b0e63b9775df1e2f815",
};
firebase.initializeApp(firebaseConfig);

/*-----------------------------
            | FIREBASE CONFIGURATIONS END |
             ----------------------------*/

const image_file = document.getElementById("upload_file");
const image_file_button = document.getElementById("upload_file_button");
let photoName = "";
let name_of_pic = document.getElementById("name-of-picture");
let image_links = [];
let img_indi_link = ""; //for saving the image temporarily and push it to the array.
// const image_container = document.querySelector('.image-container');
let tags_input = document.getElementById("tags_input"); //this is fetching of tags_input field
let tags_array = [];

//attaching event listener to the tags input
tags_input.addEventListener("change", function () {
  tags_array.push(tags_input.value);
  console.log(tags_array);
  //adding to the screen
  let tags_container = document.getElementsByClassName("tags_container")[0];
  tags_container.innerHTML += `<span class='tags_indi'>${tags_input.value} </span> `;

  tags_input.value = "";
});

let uploadImage = () => {
  if (name_of_pic.value == "") {
    alert("please Enter Something!");
  } else {
    photoName = name_of_pic.value;
  }
  var formData = new FormData();
  formData.append("image", image_file.files[0]);
  $.ajax({
    url: "https://api.imgur.com/3/image",
    type: "POST",
    datatype: "json",
    headers: {
      Authorization: "Client-ID 62570b23d77cc20",
    },
    data: formData,
    success: function (response) {
      console.log(response);
      img_indi_link = response.data.link;

      //saving images to the firebase
      let firebase_ref = firebase.database().ref("image_links");
      const links = {
        //these are the object to push it to the firebase
        img_indi_link,
        photoName,
        tags_array,
      };
      firebase_ref.push(links);
      image_links.push(img_indi_link);
      console.log(image_links);
      var photo_hash = response.data.deletehash;
    },
    cache: false,
    contentType: false,
    processData: false,
  });
  setTimeout(() => {
    location.reload();
  }, 1000);
};

//end
