'use strict'
        /*--------------------------
        |  FIREBASE CONFIGURATIONS  |
        ----------------------------*/
        var firebaseConfig = {
            apiKey: "AIzaSyB_Ef-PKY6fIonfQqhwDcFF1YdNXQKkQNM",
            authDomain: "ctdimagedatabase.firebaseapp.com",
            projectId: "ctdimagedatabase",
            storageBucket: "ctdimagedatabase.appspot.com",
            messagingSenderId: "113395032208",
            appId: "1:113395032208:web:a87b0e63b9775df1e2f815"
          };
          firebase.initializeApp(firebaseConfig);
        
           /*-----------------------------
            | FIREBASE CONFIGURATIONS END |
             ----------------------------*/

//getting all the images
const image_container = document.querySelector('.image-container');
const image_file = document.getElementById('upload_file');
const image_file_button = document.getElementById('upload_file_button');
let photoName = '';
let name_of_pic = document.getElementById('name-of-picture');
let address = []; 
let image_links = [];
let img_indi_link = ''; //for saving the image temporarily and push it to the array.
let img;
let words = ['चटका', 'गज' ,'अभ्र' , 'चन्द्र',  'नक्षत्रम्','युतकम्',    'पर्णम्','हस्त','भल्लूक', 'उष्ट्र', 'सेवम्','हृदयम्', 'दन्त', 'left',  'वर्तुल', 'अण्ड', 'left','काष्ठीला',   'फलम्' , 'अस्थि','नरचिह्न','प्रसेव' ,  'चमस',   'धेनु', 'कादम्ब',    ];
//hht 
var lnk="";
let i=0;
lnk+='https://api.github.com/repos/Samskrita-Bharati/zat.am/contents/ctd/Images';
(async () => {
        const response = await fetch(lnk);
        const data = await response.json();
        let htmlString = '';
        console.log(data)
        for (let file of data) {
			     
                  htmlString += `<div class="container-indi"> <img src="Images/${file.name}" onclick="PrintImage(this);" class="ctd-image"><span class="p-boilerplate" style="color:#9DD1F1">`+words[i]+`</span></div>`;
          i++;
        }
		//console.log(htmlString);
        document.getElementsByClassName('image-container')[0].innerHTML += htmlString;
      })()


// hht 
//uploading to the github

let uploadImage = () => {
    if(name_of_pic.value == ''){
        alert('please Enter Something!');
    }else{
   photoName = name_of_pic.value;
    }
    var formData = new FormData();
  formData.append("image", image_file.files[0]);
  $.ajax({
    url: "https://api.imgur.com/3/image",
    type: "POST",
    datatype: "json",
    headers: {
      "Authorization": "Client-ID 62570b23d77cc20"
    },
    data: formData,
    success: function(response) {
      console.log(response);
      img_indi_link = response.data.link;

      //saving images to the firebase
      let firebase_ref = firebase.database().ref('image_links');
      const links = {
          img_indi_link,
          photoName
          
      }
      firebase_ref.push(links);
      image_links.push(img_indi_link);
      console.log(image_links);
      var photo_hash = response.data.deletehash;
        //    let image = `<div class="container-indi"> <img src="${photo}" onclick="PrintImage(this);" class="ctd-image"><span class="p-boilerplate" style="color:#9DD1F1">`+'left'+`</span></div>`;
        // document.getElementsByClassName('image-container')[0].innerHTML += image;
    },
    cache: false,
    contentType: false,
    processData: false
  });
  setTimeout(()=>{
  location.reload();
  }, 1000)
   //location.reload();
}
// window.onload() = () =>{
//     for(let i = 0 ; i<image_links.length ; ++i){
//             let image = `<div class="container-indi"> <img src="${image_links[i]}" onclick="PrintImage(this);" class="ctd-image"><span class="p-boilerplate" style="color:#9DD1F1">`+'left'+`</span></div>`;
//         document.getElementsByClassName('image-container')[0].innerHTML += image;
//     }
// }

window.addEventListener('load', function(e){
      let fetch_ref = firebase.database().ref('image_links');
      fetch_ref.on('value', (snapshot)=>{
          const fetchedImagesLink = snapshot.val();
         for(let id in fetchedImagesLink){
             console.log(fetchedImagesLink[id].img_indi_link);
             let image = `<div class="container-indi"> <img src="${fetchedImagesLink[id].img_indi_link}" onclick="PrintImage(this);" class="ctd-image"><span class="p-boilerplate" style="color:#9DD1F1">`+fetchedImagesLink[id].photoName+`</span></div>`;
                  document.getElementsByClassName('image-container')[0].innerHTML += image;
         }
      })
})
//end
        function ImagetoPrint(inp)
        {
            return "<html><head><scri"+"pt>function step1(){\n" +
                    "setTimeout('step2()', 10);}\n" +
                    "function step2(){window.print();window.close()}\n" +
                    "</scri" + "pt></head><body onload='step1()'>\n" +
                    "<img src='" + inp + "' /></body></html>";
        }
    
        function PrintImage(obj)
        {
            var Pagelink = "about:blank";
            var pwa = window.open(Pagelink, "_new");
            pwa.document.open();
            pwa.document.write(ImagetoPrint(obj.src));
            pwa.document.close();
        }

      

        // console.log(image_file.files[0]);
    // let formdata = new FormData();
    // formdata.append('image', image_file.files[0]);
    // fetch('https://api.imgur.com/3/upload',{
    //     method:'get',
    //     headers: {
    //         Authorization:"Client-ID 62570b23d77cc20"

    //     },
    //     body:formdata

    // }).then(data=>data.json()).then(data => {
    //     console.log(data.data.link)
    //     let image = `<div class="container-indi"> <img src="${data.data.link}" onclick="PrintImage(this);" class="ctd-image"><span class="p-boilerplate" style="color:#9DD1F1">`+'left'+`</span></div>`;
    //     document.getElementsByClassName('image-container')[0].innerHTML += image;
        

    // })