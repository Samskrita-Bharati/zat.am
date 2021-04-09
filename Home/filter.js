let img_name = [
  // array of object
  {
    src: "./memory.webp", // i =0
    imgName: "Memory game",
    link: "Https://zat.am/memorygame/index.html",
  },
  {
    src: "./sudoku.jpeg", // i =1
    imgName: "Sudoku",
    link: "https://zat.am/Sudoku/index.html",
  },
  {
    src: "./ctd.jpg", // i=2
    imgName: "Connect the Dots",
    link: "https://zat.am/ctd/",
  },
  {
    src: "./wordsearch.png", // i=2
    imgName: "Word Search",
    link: "https://zat.am/wordsearch/",
  },
];

img_container = document.getElementsByClassName("img_container")[0];

//adding images to  the page
for (let i = 0; i < img_name.length; ++i) {
  let img = document.createElement("img"); // <img src=''>
  img.setAttribute("src", img_name[i].src); // <img src='memory.webp'>
  img.classList.add("game-img"); // <img class='game-img' src='memory.webp'></img>

  //making a tag
  let a = document.createElement("a"); //a
  a.setAttribute("href", img_name[i].link); // a href
  a.setAttribute("target", "_blank");
  a.appendChild(img); // <a>img</a>

  img_container.appendChild(a);
}
