const reference = document.getElementById("reference");
const quote = document.getElementById("quote");
const start = document.getElementById("start");
const info = document.getElementById("info");
const message = document.getElementById("message");
const list_choices = document.getElementById("list_choices");
const meaning = document.getElementById("meaning");
const words = document.getElementById("words");
const settings = document.getElementById("settings");
const share =  document.getElementById("share");
const tooltip = document.getElementById("myTooltip");
const hist_graph = document.getElementById("guess-distribution");
const image = document.getElementById("image");


let hanuman_chalisa;

async function get_chalisa() {
  
  let responses = await fetch('/056-hanuman-chalisa/hanuman_chalisa.txt');
  
  hanuman_chalisa = await responses.json();
  
  // console.log(hanuman_chalisa);
  
}

get_chalisa();

let choices, quoteText, startTime, ch_index = 0, sh_index = -1, is_playing = false;

let num_guess, is_random, num_choices = 5; 

let hist_guess =  Array(num_choices+1).fill(0);

function startGame() {
  console.log("new game started!");
  is_playing = true;
  num_guess = 0;
  
  is_random = document.getElementById('rand').checked;
  // console.log("Is random: ",is_random);
  
  message.innerHTML = ``;
  meaning.innerHTML = ``;
  words.innerHTML = ``;
  image.style.display = "none";
  
  info.innerHTML = `Complete this verse.`;
  start.innerHTML = `New Game`;
  // viswaroopa.innerHTML = ``;
  // input.style.display = "block";
  share.style.display = "none";
  tooltip.innerHTML = "Copy to clipboard";
  hist_graph.innerHTML = ``;

  list_choices.innerHTML = `<ul>  
    <template id="choice_item">
      <li class="item"></li>
    </template>
    </ul>`;
  
  if (is_random == true) {
    ch_index = Math.floor(Math.random() * hanuman_chalisa.length);
    sh_index = Math.floor(Math.random() * hanuman_chalisa[ch_index].length);
  } else {
    sh_index++;
    if (sh_index == hanuman_chalisa[ch_index].length) {
      sh_index = 0;
      ch_index++;
      if (ch_index == hanuman_chalisa.length) {
        ch_index = 0;
      }
    }
  }
  quoteText = `${hanuman_chalisa[ch_index][sh_index].chaupai.split("।").join("।<br>")}`;
  // wordQueue = quoteText.split(" ");
  
  let word_list = hanuman_chalisa[ch_index][sh_index].words.split(",");
  for (let i = 0; i< word_list.length; i++) {
    let w = word_list[i];
    quoteText = quoteText.replace(w," ___");
  }
  
  reference.innerHTML = `<span class="boldit">Chaupai</span>: ${sh_index+1}`;
  quote.innerHTML = quoteText;
//  quote.innerHTML = wordQueue.map((word) => `<span>${word}</span>`).join("").split(",").join("<br>");
//  highlightPosition = 0;
//  quote.childNodes[highlightPosition].className = "highlight";
  
  choices = Array.from({length: hanuman_chalisa[ch_index].length}, (x, i) => i);
  shuffle(choices);
  choices.splice(choices.indexOf(sh_index),1);
  choices.length = num_choices-1;
  choices.push(sh_index);
  shuffle(choices);
  // console.log(choices);
  
  const template = document.getElementById('choice_item');
  
  for(let i = 0; i < num_choices; i++)   {
  
    const choice_item = template.content.cloneNode(true);
    const item = choice_item.querySelector('.item');
    let text = hanuman_chalisa[ch_index][choices[i]].words;
    item.innerHTML = `<button onclick="submitButtonStyle(this); checkAnswer(${choices[i]})" >${text}</button><br><br>`;
      
    list_choices.appendChild(item);
    
  }
  
  startTime = new Date().getTime();
  
  document.body.className = "";
  
  // $("typedValue").focus();
//  document.getElementById("typedValue").focus();
//  document.getElementById("typedValue").select();
}


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function submitButtonStyle(_this) {
  _this.style.backgroundColor = "red";
}

function checkAnswer(selected_index) {
  
  if (is_playing == false) {
    return;
  }
  
  num_guess += 1;
  
  if ( (sh_index == selected_index) || (num_guess == 1) ) {
    meaning.innerHTML = `<span class="clue"><span class="boldit">Clue:</span> ${hanuman_chalisa[ch_index][sh_index].meaning}</span>`;
  }
  
  if ( (sh_index == selected_index) || (num_guess == 2) ) {
    words.innerHTML = `<span class="clue"><span class="boldit">Hint:</span> ${hanuman_chalisa[ch_index][sh_index].translation}</span>`;
  }
  
  let rnd = Math.floor(Math.random() * 3);
  
  if (sh_index == selected_index) {
    
    if (num_guess == 1) {
      if (rnd == 0)
        message.innerHTML = `Bingo!`;
      else if (rnd==1)
        message.innerHTML = `Nice Job!`;
      else
        message.innerHTML = `Correct guess at first try!`;
    }
    else if (num_guess == 2)
      message.innerHTML = `Second time's a charm?`;
    else if (num_guess == num_choices-1)
      message.innerHTML = `Was this that tough?`;
    else if (num_guess == num_choices)
      message.innerHTML = `You are a genius!`;
    
    hist_guess[num_guess] += 1;

    gameOver();
    
    return (0);
  }
  
  let message_innerHTML;
  
  if (num_guess == 1) {
    if (rnd == 0)
      message_innerHTML = `Strike 1. Give it another try!`;
    else if (rnd==1)
      message_innerHTML = `You cannot get lucky every time.`;
    else
      message_innerHTML = `Keep guessing! Read the clue`;
  }
  else if (num_guess == 2) {
    if (rnd == 0)
      message_innerHTML = `On the bright side, you now have a good chance now!`;
    else if (rnd==1)
      message_innerHTML = `That wasn't it either. Read the hint`;
    else
      message_innerHTML = `Bad luck again! Use the clue`;
  }
  else if (num_guess == num_choices-1) {
    if (rnd == 0)
      message_innerHTML = `Duh. It can't get anymore clear!`;
    else if (rnd==1)
      message_innerHTML = `Last chance. The hints are useful!`;
    else
      message_innerHTML = `Today isn't your lucky day.`;
  }
  else if (num_guess >= num_choices) {
    if (rnd == 0)
      message_innerHTML = `Did you repeat your guess?`;
    else if (rnd==1)
      message_innerHTML = `You have no idea. Did you read the hint?`;
    else
      message_innerHTML = `Are you randomly clicking?`;
  }
  else {
    if (rnd == 0)
      message_innerHTML = `Wrong answer. Try using the clue this time!`;
    else if (rnd==1)
      message_innerHTML = `Hard luck. You could pay attention to meanings of words!`;
    else
      message_innerHTML = `Incorrect. Using the hints makes it easy!`;
  }
  
  message.innerHTML = `<span class="wrong">${message_innerHTML}</span>`;
  
  return(1);
}

var Ts = document.createElement("template");
Ts.innerHTML = `<div class="graph-container">
      <div class="guess"></div>
      <div class="graph">
        <div class="graph-bar">
          <div class="num-guesses">
        </div>
      </div>
      </div>
    </div>`;

// var Ts = document.getElementById("guess-distribution"); 

function update_hist() {
  
  let t = 0; 
  hist_guess.forEach(x => {t += x;});
  
  hist_graph.innerHTML = `<h3>Guess Distribution</h3>`;
  
  for (var n = 1; n < Object.keys(hist_guess).length; n++) {
      var r = n,
          i = hist_guess[n],
          l = Ts.content.cloneNode(!0),
          d = Math.max(7,Math.round((i / t) * 100));
    
      l.querySelector(".guess").textContent = r;
    
      var u = l.querySelector(".graph-bar");
    
      if ( ((u.style.width = "".concat(d,"%")),"number" == typeof i) ) {
          (l.querySelector(".num-guesses").textContent = i),i > 0 && u.classList.add("align-right");
          var c = num_guess;// parseInt(this.getAttribute("highlight-guess"),10);
          c && n === c && u.classList.add("highlight");
      }
      hist_graph.appendChild(l);
  }
  // window.alert('dialog');
}
  
let elapsedTime;

function gameOver() {
  
  if (is_playing == false) {
    return;
  } else {
    is_playing = false;
  }
  
  elapsedTime = new Date().getTime() - startTime;
  // let time_taken = (elapsedTime/1000);
  // console.log(`Time taken is: ${Math.round(time_taken)}`)

  list_choices.innerHTML = `<ul>  
  <template id="choice_item">
    <li class="item"></li>
  </template>
  </ul>`;
  

  message.innerHTML = `
    <span class="congrats">Congrats!</span>
    <br> You completed the verse in ${elapsedTime/1000} seconds and took ${num_guess} guess(es).
    `;
  
  quote.innerHTML = `<span class="quote">${hanuman_chalisa[ch_index][sh_index].chaupai.split("।").join(" ।<br>")}</span>`;
  meaning.innerHTML = `<span class="meaning"><span class="boldit">Meaning:</span> ${hanuman_chalisa[ch_index][sh_index].meaning}</span>`;
  
  update_hist();
  
  // input.style.display = "none";
  share.style.display = "block";
  share.focus();
  
  if (is_random == false) {
    save_history();
  }
  
//  document.body.className = "winner";
  ShareIt();
}

var copyText;

function ShareIt() {
  
  let linkURL = window.location.href;
  
  copyText = `#Chalisa I completed the chaupai ${sh_index+1} using rhyming words in ${Math.round(elapsedTime/1000)} sec at ${linkURL}`;
  
  navigator.clipboard.writeText(copyText);
  
   if (navigator.canShare) {
    navigator.share({
      title: 'Share results',
      text: `#Chalisa I completed the chaupai ${sh_index+1} using rhyming words in ${Math.round(elapsedTime/1000)} sec at ${linkURL}`,
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
      checkAnswer(sh_index);
      return;
    }
    if (event.key === "n") {
      console.log("started new game");
      startGame();
      return;
    }
});


function get_history() {
  const noItemsFound_ch = '0', noItemsFound_sh = '-1', noItemsFound_hist = '[0,0,0,0,0,0]';
  const ch = localStorage.getItem('ch_index') || noItemsFound_ch;
  const sh = localStorage.getItem('sh_index') || noItemsFound_sh;
  const hist = localStorage.getItem('hist_guess') || noItemsFound_hist;
  ch_index = JSON.parse(ch);
  sh_index = JSON.parse(sh);
  hist_guess = JSON.parse(hist);
}

function save_history() {
  const ch = JSON.stringify(ch_index);
  const sh = JSON.stringify(sh_index);
  const hist = JSON.stringify(hist_guess);
  localStorage.setItem('ch_index', ch);
  localStorage.setItem('sh_index', sh);
  localStorage.setItem('hist_guess', hist);
}

get_history();

share.style.display = "none";

document.getElementById("start").focus();
start.addEventListener("click", startGame);

