let timerInterval;
let timeLeft = 30; // provided initial time

// Function to convert numbers to Sanskrit numerals
function toSanskritNumerals(number) {
    const sanskritNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return number.toString().split('').map(digit => sanskritNumerals[parseInt(digit)]).join('');
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const timerNode = document.getElementById('timer');
        timerNode.innerText = toSanskritNumerals(timeLeft); // Update the timer display with Sanskrit numerals
        if (timeLeft === -1) {
            clearInterval(timerInterval); // timer will stop when it will reach to zero
            alert('समयः समाप्तः अस्ति !');
        }
    }, 1000); // Updating the timer every second
}

startTimer(); // calling the function

