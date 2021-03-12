'use strict'
//getting all the images
const image_container = document.querySelector('.image-container');

let address = []; 
let img;
let words = ['चटका','हृदय', 'फल' , 'अस्थि', 'नरचिह्न', 'प्रसेव' , 'चमस', 'धेनु', 'कादम्ब', 'गज', 'अभ्र' , 'चन्द्र', 'नक्षत्र', 'युतक', 'पर्ण', 'हस्त', 'भल्लूक', 'उष्ट्र', 'सेवम्', 'दन्त', 'left' , 'वर्तुल', 'अण्ड', 'left' , 'काष्ठीला'];

for(let i =0 ; i<25 ; ++i){


        //this is the indi container
        let container_indi = document.createElement('div');
        container_indi.classList.add('container-indi');
    
    //making the img tag
     img = document.createElement('img');

    //setting src to the image
    address[i] = 'Images/' + (i+1) + '.jpg' ;
    img.setAttribute('src', address[i]);   // <img src='1.....21.jpg'>
    img.classList.add('ctd-image');

    //  let br = document.createElement('br');

    //boiler plate
    let p = document.createElement('span');
    p.classList.add('p-boilerplate');

    p.innerHTML = words[i];
    p.style.color = 'white';
    container_indi.appendChild(img);
 //   container_indi.appendChild(br);
    container_indi.appendChild(p);

    image_container.appendChild(container_indi);
    

    

}
 

let images_array = document.querySelectorAll('.ctd-image');

console.log(images_array);

for(let i = 0 ; i<25 ; ++i){
  
    images_array[i].onclick = function(){
         
        //window.open(address[i],'Image','width=largeImage.stylewidth,height=largeImage.style.height,resizable=1');

        function ImagetoPrint()
        {
            return "<html><head><scri"+"pt>function step1(){\n" +
                    "setTimeout('step2()', 10);}\n" +
                    "function step2(){window.print();window.close()}\n" +
                    "</scri" + "pt></head><body onload='step1()'>\n" +
                    "<img src='" + address[i] + "' /></body></html>";
        }
    
        function PrintImage()
        {
            var Pagelink = "about:blank";
            var pwa = window.open(Pagelink, "_new");
            pwa.document.open();
            pwa.document.write(ImagetoPrint(address[i]));
            pwa.document.close();
        }
       PrintImage();
    }

}


/*

let words = ['' , '', '', '', '',]


*/