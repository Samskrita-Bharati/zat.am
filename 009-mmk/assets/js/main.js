jQuery.htmlPrefilter = function( html ) {
	return html;
};
const btn = document.querySelector('.control-buttons button');
const body = document.querySelector('body');
let numberOfWrongTries = 0
// Adding Music In The Starting Of The Game
//body.addEventListener('mouseover', () => {
    //document.getElementById('startingGameSong').play()
    // console.log('Test OK ?')
//})


btn.addEventListener('click', () => {
    yourName = prompt('नाम किम्?','अर्जुनः');
    if(yourName == null || yourName == ""){
        document.querySelector('.name span').innerHTML = 'Anonym';
    }else{
        document.querySelector('.name span').innerHTML = yourName;
    }
    document.querySelector('.control-buttons').remove();

    document.getElementById('startingGameSong').remove()
});

const duration = 1000

const blocksContainer = document.querySelector('.game-imgs-blocks')

const gameBlocks = Array.from(blocksContainer.children)

const gBlocksOrderRange = [...Array(gameBlocks.length).keys()]

// console.log(gBlocksOrderRange)
shuffle(gBlocksOrderRange)
// console.log(gBlocksOrderRange)

// Add Order CSS Property To Game Blocks.
gameBlocks.forEach((block, index) => {
    block.style.order = gBlocksOrderRange[index]

    // Add A Click Event
    block.addEventListener('click', () => {
        // Trigger The flipBlock Function
        flipBlock(block)
    })
})

// Add Flip Block Function
function flipBlock(selectedBlock) {
    // Add Class is-flipped
    selectedBlock.classList.add('is-flipped')
    // Collect All Flipped Cards
    let allFlippedBlocks = gameBlocks.filter(flippedBlock => flippedBlock.classList.contains('is-flipped'))
    // Checking If There's Two Selected Blocks THEN Stop It And Check.
    if (allFlippedBlocks.length === 2){
        // console.log('Two Cards Selected !')

        // Adding Stop Clicking Function
        stopClicking()

        // Adding Check Matched Block Function
        checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1])
    }


    // Checking If All Cards Are Flipped And Matched ?
    let allCardsIsMatched = gameBlocks.filter(isMatchedBlock => isMatchedBlock.classList.contains('is-match'))
    if (allCardsIsMatched.length === 20) {
        // Launching The Modal Box Using JS When The Player Flips All Matched Cards 
            // alert('उत्तमम् !! '+yourName)
            let triesElement = document.querySelector('.tries span')
            
            if(yourName == null || yourName == ""){
                document.querySelector('.modal-content p').innerHTML = 'उत्तमम्, Anonym 👏, You Won The Game .. After '+Sanscript.t(String(numberOfWrongTries),'iast', 'devanagari')+' Wrong Tries.🙄<br>So You Have To Do The Best! Go Ahead To Play Again! 😘'
            }else{
                document.querySelector('.modal-content p').innerHTML = 'उत्तमम्, '+yourName+' 👏, You Won The Game .. After '+Sanscript.t(String(numberOfWrongTries),'iast', 'devanagari')+' Wrong Tries.🙄<br>So You Have To Do The Best! Go Ahead To Play Again! 😘'
            }
            // Creating the Modal's Variable
            // Get the modal
            var modal = document.getElementById("myModal");

            // Get the button that opens the modal
            // var btn = document.getElementById("myBtn");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks on the button, open the modal
            // btn.onclick = function() {
                modal.style.display = "block";
            // }

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
           // document.getElementById('FinalSuccess1').play()
        
        /*
        setTimeout(() => {
            document.getElementById('FinalSuccess2').play()
        }, duration*2)
        setTimeout(() => {
            document.getElementById('FinalSuccessSong').play()
        }, duration*4)*/
    }
}

// Adding Stop Clicking Function
function stopClicking() {
    // Adding Class No Clicking On Main Container
    blocksContainer.classList.add('no-clicking')

    // Removing Class No Clicking After A Specific Duration
    setTimeout(() => {
        blocksContainer.classList.remove('no-clicking')
    }, duration)
}

function checkMatchedBlocks(firstBlock, secondBlock) {
    let triesElement = document.querySelector('.tries span')

    if (firstBlock.dataset.technology === secondBlock.dataset.technology){
        
        firstBlock.classList.remove('is-flipped')
        secondBlock.classList.remove('is-flipped')

        firstBlock.classList.add('is-match')
        secondBlock.classList.add('is-match')

        //document.getElementById('success2').play()
       // setTimeout(() => {
       //     document.getElementById('maleVoiceSuccess').play()
       // }, duration*2)
        
    }else {
		numberOfWrongTries+=1;
        triesElement.innerHTML = Sanscript.t(String(numberOfWrongTries),'iast', 'devanagari');

        setTimeout(() => {
            firstBlock.classList.remove('is-flipped')
            secondBlock.classList.remove('is-flipped')
        }, duration)
        //document.getElementById('fail').play()
    }
}

// Shuffle Function
function shuffle(array){
    // Settings Vars
    let current = array.length, temp, random

    while (current > 0){
        // Get The Random Number
        random = Math.floor(Math.random() * current)
        //Decrease The Array's Length By One
        current--

        // [1] Save Current Element In Stash
        temp = array[current]
        // [2] Current Element = Random Element
        array[current] = array[random]
        // [3] Random Element = Get Element From Stash
        array[random] = temp
    }
    return array
} 
