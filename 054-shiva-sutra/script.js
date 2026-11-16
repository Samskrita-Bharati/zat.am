const puzzle = document.getElementById("board");
const info = document.getElementById("info");
const NewGame = document.getElementById("randomize");
const check = document.getElementById("check");
const status = document.getElementById("status");
const image = document.getElementById("image");
const audio_player = document.getElementById("SS_Audio");
const play_pause = document.getElementById("play_pause");

const sutra_devanagiri = ["अ इ उ ण्", "ऋ ऌ क्", "ए ओ ङ्", "ऐ औ च्", "ह य व र ट्", "ल ण्", "ञ म ङ ण न म्", "झ भ ञ्", "घ ढ ध ष्", "ज ब ग ड द श्", "खफछठथचटतव्", "क प य्", "श ष स र्", "ह ल्", "🕉", "space"];

const alphabets_devanagiri = ["अ","इ","उ","ऋ","ऌ","ए","ऐ","ओ","औ","क","ख","ग","घ","ङ","च","छ","ज","झ","ञ","ट","ठ","ड","ढ","ण","त","थ","द","ध","न","प","फ","ब","भ","म","य","र","ल","व","श","ष","स","ह"];

let sutra, alphabets, challenge, num_moves = 0;

var tiles = document.querySelectorAll(".tile");
var board = [[]];
let IndxArr = [];

var cols = 4;
var rows = 4;

let challenge_id = 1;

function CreateGame() {
  if (savingScore) return;
  playing = false;
  stopTimer();
  completedAttempt = null;
  practiceRound = false;
  scoreStatus.textContent = "";
  retryScoreButton.hidden = true;

  document.body.classList.remove("winner");
  status.innerHTML = ``;
  image.innerHTML = ``;
  info.innerHTML = ``;

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
  }

  num_moves = 0;

  do {
    board = randomizeBoard(1);

  } while(checkIfSolvable(board) == false || checkForWin(challenge));

  drawBoard(board);

  puzzle.style.display = "revert";
  check.style.display = "revert";
  activeLevel = selectedLevel();
  try { localStorage.setItem("054-shiva-sutra:selected-level", challenge_id); } catch {}
  loadPersonalBest(true);
  startedAt = performance.now();
  playing = true;
  tiles.forEach(tile => tile.setAttribute("aria-disabled", "false"));
  roundToken++;
  const token = roundToken;
  sharedRunInitialized = false;
  scoringReady = loadScoring().then(shared => {
    if (token !== roundToken) return null;
    shared.initGameScore({ gameId: "054-shiva-sutra", gameName: "Shiva Sutra", ...activeLevel });
    sharedRunInitialized = true;
    return shared;
  }).catch(error => { console.warn("Leaderboard unavailable", error); return null; });
  renderStats();
  timerId = setInterval(renderStats, 250);
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
  var pos = challenge;
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

    posArr.push(pos[index]);

    pos = pos.filter(function(val,ind){
      return ind != index;
    });
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
    } else {
      tiles[j].className = "tile";
      tiles[j].innerHTML = val;
      tiles[j].dataset.tileNumber = val;
    }

  }
};

function canSlide(col,row,board){

  var spacePos = findSpace(board);
  var spaceCol = spacePos[0];
  var spaceRow = spacePos[1];

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
  if (!playing) return;

  let solved = checkForWin(challenge);

  if (solved) {

    status.innerHTML = `You won the game using ${num_moves} moves!`;
    document.body.classList.add("winner");

    finishGame();

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

  if (num_solved_tiles == rows*cols) {
    return true;
  }

  return false;
}


async function playAudio() {
  if (
    document.querySelector('input[name="challenge"]:checked').value !== "1"
  ) {
    return;
  }

  if (!audio_player.paused) {
    audio_player.pause();
    play_pause.textContent = "Listen";
    return;
  }

  try {
    await audio_player.play();
    // The player may have switched modes while playback was starting.
    if (document.querySelector('input[name="challenge"]:checked').value !== "1") {
      updateAudioVisibility();
      return;
    }
    play_pause.textContent = "Pause";
  } catch (error) {
    play_pause.textContent = "Listen";
    console.warn("Shiva Sutra audio could not play.", error);
  }
}

document.addEventListener("keypress", function onPress(event) {
    if (event.key === "@") {
      if (!playing) return;
      practiceRound = true;
      status.innerHTML = `Game is solved!`;

      board = randomizeBoard(0);
      drawBoard(board);

      return;
    }
});


NewGame.addEventListener('click', CreateGame);

check.addEventListener('click', CheckGame);
play_pause.addEventListener('click', playAudio);
audio_player.addEventListener("ended", (event) => {
  play_pause.textContent = "Listen";
});

puzzle.style.display = "none";
check.style.display = "none";

// A single move handler per tile keeps move counts accurate across restarts.
tiles.forEach(tile => tile.addEventListener("click", function () {
  if (!playing || !canSlide(this.dataset.col, this.dataset.row, board)) return;
  const [spaceCol, spaceRow] = findSpace(board);
  board[spaceCol][spaceRow] = this.dataset.tileNumber;
  board[this.dataset.col][this.dataset.row] = "space";
  num_moves++;
  drawBoard(board);
  renderStats();
  if (checkForWin(challenge)) CheckGame();
}));

// Shared scorer owns all leaderboard writes.
const startingScore = 2000;
const scoreStatus = document.getElementById("score-status");
const retryScoreButton = document.getElementById("retry-score");
let playing = false, practiceRound = false, savingScore = false;
let startedAt = 0, timerId, roundToken = 0, completedAttempt = null;
let activeLevel, sharedRunInitialized = false, scoringReady;
let scoringModule, bestFirebase, bestFirestore, bestRequestId = 0;

function selectedLevel() {
  const value = document.querySelector('input[name="challenge"]:checked').value;
  return value === "2"
    ? { levelId: "alphabet", levelName: "Alphabet" }
    : { levelId: "sutra", levelName: "Shiva Sutra" };
}

function formatTime(seconds) {
  return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
}
function elapsedSeconds() {
  return Math.max(0, Math.floor((performance.now() - startedAt) / 1000));
}
function calculateScore(seconds, moves) {
  const rawScore = Math.max(100, startingScore - seconds * 2 - moves * 2);
  return { rawScore, leaderboardScore: Math.max(0, Math.min(100, Math.round(rawScore / startingScore * 100))) };
}
function renderStats() {
  const seconds = playing ? elapsedSeconds() : completedAttempt?.seconds ?? 0;
  document.getElementById("round-time").textContent = formatTime(seconds);
  document.getElementById("round-moves").textContent = num_moves;
  document.getElementById("round-score").textContent = calculateScore(seconds, num_moves).leaderboardScore + "/100";
}
function stopTimer() { clearInterval(timerId); }
function loadScoring() {
  scoringModule ??= import("../js/game-score.js").catch(error => {
    scoringModule = null;
    throw error;
  });
  return scoringModule;
}
function isBetterBest(candidate, current) {
  return !current || candidate.score > current.score ||
    (candidate.score === current.score && (candidate.seconds < current.seconds ||
      (candidate.seconds === current.seconds && candidate.moves < current.moves)));
}
function validBest(best) {
  return best && Number.isInteger(best.score) && best.score >= 0 && best.score <= 100 &&
    Number.isInteger(best.moves) && best.moves >= 0 && Number.isInteger(best.seconds) && best.seconds >= 0;
}
function bestKey(level) {
  return "054-shiva-sutra:best:" + (bestFirebase?.auth.currentUser?.uid ?? "guest") + ":" + level.levelId;
}
function readLocalBest(level) {
  try {
    const best = JSON.parse(localStorage.getItem(bestKey(level)));
    return validBest(best) ? best : null;
  } catch { return null; }
}
function writeLocalBest(level, best) {
  const old = readLocalBest(level);
  const result = isBetterBest(best, old) ? best : old;
  try { localStorage.setItem(bestKey(level), JSON.stringify(result)); } catch {}
  return result;
}
function showPersonalBest(best, message = "") {
  document.getElementById("best-level").textContent = selectedLevel().levelName;
  document.getElementById("best-score").textContent = best ? best.score + " / 100" : "— / 100";
  document.getElementById("best-moves").textContent = best ? best.moves : "—";
  document.getElementById("best-time").textContent = best ? formatTime(best.seconds) : "—";
  document.getElementById("best-status").textContent = message;
}
function bestFromHistory(history, uid, level) {
  let best = null;
  history.forEach(monthDocument => {
    const data = monthDocument.data();
    for (const [key, score] of Object.entries(data.entries || {})) {
      const parts = key.split("_");
      if (parts.length < 4 || parts.at(-1) !== "054-shiva-sutra" || parts.slice(1, -2).join("_") !== uid) continue;
      const attempt = data.attemptMeta?.[key];
      if (attempt?.result !== "completed" || attempt.levelId !== level.levelId) continue;
      const candidate = { score, moves: attempt.moves, seconds: attempt.puzzleSeconds ?? attempt.elapsedSeconds };
      if (validBest(candidate) && isBetterBest(candidate, best)) best = candidate;
    }
  });
  return best;
}
async function loadPersonalBest(clearPrevious = false) {
  const level = selectedLevel();
  const requestId = ++bestRequestId;
  const localBest = readLocalBest(level);
  if (clearPrevious) showPersonalBest(localBest, localBest ? "Personal best on this device." : "No completed rounds yet.");
  if (!bestFirebase || !bestFirestore) return;
  const user = bestFirebase.auth.currentUser;
  if (!user) {
    showPersonalBest(localBest, "Sign in to save scores to the leaderboard. Guest bests stay on this device.");
    return;
  }
  try {
    const history = await bestFirestore.getDocs(bestFirestore.collection(bestFirebase.db, "leaderboards", "054-shiva-sutra", "gameHistory"));
    if (requestId !== bestRequestId || bestFirebase.auth.currentUser?.uid !== user.uid || selectedLevel().levelId !== level.levelId) return;
    const saved = bestFromHistory(history, user.uid, level);
    if (saved) writeLocalBest(level, saved);
    const best = readLocalBest(level);
    showPersonalBest(best, saved && (!best || !isBetterBest(best, saved))
      ? "Best from your leaderboard history."
      : best ? "Personal best on this device; it may not have been saved online." : "No completed rounds yet.");
  } catch (error) {
    if (requestId !== bestRequestId || bestFirebase.auth.currentUser?.uid !== user.uid) return;
    showPersonalBest(readLocalBest(level), "Could not load leaderboard history. Showing this device’s best.");
    console.warn("Personal best history unavailable", error);
  }
}
async function initializePersonalBest() {
  try {
    [bestFirebase, bestFirestore] = await Promise.all([
      import("../auth/api/firebase-config.js"),
      import("https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js")
    ]);
    bestFirebase.onAuthStateChanged(bestFirebase.auth, () => loadPersonalBest(true), () => {
      bestRequestId++;
      showPersonalBest(null, "Could not check sign-in status.");
    });
  } catch (error) {
    console.warn("Using local personal best", error);
    showPersonalBest(readLocalBest(selectedLevel()), "Personal best on this device. Online history unavailable.");
  }
}
function finishGame() {
  const seconds = elapsedSeconds();
  playing = false;
  stopTimer();
  tiles.forEach(tile => tile.setAttribute("aria-disabled", "true"));
  if (practiceRound) {
    completedAttempt = { seconds };
    renderStats();
    scoreStatus.textContent = "Test round. Score not saved.";
    return;
  }
  const calculated = calculateScore(seconds, num_moves);
  completedAttempt = { ...calculated, seconds, moves: num_moves, level: { ...activeLevel }, initialized: sharedRunInitialized, saved: false };
  renderStats();
  status.textContent = "Solved! Score: " + calculated.leaderboardScore + "/100 · Time: " + formatTime(seconds) + " · Moves: " + num_moves;
  const best = writeLocalBest(activeLevel, { score: calculated.leaderboardScore, seconds, moves: num_moves });
  showPersonalBest(best, "Personal best on this device.");
  submitCompletedScore();
}
async function submitCompletedScore() {
  const attempt = completedAttempt;
  if (!attempt?.level || attempt.saved || savingScore) return;
  savingScore = true;
  retryScoreButton.hidden = true;
  scoreStatus.textContent = "Saving your leaderboard score…";
  NewGame.disabled = check.disabled = true;
  const choices = [...document.querySelectorAll('input[name="challenge"]')];
  choices.forEach(input => input.disabled = true);
  try {
    let shared = await scoringReady;
    if (!shared) shared = await loadScoring();
    if (!attempt.initialized && !sharedRunInitialized) {
      shared.initGameScore({ gameId: "054-shiva-sutra", gameName: "Shiva Sutra", ...attempt.level });
    }
    attempt.initialized = true;
    const result = await shared.submitGameScore(attempt.leaderboardScore, {
      result: "completed", ...attempt.level,
      metrics: { moves: attempt.moves, puzzleSeconds: attempt.seconds, rawScore: attempt.rawScore, maximumScore: startingScore, puzzleSize: 4 }
    });
    if (result.ok || result.reason === "already-submitted") {
      attempt.saved = true;
      scoreStatus.textContent = "Leaderboard score saved: " + attempt.leaderboardScore + "/100.";
      writeLocalBest(attempt.level, { score: attempt.leaderboardScore, seconds: attempt.seconds, moves: attempt.moves });
      loadPersonalBest(false);
    } else {
      scoreStatus.textContent = result.reason === "not-signed-in" ? "Sign in, then retry saving this score." : "Score was not saved. Please retry.";
      retryScoreButton.hidden = false;
    }
  } catch (error) {
    scoreStatus.textContent = "Could not save your score. Check your connection and retry.";
    retryScoreButton.hidden = false;
    console.warn("Leaderboard submission failed", error);
  } finally {
    savingScore = false;
    NewGame.disabled = check.disabled = false;
    choices.forEach(input => input.disabled = false);
  }
}
retryScoreButton.addEventListener("click", submitCompletedScore);
try {
  const selected = localStorage.getItem("054-shiva-sutra:selected-level");
  if (selected === "1" || selected === "2") document.querySelector('input[name="challenge"][value="' + selected + '"]').checked = true;
} catch {}
showPersonalBest(readLocalBest(selectedLevel()));
initializePersonalBest();
function updateAudioVisibility() {
  const shivaMode =
    document.querySelector('input[name="challenge"]:checked').value === "1";

  play_pause.hidden = !shivaMode;

  if (!shivaMode) {
    audio_player.pause();
    audio_player.currentTime = 0;
    play_pause.textContent = "Listen";
  }
}

document
  .getElementById("settings_2")
  .addEventListener("change", updateAudioVisibility);

updateAudioVisibility();
