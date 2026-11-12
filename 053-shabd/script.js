const title = document.getElementById("Title");
const desc = document.getElementById("description");
const check = document.getElementById("check");
const start = document.getElementById("start");
const info = document.getElementById("info");
const grid = document.getElementById("grid");
const message = document.getElementById("message");
const details = document.getElementById("details");
const settings = document.getElementById("settings1");

let noun, nouns, index, is_playing;

fetch('/053-shabd/declensions.txt')
  .then(responses => responses.json())
  .then(resp => {
    console.log(resp);
    nouns = resp;
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
  
  if (_this.$activeItem && !this.classList.contains("solved") && _this.$activeItem !== this) {
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

let num_errors, is_random, dropdown_num = -1;

function startGame() {
  if (!nouns?.length || savingScore) return;
  console.log("new game started!");
  is_playing = true;
  
  let changed;
  // is_random = document.getElementById('rand').checked;
  if (dropdown_num != parseInt(settings.value) ) {
    changed = true;
    dropdown_num = parseInt(settings.value);
  }
  // console.log("Is random: ",is_random);
  
  message.innerHTML = ``;
  details.innerHTML = ``;
  info.innerHTML = ``;
  start.innerHTML = `New Game`;
  check.style.display = "block";
  
  if (dropdown_num == -1) {
    index++;
    if (index == nouns.length) {
      index = 0;
    }
  } else {
      if ( (index == -1) || (changed == true) ){
        index = 0;
      } else {
        index++;
      }
      if (index == nouns.length) {
        index = 0;
      }
      let check_gen, req_noun;
    
      switch (dropdown_num) {
        
        case 0:
          check_gen = 'Masculine';
          req_noun = true;
          break;
          
        case 1:
          check_gen = 'Feminine';
          req_noun = true;
          break;
          
        case 2:
          check_gen = 'Neuter';
          req_noun = true;
          break;
          
        case 3:
          check_gen = 'Masculine';
          req_noun = false;
          break;
          
        case 4:
          check_gen = 'Feminine';
          req_noun = false;
          break;
          
        case 5:
          check_gen = 'Neuter';
          req_noun = false;
          break;
          
        case 6:
          check_gen = 'common';
          req_noun = false;
          break;
      }
    
    while (true)
    {  
      let cur_noun = nouns[index];

      if (cur_noun.gender == check_gen) {
        if (req_noun) {
          if (cur_noun.ending == " ") {
            index++;
          } else {
            break;
          }
        } else {
          if (cur_noun.ending != " ") {
            index++;
          } else {
            break;
          }
        }
      } else {
        index++;
      }
      if (index == nouns.length) {
        index = 0;
      }
    } 
  }
  // console.log(index);

  noun = nouns[index];
  
  title.innerText = `Declensions for ${noun.word} (${noun.meaning}) `;
  if (noun.ending.trim().length !== 0)
    desc.innerText = `Gender: ${noun.gender}; Ending in: ${noun.ending}`;
  else
    desc.innerText = `Gender: ${noun.gender}; Pronoun`;
  
  arr = [];
  
  if (typeof noun.vocative === 'undefined'){
    arr = Array.from({length: 24}, (x, i) => i);
    shuffle(arr);
  } else if (noun.vocative === false){
    arr = Array.from({length: 21}, (x, i) => i);
    shuffle(arr);
    arr.push(21,22,23);
  }
  
  for(var i=0; i<24; i++) {
    
    let c = Math.floor(arr[i]/3);
    let n = arr[i]%3;
    
    // const newTile = template.content.cloneNode(true);
    const Tile = document.getElementById(`${Place_ID_list[i]}`);
    // const img = newTile.querySelector('.drag-item');
    
    // Tile.style.width = `33.3%`;
    Tile.innerHTML = `<span id="${arr[i]}">${noun.decl[c][n]}</span>`;
    Tile.setAttribute("draggable",true);
    Tile.classList.remove("solved", "checked-correct");
    // grid.appendChild(newTile);
    
  }

  beginScoring();
  
//  document.body.className = "";
  grid.style.display = "revert";
  
  if (typeof nouns[index].vocative !== 'undefined'){
    checkMatrix(8, false);
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
const ans = Array.from({length: 24}, (x, i) => i);

let list_cases = ["Nominative","Accusative","Instrumental","Dative","Ablative","Genetive","Locative","Vocative"];

// let check_case_no = 0;

function checkMatrix(check_case_no, penalize = true) {

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
  
  // const empty_tiles = noun.empty;
  console.log(`Checking case no. ${check_case_no}`);
  if (check_case_no == null) {
    console.log("fail safe");
    check_case_no = 0;
  }
  
  let case_no, num_no, num_misplaced_words = 0;
  for (let i = 0; i < draggable.$items.length; i++) {
    const row = Math.floor(i / 3);
    if (check_case_no !== 0 && check_case_no !== row + 1) continue;
    const form = Guess[i];
    const correct = noun.decl[row][i % 3].trimStart().localeCompare(form) === 0;
    draggable.$items[i].classList.toggle("checked-correct", correct);
    if (!correct) {
      num_misplaced_words++;
      const mistake = JSON.stringify([i, form]);
      if (penalize && !chargedMistakes.has(mistake)) {
        chargedMistakes.add(mistake);
        roundScore = Math.max(0, roundScore - 2);
      }
    }
  }
  renderStats();

  for(var i=0; i<draggable.$items.length; i++) {

     case_no = Math.floor(i/3);
     num_no = i%3;
    
     if ( (num_misplaced_words == 0) && (check_case_no == case_no+1) ) {
     
      // const newTile = template.content.cloneNode(true);
      const Tile = document.getElementById(`${Place_ID_list[i]}`);

      Tile.setAttribute("draggable",false);
      Tile.classList.add("solved");
     }
  }  
  
  // console.log(cur_guess);
  if (check_case_no === 0) {
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
      console.log(`Solved case no. ${check_case_no}`);
      if (typeof check_case_no != 'string' ) {// || check_case_no instanceof String
        message.innerHTML = `Successfully solved ${list_cases[check_case_no-1]} case`;
      }
      return;
    }  else {
      console.log(`Wrong guess for case no. ${check_case_no} .. Try again..`);
      message.innerHTML = `${list_cases[check_case_no-1]} case: ${num_misplaced_words} words in wrong position.
        Try again.`;
    }
}
}


function gameOver() {
  if (is_playing == false) {
    return;
  } else {
    is_playing = false;
  }
  renderStats();
  
  for(var i=0; i<24; i++) {
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
  saveRound();

//  document.body.className = "winner";
}

document.addEventListener("keypress", function onPress(event) {
    if ( (event.key === "N") || (event.key === "n") ) {
      startGame();
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


const levelIds = {
  "-1": "all", 0: "noun-masculine", 1: "noun-feminine", 2: "noun-neuter",
  3: "pronoun-masculine", 4: "pronoun-feminine", 5: "pronoun-neuter", 6: "pronoun-common",
};
const chargedMistakes = new Set();
const bestKey = "zatam:053-shabd:personal-best:";
let roundScore = 100, roundLevel, scorerReady, savingScore = false;

function selectedLevel() {
  return {
    levelId: levelIds[settings.value] || "all",
    levelName: settings.selectedOptions[0]?.textContent.trim() || "All",
  };
}

function renderStats() {
  document.getElementById("shabd-score").textContent = roundScore + "/100";
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
  document.getElementById("shabd-best-level").textContent = level.levelName;
  document.getElementById("shabd-best").textContent = best
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
      gameId: "053-shabd", gameName: "Shabd Puzzle", ...level,
    });
    if (config?.levelId !== level.levelId) throw new Error("Level-aware game-score.js required.");
    return scorer;
  }).catch((error) => {
    console.error("Shabd Puzzle scorer initialization failed:", error);
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

renderBest(selectedLevel());const categoryKey = "zatam:053-shabd:selected-category";

function restoreCategoryAndBest() {
  try {
    const saved = localStorage.getItem(categoryKey);

    if (
      saved !== null &&
      Array.from(settings.options).some(option => option.value === saved)
    ) {
      settings.value = saved;
    }
  } catch {
    // Continue playing if browser storage is unavailable.
  }

  renderBest(selectedLevel());
}

settings.addEventListener("change", () => {
  try {
    localStorage.setItem(categoryKey, settings.value);
  } catch {}

  renderBest(selectedLevel());
});

restoreCategoryAndBest();
window.addEventListener("pageshow", restoreCategoryAndBest);