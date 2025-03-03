const puzzle = document.getElementById("board");
const info = document.getElementById("info");
const NewGame = document.getElementById("randomize");
const check = document.getElementById("check");
const status = document.getElementById("status");
const image = document.getElementById("image");
const audio_player = document.getElementById("SS_Audio"); 
const play_pause = document.getElementById("play_pause");
const share =  document.getElementById("share");
const tooltip = document.getElementById("myTooltip");

const sutra_devanagiri = ["अ इ उ ण्", "ऋ ऌ क्", "ए ओ ङ्", "ऐ औ च्", "ह य व र ट्", "ल ण्", "ञ म ङ ण न म्", "झ भ ञ्", "घ ढ ध ष्", "ज ब ग ड द श्", "खफछठथचटतव्", "क प य्", "श ष स र्", "ह ल्", "🕉", "space"];

const alphabets_devanagiri = ["अ","इ","उ","ऋ","ऌ","ए","ऐ","ओ","औ","क","ख","ग","घ","ङ","च","छ","ज","झ","ञ","ट","ठ","ड","ढ","ण","त","थ","द","ध","न","प","फ","ब","भ","म","य","र","ल","व","श","ष","स","ह"];

let sutra, alphabets, challenge, num_moves = 0;

var tiles = document.querySelectorAll(".tile");
var board = [[]], starter_board = [[]];
let IndxArr = [];

var cols = 4;
var rows = 4;

/*
document.addEventListener("DOMContentLoaded", function(){
  board = randomizeBoard();
  drawBoard(board);
});
*/

let script_id = 1, challenge_id = 1;

function CreateGame() {
  
  document.body.className = "";
  status.innerHTML = ``;
  image.innerHTML = ``;
  share.style.display = "none";
  info.innerHTML = ``;
  
  script_id = 1;
  sutra = sutra_devanagiri;
  alphabets = alphabets_devanagiri;
  
  challenge_id = document.querySelector('input[name="challenge"]:checked').value;
  
  cols = 4;
  rows = 4;
  
  if (challenge_id == 1) {
      
    challenge = sutra;
    
  } else if (challenge_id == 2) {
    
    let arr = Array.from({length: alphabets.length}, (x, i) => i);
    let rnd = shuffle(arr);
    rnd.length = rows*cols-1;
    rnd.sort((a, b) => a - b);
    
    challenge = rnd.map(i => alphabets[i]);
    challenge.push("space");
    puzz = [];
  }
  
  num_moves = 0;
  
  for (var n = 0; n < tiles.length; n++){
    tiles[n].addEventListener("click", function(e){
      //console.log('tilenumber', this.dataset.col, this.dataset.row);
      //console.log(findSpace(board));
      //console.log(board);
      //console.log(canSlide(this.dataset.col, this.dataset.row, board))
      if(canSlide(this.dataset.col, this.dataset.row, board)){
        var tileNumber = this.dataset.tileNumber;
        //console.log('tilenumber', this.dataset.col, this.dataset.row);
        var spacePos = findSpace(board);
        var spaceCol = spacePos[0];
        var spaceRow = spacePos[1];

        //console.log('testing',spaceCol, spaceRow);
        board[spaceCol][spaceRow] = tileNumber;
        board[this.dataset.col][this.dataset.row] = "space";
        //console.log('in click',board);
        drawBoard(board);
        // console.log(board);
        // console.log("Winner?", checkForWin(challenge));
        
        num_moves += 1;
      }

    });
  }
  
  do {
    console.log('Generating new board');
    board = randomizeBoard(1);
    
  } while(checkIfSolvable(board) == false);
  
  // board = starter_board;
  drawBoard(board);
  //console.log(canSlide(2,2,board));
  
  puzzle.style.display = "revert";
  check.style.display = "revert";
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let InvArr;

function checkIfSolvable(board) {

  IndxArr = [];
  
  for (let j = 0; j < cols; j++){
    for (let k = 0; k < rows; k++){
      if (board[k][j] !== "space"){
        IndxArr.push(challenge.indexOf(board[k][j]));
      }
    }
  }
  
  InvArr = IndxArr.map( (val,ind) => {
    let count = 0;
    for(let i=0; i<ind; i++){
      if (IndxArr[i] > val)
        count++;
    }
    return count;
  });
  
  let numInversions = 0;
  
  InvArr.forEach( x => {
    numInversions += x;
  });
  
  let solvable = false;
  
  if ((rows*cols)%2==1) {
    
    if (numInversions%2 == 0) {
      solvable = true;
    }
    
  } else  if ((rows*cols)%2==0) {
    
    var spacePos = findSpace(board);
    
    if ( (numInversions + spacePos[1])%2 == 1 ) {
      solvable = true;
    }
  }
  
  return(solvable);
  
}

function randomizeBoard(flag){
  var pos = challenge; // [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,"space"];
  var posArr = [];
  var index;
  
  if ( (rows==5) && (cols==5) )
    var newBoard = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
  else
    var newBoard = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  
  for (let i = 0; i < rows*cols; i++){
    
    if (flag)
      index = Math.floor(Math.random() * pos.length);
    else
      index = 0;
    
    //console.log(number);
    posArr.push(pos[index]);
    
    pos = pos.filter(function(val,ind){
      return ind != index;
    });
    //console.log("pos array", pos, i);
  }
  var counter = 0;
  for (let j = 0; j < cols; j++){
    for (let k = 0; k < rows; k++){
      newBoard[k][j] = posArr[counter];
      counter++;
    }
  }
  return newBoard;
};

function drawBoard(board){
  var val;
  for (let j = 0; j < rows*cols; j++){
    val = board[j%rows][Math.floor(j/cols)];
    if(val === "space"){
      tiles[j].className = "tile space";
      tiles[j].innerHTML = "";
      tiles[j].dataset.tileNumber = "space";
      //console.log(tiles[j]);
    } else {
      tiles[j].className = "tile";
      tiles[j].innerHTML = val;
      tiles[j].dataset.tileNumber = val;
      //console.log(tiles[j]);
    }
    
  }
};

function canSlide(col,row,board){
 
  var spacePos = findSpace(board);
  var spaceCol = spacePos[0]; 
  var spaceRow = spacePos[1];
  
  //console.log('space is ', spaceCol, spaceRow);
  if (((Math.abs(col-spaceCol) === 1) && row-spaceRow === 0) || (Math.abs(row-spaceRow) === 1) && col-spaceCol === 0){
    return true;
  } else {
    return false;
  }
  
};

function findSpace(board){
  var spaceCol;
  var spaceRow;
  
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      if (board[i][j] === "space"){
        spaceCol = i;
        spaceRow = j;
      }
    }
  }
  return [spaceCol,spaceRow];
};


function CheckGame() {
  
  let solved = checkForWin(challenge);
  
  if (solved) {
    
    status.innerHTML = `You won the game using ${num_moves} moves!`;
    document.body.className = "winner";
    
    share.style.display = "revert";
    share.focus();
    ShareIt();
    
  } else {
    status.innerHTML = `Puzzle not yet solved. ${16-num_solved_tiles} tiles in wrong position.`;
  }
}

let num_solved_tiles = 0;

function checkForWin(solution){
  
  num_solved_tiles = 0;
  
  let n = 0;
  
  for(var ii=0; ii<rows; ii++) {
    
    for(var jj=0; jj<cols; jj++) {
      
      if (board[jj][ii] == solution[n]) {
        num_solved_tiles += 1; 
      }
      n++;
    }
  }
  
//  if (board[0][0] == solution[0] && board[1][0] == solution[1] && board[2][0] == solution[2] && board[3][0] == solution[3] && board[0][1] == solution[4] && board[1][1] == solution[5] && board[2][1] == solution[6] && board[3][1] == solution[7] && board[0][2] == solution[8] && board[1][2] == solution[9] && board[2][2] == solution[10] && board[3][2] == solution[11] && board[0][3] == solution[12] && board[1][3] == solution[13] && board[2][3] == solution[14]) {
  if (num_solved_tiles == rows*cols) {
    return true;
  }
  
  return false;   
}

let is_playing = false;

function playAudio() { 
  if (is_playing == false) {
    is_playing = true;
    audio_player.play();
    play_pause.innerHTML = `Pause`;
  } else {
    is_playing = false;
    audio_player.pause();
    play_pause.innerHTML = `Play`;
  }
} 

let puzz = [], copyText;

function ShareIt() {
  
  // Share your results
  let sq = [];
  puzz = ""
  IndxArr.forEach((ID, index) => {
    // console.log(guess_ID);
    // tile.forEach( (IDX, ind) => {
      // console.log(IDX);
      // let ID = Number(IDX);
      if ( ([0,1,2,3]).includes(ID) ) {
        sq = "🟩"; // "\u1F7E9"
      } else if ( ([4,5,6,7]).includes(ID) ) {
        sq = "🟧"; // "\u1F7E7"
      } else if ( ([8,9,10,11]).includes(ID) ) {
        sq = "🟨"; // "\u1F7E8"
      } else if ( ([12,13,14]).includes(ID) ) {
        sq = "🟥"; // "\u1F7E5"
      } else if ( ([15]).includes(ID) ) {
        sq = "🔴"; // "\u1F534"
      }
      puzz += sq;
    
    if (index%4 == 3)
      puzz += "\n";
  });
  
  let linkURL = window.location.href;
  
  copyText = `I solved #ShivaSutra sliding game in ${num_moves} moves\n${puzz} at ${linkURL}`;
  
  navigator.clipboard.writeText(copyText);
  
   if (navigator.canShare) {
    navigator.share({
      title: 'Share results',
      text: `I solved #ShivaSutra sliding game in ${num_moves} moves\n${puzz} at ${linkURL}`,
      // url: linkURL,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
  }
  
//  alert("Copied the results to clipboard");
  tooltip.innerHTML = "Results copied";
}

function outFunc() {
  tooltip.innerHTML = "Copy to clipboard";
}



document.addEventListener("keypress", function onPress(event) {
    if (event.key === "@") {
      console.log("cheat code for testing game");
      status.innerHTML = `Game is solved!`;

      board = randomizeBoard(0);
      drawBoard(board);
      
//      GameOver();
      return;
    }
});


NewGame.addEventListener('click', CreateGame);

check.addEventListener('click', CheckGame);
play_pause.addEventListener('click', playAudio);
audio_player.addEventListener("ended", (event) => {
  is_playing = false;
  play_pause.innerHTML = `Play`;
});

share.style.display = "none";
puzzle.style.display = "none";
check.style.display = "none";

