gsap.from(".menu-screen .main-instruction",{
    delay:0.2,
    // x:-200,
    // scale:0,
    rotate:-45,
    opacity:0,
    duration: 0.3,
})

var panelContent = document.querySelector(".panel-content");
var timerBox = document.querySelector(".timer-box");
var hitBox = document.querySelector(".hit-box");
var scoreBox = document.querySelector(".score-box");
var gameOverScreen = document.querySelector(".game-over-screen");
var gameOverScore = document.querySelector(".game-over-screen .current-score");
var retplayBtn = document.querySelector(".replay-game-button");
var startBtn = document.querySelector(".start-game-button");
var highScoreDisplay = document.querySelector(".game-over-screen .high-score");
var startForm = document.querySelector('.settings-form-start');
var restartForm = document.querySelector('.settings-form-restart');
var typeOfGame = "numbers";
var diffcultyLevel = 1;
var diffcultyLevelOfNumbers = diffcultyLevel * 10 + 1;

var score = 0;

function getSanskritLettersWithMatras() {
    const consonants = ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट",
     "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य",
      "र", "ल", "व", "श", "ष", "स", "ह"];
    const matras = ["ा", "ि", "ी", "ु", "ू", "ृ", "े", "ै", "ो", "ौ"];

    let combinations = [];

    consonants.forEach(consonant => {
        matras.forEach(matra => {
        combinations.push(consonant + matra);
        });
    });

    return combinations;
}

var allSanskritCombo = getSanskritLettersWithMatras();

var counter = 0;

function initDifficulty() {
    if (counter === 0) {
        typeOfGame = document.querySelector('input[name="startingType"]:checked').value;
        diffcultyLevel = parseInt(document.querySelector(".range-value-start").value);
        diffcultyLevelOfNumbers = diffcultyLevel * 10 + 1;
    } else {
        typeOfGame = document.querySelector('input[name="restartingType"]:checked').value;
        diffcultyLevel = parseInt(document.querySelector(".range-value-restart").value);
        diffcultyLevelOfNumbers = diffcultyLevel * 10 + 1;
    }
}

startForm.addEventListener('change', initDifficulty);

restartForm.addEventListener('change', initDifficulty);


function convertToSanskrit(number) {
    const sanskritDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    const numString = String(Math.abs(number));
    let sanskritString = "";

    for (let i = 0; i < numString.length; i++) {
        const digit = parseInt(numString[i]);
        sanskritString += sanskritDigits[digit];
    }

    if (number < 0) {
        sanskritString = "-" + sanskritString; 
    }

    return sanskritString;
}

function bubbleMaker(panelContent){
  var query = "";
  var panelWidth = (panelContent.offsetWidth);
  var panelHeight = (panelContent.offsetHeight) ;
  var bubbleSize = 40;
  var bubblePerRow = (panelWidth / bubbleSize) -10 + diffcultyLevel;
  var numRow = (panelHeight / bubbleSize) -10 + diffcultyLevel;
  var totalBubbles = bubblePerRow * numRow;
  
  for (let i = 0; i <= totalBubbles; i++) {
    if(typeOfGame === "numbers"){
      var randomNum = Math.floor(Math.random() * diffcultyLevelOfNumbers);
      var sanskritNum = convertToSanskrit(randomNum);
      query += ` <div class="bubble">${sanskritNum}</div> `;
    } 

    else if(typeOfGame === "letters"){
      var percentageOfLetters = diffcultyLevel * 10;
      var numberOfLetters = Math.floor(allSanskritCombo.length * (percentageOfLetters / 100));
      var randomIndex = Math.floor(Math.random() * numberOfLetters);
      var sanskritLetter = allSanskritCombo[randomIndex];
      query += ` <div class="bubble">${sanskritLetter}</div> `;
    }
  }

  document.querySelector(".panel-content").innerHTML = query;
  var bubbles = document.getElementsByClassName("bubble");
  for (let i = 0; i < bubbles.length; i++)
  {
      bubbles[i].style.animationName = "bubble-anim";
      bubbles[i].style.animationIterationCount = "infinite";
      bubbles[i].style.animationDelay = Math.random() + "s";
      bubbles[i].style.animationDuration = 0.8 + Math.random()*0.5 + "s";
  }
}

function gameOver() {
    gameOverScreen.style.display = "flex";
    gsap.from(".game-over-screen",{
        y:"-100vh",
        duration:0.3
    });
    gameOverScore.innerHTML = convertToSanskrit(score);
}


var time = 60;
timerBox.innerHTML = convertToSanskrit(time);
function timeFunction() {
    var timerInterval = setInterval(() => {
    if (time > 0) {
      time--;
      timerBox.innerHTML = convertToSanskrit(time);
    }
    else{
        gameOver();
        clearInterval(timerInterval);
    }
  }, 1000);
}

function generateHit() {
    if(typeOfGame === "numbers"){
      let hitNum = Math.floor(Math.random() * diffcultyLevelOfNumbers);
      hitBox.innerHTML = convertToSanskrit(hitNum);
    } 
    else if(typeOfGame === "letters"){
      var percentageOfLetters = diffcultyLevel * 10;
      var numberOfLetters = Math.floor(allSanskritCombo.length * (percentageOfLetters / 100));
      var randomIndex = Math.floor(Math.random() * numberOfLetters);
      var sanskritLetter = allSanskritCombo[randomIndex];
      hitBox.innerHTML = sanskritLetter;
    }
}

panelContent.addEventListener("click", (dets)=>{
    if(dets.target.classList.contains('bubble')) {
        if(dets.target.innerHTML == hitBox.innerHTML){
            score += 10;
            scoreBox.innerHTML = convertToSanskrit(score);
            if (score >= 0) {
                scoreBox.style.color = "rgb(28, 76, 223)";
            }
            generateHit();
            bubbleMaker(panelContent);
        }
        else{
            score -= 10;
            scoreBox.innerHTML = convertToSanskrit(score);
            if (score < 0) {
                scoreBox.style.color = "red";
            }
            generateHit();
            bubbleMaker(panelContent);
        }
    }
});

startBtn.addEventListener("click", () => {
    counter++;
    gsap.to(".menu-screen",{
        scale:0
    });
    generateHit();
    timeFunction();
    bubbleMaker(panelContent);
});

retplayBtn.addEventListener("click", () => {
    score = 0;
    scoreBox.innerHTML = convertToSanskrit(score);
    scoreBox.style.color = "rgb(28, 76, 223)";
    gameOverScreen.style.display = "none"
    generateHit();
    timeFunction();
    bubbleMaker(panelContent);
    time = 61;
});
