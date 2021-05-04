//  Decaration of variables
 var musicOn = true;
var userScore = 0;
var computerScore = 0;
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const sccoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");
/* hht
const ranks = '० १ २ ३ ४ ५ ६ ७ ८ ९'.split(' ');
const enranks = '0 1 2 3 4 5 6 7 8 9'.split(' ');
const getRank = (i) => ranks[i % 10];
const getenRank = (i) => enranks[i % 10];
*/

// Creating a random function to generate computer choice

function computerChoice() {
    const choices = ['r', 'p', 's'];
    return choices[Math.floor(Math.random() * 3)];
}

// Here I have defined 3 function to for win , luse , draw

function win(userInput, compChoice) {
    userScore++;

    if (userInput === 'r' && compChoice === 's') {
        result_p.innerHTML = `यन्त्रम् chose कर्तरी ✂. You Win ✅🎉`;
    }
    else if (userInput === 'p' && compChoice === 'r') {
        result_p.innerHTML = `यन्त्रम् chose शिलाखण्डः  ⬛. You Win ✅🎉`;
    }
    else if (userInput === 's' && compChoice === 'p') {
        result_p.innerHTML = `यन्त्रम् chose पत्रम् 📜. You Win ✅🎉`;
    }
    // Using a delay of 350ms after showing background green/red/black colour
    document.getElementById(userInput).classList.add('win');
    setTimeout(function () { document.getElementById(userInput).classList.remove('win'); }, 350);
}

function Lose(userInput, compChoice) {
    computerScore++;

    if (userInput === 'r' && compChoice === 'p') {
        result_p.innerHTML = "यन्त्रम् chose पत्रम्  📜 . You Lost ❌";
    }
    else if (userInput === 'p' && compChoice === 's') {
        result_p.innerHTML = `यन्त्रम् chose कर्तरी ✂ . You Lost ❌`;
    }
    else if (userInput === 's' && compChoice === 'r') {
        result_p.innerHTML = `यन्त्रम् chose शिलाखण्डः ⬛ . You Lost ❌`;
    }
    document.getElementById(userInput).classList.add('lose');
    setTimeout(function () { document.getElementById(userInput).classList.remove('lose'); }, 350);

}

function plysnd(evt)
{
	if (evt.target.id == 'rs') inp=0;
	if (evt.target.id == 'ps') inp=1;
	if (evt.target.id == 'ss') inp=2;
	musicelements[0].pause();
		musicelements[1].pause();
			musicelements[2].pause();
	if (true === musicOn)  musicelements[inp].play();
}
musicelements = document.getElementsByTagName("audio");
 document.getElementById("rs").onclick = plysnd;
 document.getElementById("ps").onclick = plysnd;
 document.getElementById("ss").onclick = plysnd;
 musicNode = document.getElementById('music');
            musicNode.onclick = function() {
                var mStatus = 'Sound On';
                if (false === musicOn) {
                    musicOn = true;
                    mStatus = 'Sound On';
                } else {
                    musicOn = false;
                    mStatus = 'Sound Off';
                }
               musicNode.innerHTML = mStatus; 
            };
			
function Draw(userInput, compChoice) {

    if (userInput === 'r' && compChoice === 'r') {
        result_p.innerHTML = `यन्त्रम् chose शिलाखण्डः ⬛ . It's a Draw.`;
    }
    else if (userInput === 'p' && compChoice === 'p') {
        result_p.innerHTML = `यन्त्रम् chose पत्रम्  📜 . It's a Draw.`;
    }
    else if (userInput === 's' && compChoice === 's') {
        result_p.innerHTML = `यन्त्रम् chose Scissors ✂ . It's a Draw.`;
    }
    document.getElementById(userInput).classList.add('draw');
    setTimeout(function () { document.getElementById(userInput).classList.remove('draw'); }, 350);
}

// Getting called by main function with info of user choice
// Calls function Win , Lose and Draw .

function game(userInput) {
    const compChoice = computerChoice();
    const UserChoice = userInput + compChoice;
    if (UserChoice === "rs" || UserChoice === "pr" || UserChoice === "sp") {
        win(userInput, compChoice);
        console.log("Win");
    }
    else if (UserChoice === "rp" || UserChoice === "ps" || UserChoice === "sr") {
        Lose(userInput, compChoice);
        console.log("Lose");
    }
    else if (UserChoice === "rr" || UserChoice === "pp" || UserChoice === "ss") {
        Draw(userInput, compChoice);
        console.log("Draw");
    }
	    userScore_span.innerHTML = userScore.toString().replace(/0/g,"०").replace(/1/g,"१").replace(/2/g,"२").replace(/3/g,"३").replace(/4/g,"४").replace(/5/g,"५").replace(/6/g,"६").replace(/7/g,"७").replace(/8/g,"८").replace(/9/g,"९"); // getRank(userScore);
    computerScore_span.innerHTML = computerScore.toString().replace(/0/g,"०").replace(/1/g,"१").replace(/2/g,"२").replace(/3/g,"३").replace(/4/g,"४").replace(/5/g,"५").replace(/6/g,"६").replace(/7/g,"७").replace(/8/g,"८").replace(/9/g,"९");
	/*computerScore + "<br>"+ getRank(computerScore);*/
}

// Declaration of main function and calling it
// Also initialiser of game

function main() {
    rock_div.addEventListener('click', function () {
        game('r');
    })
    paper_div.addEventListener('click', function () {
        game('p');
    })
    scissors_div.addEventListener('click', function () {
        game('s');
    })
}

main();