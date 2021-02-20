//grabbing the elements
let imgs = document.querySelectorAll('.floating-img');
console.log(imgs);

//setting the random Ids
for(let i =0  ; i<imgs.length ; ++i){
    imgs[i].setAttribute('id', 'floating-img'+i );
    console.log(imgs);
}



