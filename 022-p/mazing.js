// Original JavaScript code by Chirp Internet: chirpinternet.eu
// Please acknowledge use of this code by including this header.
const urlParams = new URLSearchParams(window.location.search);
const scoreConfig = window.PAASHA_SCORE_CONFIG;
var sa = urlParams.get('a');
if (!sa || isNaN(sa))
	sa=1;
function Position(x, y) {
  this.x = x;
  this.y = y;
}

Position.prototype.toString = function() {
  return this.x + ":" + this.y;
};

function Mazing(id) {

  // bind to HTML element
  this.mazeContainer = document.getElementById(id);

  this.mazeScore = document.getElementById("game-score");
  this.gameTimer = document.getElementById("game-time");
  this.timerStartedAt = null;
  this.timerInterval = null;

  this.mazeMessage = document.createElement("div");
  this.mazeMessage.id = "maze_message";
  this.mazeMessage.className = "zatam-game-status zatam-game-status-info";

  this.heroScore = Number(this.mazeContainer.getAttribute("data-steps")) - scoreConfig.initialScoreDeduction;

  this.maze = [];
  this.heroPos = {};
  this.heroHasKey = false;

  for(i=0; i < this.mazeContainer.children.length; i++) {
    for(j=0; j < this.mazeContainer.children[i].children.length; j++) {
      var el =  this.mazeContainer.children[i].children[j];
      this.maze[new Position(i, j)] = el;
      if(el.classList.contains("entrance")) {
        // place hero at entrance
        this.heroPos = new Position(i, j);
        this.maze[this.heroPos].classList.add("hero");
      }
    }
  }

  var mazeOutputDiv = document.createElement("div");
  mazeOutputDiv.id = "maze_output";

  mazeOutputDiv.appendChild(this.mazeMessage);

  this.setMessage("First, find the key.");

  this.mazeContainer.insertAdjacentElement("afterend", mazeOutputDiv);

  // activate control keys
  this.keyPressHandler = this.mazeKeyPressHandler.bind(this);
  if (sa!=0) 
	  document.addEventListener("keydown", this.keyPressHandler, false);

};

Mazing.prototype.setMessage = function(text) {
  this.mazeMessage.innerHTML = text;
  this.mazeScore.textContent = this.heroScore + " - " + Sanscript.t(String(this.heroScore), "itrans", "devanagari");
};

Mazing.prototype.startTimer = function() {
  if(this.timerStartedAt !== null) return;
  this.timerStartedAt = Date.now();
  this.timerInterval = window.setInterval(this.updateTimerDisplay.bind(this), 1000);
  this.updateTimerDisplay();
};

Mazing.prototype.stopTimer = function() {
  if(this.timerInterval !== null) window.clearInterval(this.timerInterval);
  this.timerInterval = null;
  if(this.timerStartedAt !== null) this.updateTimerDisplay();
};

Mazing.prototype.updateTimerDisplay = function() {
  if(this.timerStartedAt === null) return;
  var elapsedSeconds = this.getElapsedSeconds();
  var minutes = Math.floor(elapsedSeconds / 60);
  var seconds = elapsedSeconds % 60;
  this.gameTimer.textContent = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
};

Mazing.prototype.getElapsedSeconds = function() {
  return this.timerStartedAt === null
    ? 0
    : Math.floor((Date.now() - this.timerStartedAt) / 1000);
};

Mazing.prototype.submitLeaderboardScore = async function(score, resultType, metrics) {
  var status = document.getElementById("score-save-status");
  status.hidden = false;
  status.className = "zatam-game-status zatam-game-status-info";
  status.textContent = "Saving your score...";

  if(!window.zatamScore || typeof window.zatamScore.submit !== "function") {
    status.className = "zatam-game-status zatam-game-status-error";
    status.textContent = "The leaderboard is not available right now.";
    return;
  }

  try {
    var leaderboardScore = window.zatamScore.clampScore
      ? window.zatamScore.clampScore(score)
      : Math.max(0, Math.min(100, Math.round(score)));
    var submission = await window.zatamScore.submit(leaderboardScore, {
      result: resultType,
      metrics: Object.assign({}, metrics, { pointsEarned: leaderboardScore }),
    });

    if(submission && submission.ok) {
      status.className = "zatam-game-status zatam-game-status-success";
      status.textContent = "Score saved to the leaderboard ✓";
    } else if(submission && submission.reason === "not-signed-in") {
      status.className = "zatam-game-status zatam-game-status-info";
      status.textContent = "Sign in to save your score to the leaderboard.";
    } else if(submission && submission.reason === "already-submitted") {
      status.className = "zatam-game-status zatam-game-status-success";
      status.textContent = "Score already saved ✓";
    } else {
      status.className = "zatam-game-status zatam-game-status-error";
      status.textContent = "Your score could not be saved.";
    }
  } catch(error) {
    console.error("[022-p] Score submission failed:", error);
    status.className = "zatam-game-status zatam-game-status-error";
    status.textContent = "The leaderboard score could not be saved.";
  }
};

Mazing.prototype.heroTakeKey = function() {
  this.maze[this.heroPos].classList.remove("key");
  this.heroHasKey = true;
  this.heroScore += scoreConfig.keyBonus;
  this.mazeScore.classList.add("has-key");
  this.setMessage("you now have the key!");
};

Mazing.prototype.gameOver = function(text, completed = false) {
  // de-activate control keys
  document.removeEventListener("keydown", this.keyPressHandler, false);
  this.stopTimer();
  this.setMessage(text);
  this.mazeContainer.classList.add("finished");
  if(!completed) {
    this.mazeContainer.classList.add("maze-failed");
    document.getElementById("maze-failure-modal").hidden = false;
  }
};

Mazing.prototype.heroWins = function() {
  this.mazeScore.classList.remove("has-key");
  this.maze[this.heroPos].classList.remove("door");
  this.heroScore += scoreConfig.exitBonus;
  var baseScore = this.heroScore;
  var elapsedSeconds = this.getElapsedSeconds();
  var tierIndex = scoreConfig.timeBonusThresholdsSeconds.findIndex(
    (threshold) => elapsedSeconds < threshold,
  );
  var timeBonus = tierIndex === -1 ? 0 : scoreConfig.timeBonusPoints[tierIndex] ?? 0;
  this.heroScore = Math.max(scoreConfig.minimumScore, baseScore + timeBonus);
  this.gameOver("you finished !!!", true);
  this.mazeContainer.classList.add("maze-won");
  document.getElementById("maze-base-score").textContent = baseScore;
  document.getElementById("maze-time-bonus").textContent = `+${timeBonus}`;
  document.getElementById("maze-final-score").textContent = this.heroScore;
  document.getElementById("maze-win-modal").hidden = false;
  this.submitLeaderboardScore(this.heroScore, "completed", {
    mazeScore: baseScore,
    timeBonus,
    gameTimerSeconds: elapsedSeconds,
  });
};

Mazing.prototype.tryMoveHero = function(pos) {

  if("object" !== typeof this.maze[pos]) {
    return;
  }

  var nextStep = this.maze[pos].className;

  if(nextStep.match(/wall/)) {
    return;
  }
  if(nextStep.match(/exit/) && !this.heroHasKey) {
    this.setMessage("you need a key to unlock the door");
    return;
  }

  this.startTimer();

  if(nextStep.match(/exit/)) {
    this.heroWins();
  }

  // move hero one step
  this.maze[this.heroPos].classList.remove("hero");
  this.maze[pos].classList.add("hero");
  this.heroPos = pos;

  // after moving
  if(nextStep.match(/key/)) {
    this.heroTakeKey();
    return;
  }
  if(nextStep.match(/exit/)) {
    return;
  }
  if(this.heroScore >= 1) {
    this.heroScore = Math.max(this.heroScore - scoreConfig.pointsLostPerMove, scoreConfig.minimumScore);
    if(this.heroScore <= scoreConfig.minimumScore) {
      this.gameOver("sorry, you didn't make it");
    } else {
      this.setMessage("...");
    }
  }
};

Mazing.prototype.mazeKeyPressHandler = function(e) {
  var tryPos = new Position(this.heroPos.x, this.heroPos.y);
  switch(e.keyCode)
  {
    case 37: // left
      this.mazeContainer.classList.remove("face-right");
      tryPos.y--;
      break;

    case 38: // up
      tryPos.x--;
      break;

    case 39: // right
      this.mazeContainer.classList.add("face-right");
      tryPos.y++;
      break;

    case 40: // down
      tryPos.x++;
      break;

    default:
      return;

  }
  this.tryMoveHero(tryPos);
  e.preventDefault();
};

var myfn = function(e) {
  var tryPos = new Position(maze.heroPos.x, maze.heroPos.y);
  switch(e)
  {
    case 'l': // left
      maze.mazeContainer.classList.remove("face-right");
      tryPos.y--;
      break;

    case 'u': // up
      tryPos.x--;
      break;

    case 'r': // right
      maze.mazeContainer.classList.add("face-right");
      tryPos.y++;
      break;

    case 'd': // down
      tryPos.x++;
      break;

    default:
      return;

  }
  maze.tryMoveHero(tryPos);
  //e.preventDefault();
};
