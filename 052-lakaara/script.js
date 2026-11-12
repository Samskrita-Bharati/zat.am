const title = document.getElementById("Title");
const desc = document.getElementById("description");
const check = document.getElementById("check");
const start = document.getElementById("start");
const info = document.getElementById("info");
const grid = document.getElementById("grid");
const message = document.getElementById("message");
const details = document.getElementById("details");
const settings = document.getElementById("settings");

let verb, verbs, index = 0, is_playing;

fetch('/052-lakaara/conjugations.txt')
  .then(responses => responses.json())
  .then(resp => {
    verbs = resp;
  })
  .catch(err => console.log(err));


function DragNSort (config) {
  this.$activeItem = null;
  this.$container = config.container;
	this.$items = this.$container.querySelectorAll('.' + config.itemClass);
  this.dragStartClass = config.dragStartClass;
  this.dragEnterClass = config.dragEnterClass;
}

DragNSort.prototype.removeClasses = function () {
	[].forEach.call(this.$items, function ($item) {
		$item.classList.remove(this.dragStartClass, this.dragEnterClass);
  }.bind(this));
};

DragNSort.prototype.on = function (elements, eventType, handler) {
	[].forEach.call(elements, function (element) {
    element.addEventListener(eventType, handler.bind(element, this), false);
  }.bind(this));
};

DragNSort.prototype.onDragStart = function (_this, event) {
  _this.$activeItem = this;

  this.classList.add(_this.dragStartClass);
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/html', this.innerHTML);
};

DragNSort.prototype.onDragEnd = function (_this) {
	_this.removeClasses();
};

DragNSort.prototype.onDragEnter = function (_this) {
  if (!this.classList.contains("solved")) {
    // this.style.cursor = 
	  this.classList.add(_this.dragEnterClass);
  }
};

DragNSort.prototype.onDragLeave = function (_this) {
	this.classList.remove(_this.dragEnterClass);
};

DragNSort.prototype.onDragOver = function (_this, event) {
  if (event.preventDefault) {
  event.preventDefault();
  }

  event.dataTransfer.dropEffect = 'move';

  return false;
};

DragNSort.prototype.onDrop = function (_this, event) {
	if (event.stopPropagation) {
    event.stopPropagation();
  }
  
  if ( (!this.classList.contains("solved")) && (_this.$activeItem !== this) ) {
    _this.$activeItem.innerHTML = this.innerHTML;
    this.innerHTML = event.dataTransfer.getData('text/html');
    _this.$activeItem.classList.remove("checked-correct");
    this.classList.remove("checked-correct");
  }

  _this.removeClasses();

  return false;
};

DragNSort.prototype.bind = function () {
	this.on(this.$items, 'dragstart', this.onDragStart);
	this.on(this.$items, 'dragend', this.onDragEnd);
	this.on(this.$items, 'dragover', this.onDragOver);
	this.on(this.$items, 'dragenter', this.onDragEnter);
	this.on(this.$items, 'dragleave', this.onDragLeave);
	this.on(this.$items, 'drop', this.onDrop);
};

DragNSort.prototype.init = function () {
	this.bind();
};

// Instantiate
var draggable = new DragNSort({
	container: document.querySelector('.drag-list'),
  itemClass: 'drag-item',
  dragStartClass: 'drag-start',
  dragEnterClass: 'drag-enter'
});
draggable.init();


var arr = [];
const Place_ID_list = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X'];

let num_errors, lakaara_num;

function startGame() {
  if (!verbs?.length || savingScore) return;
  console.log("new game started!");
  is_playing = true;
  
  let cur_num, incr, changed;
  
  if (lakaara_num != parseInt(settings.value)) {
    changed = true;
  } else {
    changed = false;
  }
  lakaara_num = parseInt(settings.value);
                         
  // console.log("Is random: ",is_random);
  
  message.innerHTML = ``;
  details.innerHTML = ``;
  info.innerHTML = ``;
  start.innerHTML = `New Game`;
  check.style.display = "block";
  
  if (lakaara_num == -1) {
    index++;
    if (index == verbs.length) {
      index = 0;
    }
  } else {
      if ( (index == -1) || (changed == true) ){
        index = 0;
        incr = 0;
      } else {
        incr = 10;
      }
      cur_num = (index % 10);
      index = index - cur_num + lakaara_num + incr;
    
      if (index >= verbs.length) {
        index = lakaara_num;
      }
    
  }
  // console.log(index);
  
  verb = verbs[index];
  
  title.innerText = `Conjugations for ${verb.word} (${verb.meaning}) `;
  desc.innerText = `${verb.tense} (${verb.lakaara} लकार); ${verb.padi}`;
  
  arr = [];
  
  arr = Array.from({length: 9}, (x, i) => i);
  shuffle(arr);
  
  for(var i=0; i<9; i++) {
    
    let c = Math.floor(arr[i]/3);
    let n = arr[i]%3;
    
    // const newTile = template.content.cloneNode(true);
    const Tile = document.getElementById(`${Place_ID_list[i]}`);
    // const img = newTile.querySelector('.drag-item');
    
    // Tile.style.width = `33.3%`;
    Tile.innerHTML = `<span id="${arr[i]}">${verb.conj[c][n]}</span>`;
    Tile.setAttribute("draggable",true);
    Tile.classList.remove("solved", "checked-correct");
    // grid.appendChild(newTile);
    
  }

  beginScoring();
  
//  document.body.className = "";
  grid.style.display = "revert";
  
  if (typeof verbs[index].vocative !== 'undefined'){
    checkMatrix('8');
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let Guess = [], Guess_ID = [], cur_guess;//, answer="0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23";
const ans = Array.from({length: 9}, (x, i) => i);

let list_person = ["Third person","Second person","First person"];

// let check_person_no = 0;

function checkMatrix(check_person_no) {

  if (!is_playing) {
    return;
  }
  
  Guess_ID = [], Guess = [];

  let d, w, noDataFound = "0";
  // let new_Guess = [...draggable.getElementsByClassName("word")].map(w => w.textContent).join(" ");
  // console.log(new_Guess);
  for (var i=0; i<draggable.$items.length; i++) {
    try {
      d = draggable.$items[i].childNodes[1].id;
      w = draggable.$items[i].childNodes[1].innerText;
    } catch {
      d = draggable.$items[i].childNodes[0].id;
      w = draggable.$items[i].childNodes[0].innerText;
    }
    Guess_ID.push(d);
    Guess.push(w);
  }
  cur_guess = Guess_ID.join(" ");
  
  // const empty_tiles = verb.empty;
  console.log(`Checking person no. ${check_person_no}`);
  if (check_person_no == null) {
    console.log("fail safe");
    check_person_no = 0;
  }
  
  let person_no, num_no, expected, num_misplaced_words = 0;
  
   for (var i = 0; i < draggable.$items.length; i++) {
     
     person_no = Math.floor(i/3);
     num_no = i%3;
     
     expected = verb.conj[person_no][num_no];
     
     if ( (check_person_no === person_no+1) || (check_person_no === 0) ) {
     
       const wrong = expected.localeCompare(Guess[i]) !== 0;
       draggable.$items[i].classList.toggle("checked-correct", !wrong);
       if (wrong) {
         num_misplaced_words += 1;
         chargedMistakes.add(JSON.stringify([i, Guess[i]]));
       }
     }
     
      /*if (empty_tiles.includes(ans[i])) {
       if ((empty_tiles.includes(parseInt(Guess[i])) == false)) {
        num_misplaced_tiles += 1; 
       }
     } else { 
      if (ans[i] != Guess_ID[i]) {
        num_misplaced_tiles += 1;
      }
     }*/
  }  
  
  for(var i=0; i<draggable.$items.length; i++) {

     person_no = Math.floor(i/3);
     num_no = i%3;
    
     if ( (num_misplaced_words == 0) && (check_person_no == person_no+1) ) {
     
      // const newTile = template.content.cloneNode(true);
      const Tile = document.getElementById(`${Place_ID_list[i]}`);

      Tile.setAttribute("draggable",false);
      Tile.classList.add("solved");
     }
  }  
  
  roundScore = Math.max(0, 100 - 2 * chargedMistakes.size);
  renderStats();
  if (check_person_no === 0) {
    if  (num_misplaced_words == 0)  {
      console.log("Successfully finished game");
      gameOver();
      return;
    } else {
      console.log("Wrong guess.. Try again..");
      message.innerHTML = `
        ${num_misplaced_words} words in wrong position.
        Try again.`;    
    }
  } else {
    if (num_misplaced_words == 0)  {
      console.log(`Solved person no. ${check_person_no}`);
      if (typeof check_person_no != 'string' ) {// || check_person_no instanceof String
        message.innerHTML = `Successfully solved ${list_person[check_person_no-1]}`;
      }
      return;
    }  else {
      console.log(`Wrong guess for person no. ${check_person_no} .. Try again..`);
      message.innerHTML = `${list_person[check_person_no-1]}: ${num_misplaced_words} words in wrong position.
        Try again.`;
    }
}
}


function gameOver(testRound = false) {
  if (!is_playing) {
    return;
  } else {
    is_playing = false;
  }
  renderStats();
  
  for(var i=0; i<9; i++) {
    // for(var j=0; j<3; j++) {

    // const newTile = template.content.cloneNode(true);
    const Tile = document.getElementById(`${Place_ID_list[i]}`);
    
    Tile.setAttribute("draggable",false);
    Tile.classList.add("solved");
  }  
  
  message.innerHTML = `
    <span class="congrats">Congrats!</span>
    <br> Score: ${roundScore}/100
    `;
  
  details.innerHTML = ` `;
  
  
  save_history();
  
  
  check.style.display = "none";
  if (testRound) {
    details.textContent = "Test round. Score not saved.";
  } else {
    saveRound();
  }
}

document.addEventListener("keypress", function onPress(event) {
    if ( (event.key === "N") || (event.key === "n") ) {
      startGame();
    }
    if (event.key === "@" && is_playing) {
      console.log("cheat code for testing game");
      // words.innerHTML = ``;
      for(var i=0; i<9; i++) {
        // for(var j=0; j<3; j++) {

        let c = Math.floor(i/3);
        let n = i%3;

        // const newTile = template.content.cloneNode(true);
        const Tile = document.getElementById(`${Place_ID_list[i]}`);
        // const img = newTile.querySelector('.drag-item');

        // Tile.style.width = `33.3%`;
        Tile.innerHTML = `<span id="${i}">${verb.conj[c][n]}</span>`;

        // grid.appendChild(newTile);
        // }
      }
      gameOver(true);
      return;
    }
});

function get_history() {
  const noItemsFound = -1;
  const ind = localStorage.getItem('index') || noItemsFound;
  index = JSON.parse(ind);
}

function save_history() {
  const ind = JSON.stringify(index);
  localStorage.setItem('index', ind);
}

get_history();
grid.style.display = "none";
settings.style.display = "revert";
check.style.display = "none";

start.addEventListener("click", startGame);
check.addEventListener("click", () => {
  checkMatrix(0);
});

const levelIds = {
  "-1": "all", 0: "present", 1: "imperfect-past", 2: "general-past",
  3: "perfect-past", 4: "simple-future", 5: "distant-future",
  6: "imperative", 7: "potential", 8: "benedictive", 9: "conditional",
};
const chargedMistakes = new Set();
const bestKey = "zatam:052-lakaara:personal-best:";
let roundScore = 100, roundLevel, scorerReady, savingScore = false;

function selectedLevel() {
  return {
    levelId: levelIds[settings.value] || "all",
    levelName: settings.selectedOptions[0]?.textContent.trim() || "All",
  };
}

function renderStats() {
  document.getElementById("lakaara-score").textContent = roundScore + "/100";
}

function readBest(level) {
  try {
    const best = JSON.parse(localStorage.getItem(bestKey + level.levelId));
    return Number.isFinite(best?.score) && best.score >= 0 && best.score <= 100 ? best : null;
  } catch {
    return null;
  }
}

function renderBest(level, best = readBest(level)) {
  document.getElementById("lakaara-best-level").textContent = level.levelName;
  document.getElementById("lakaara-best").textContent = best
    ? best.score + "/100"
    : "No completed rounds yet.";
}

function beginScoring() {
  chargedMistakes.clear();
  roundScore = 100;
  roundLevel = selectedLevel();
  renderStats();
  renderBest(roundLevel);
  const level = roundLevel;
  scorerReady = import("../js/game-score.js").then((scorer) => {
    if (roundLevel !== level) return null;
    const config = scorer.initGameScore({
      gameId: "052-lakaara", gameName: "Lakaara Puzzle", ...level,
    });
    if (config?.levelId !== level.levelId) throw new Error("Level-aware game-score.js required.");
    return scorer;
  }).catch((error) => {
    console.error("Lakaara Puzzle scorer initialization failed:", error);
    return null;
  });
}

async function saveRound() {
  const level = roundLevel;
  const score = roundScore;
  const stored = readBest(level);
  const improved = !stored || score > stored.score;
  const best = improved ? { score } : stored;
  if (improved) {
    try { localStorage.setItem(bestKey + level.levelId, JSON.stringify(best)); } catch {}
  }
  renderBest(level, best);
  savingScore = true;
  settings.disabled = start.disabled = true;
  details.textContent = "Saving leaderboard score…";
  try {
    const scorer = await scorerReady;
    if (!scorer) throw new Error("Leaderboard scorer unavailable.");
    const saved = await scorer.submitGameScore(score, {
      result: "completed", ...level,
      metrics: { mistakes: chargedMistakes.size },
    });
    details.textContent = saved?.ok ? "Score saved to the leaderboard."
      : saved?.reason === "not-signed-in" ? "Sign in to save scores to the leaderboard."
      : "Leaderboard score could not be saved.";
  } catch (error) {
    details.textContent = "Leaderboard score could not be saved.";
    console.error(error);
  } finally {
    savingScore = false;
    settings.disabled = start.disabled = false;
  }
}

renderBest(selectedLevel());
