'use strict'
//getting all the images
const image_container = document.querySelector('.image-container');

let address = []; 
let img;

for(let i =0 ; i<25 ; ++i){
    
    //making the img tag
     img = document.createElement('img');

    //setting src to the image
    address[i] = 'Images/' + (i+1) + '.jpg' ;
    img.setAttribute('src', address[i]);   // <img src='1.....21.jpg'>
    img.classList.add('ctd-image');

    image_container.appendChild(img);
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


