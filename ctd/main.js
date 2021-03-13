'use strict'
//getting all the images
const image_container = document.querySelector('.image-container');

let address = []; 
let img;
let words = ['चटका','हृदयम्', 'फलम्' , 'अस्थि', 'नरचिह्न', 'प्रसेव' , 'चमस', 'धेनु', 'कादम्ब', 'गज', 'अभ्र' , 'चन्द्र', 'नक्षत्रम्', 'युतकम्', 'पर्णम्', 'हस्त', 'भल्लूक', 'उष्ट्र', 'सेवम्', 'दन्त', 'left' , 'वर्तुल', 'अण्ड', 'left' , 'काष्ठीला'];
//hht 
var lnk="";
let i=0;
lnk+='https://api.github.com/repos/Samskrita-Bharati/zat.am/contents/ctd/Images';
(async () => {
        const response = await fetch(lnk);
        const data = await response.json();
        let htmlString = '';
        for (let file of data) {
			     
                  htmlString += `<div class="container-indi"> <img src="Images/${file.name}" onclick="PrintImage(this);" class="ctd-image"><span class="p-boilerplate" style="color:white">`+words[i]+`</span></div>`;
          i++;
        }
		//console.log(htmlString);
        document.getElementsByClassName('image-container')[0].innerHTML += htmlString;
      })()
// hht 

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