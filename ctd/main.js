//getting all the images
const image_container = document.querySelector('.image-container');



for(let i =1 ; i<=21 ; ++i){
    
    //making the img tag
    let img = document.createElement('img');

    //setting src to the image
    let address = 'Images/' + i + '.jpg' ;
    img.setAttribute('src', address);   // <img src='1.....21.jpg'>
    img.classList.add('ctd-image');

    image_container.appendChild(img);

}
