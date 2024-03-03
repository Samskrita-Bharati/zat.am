let timerInterval;
let timeLeft = 30; // provided initial time

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft; // Update the timer display
        if (timeLeft === 0) {
            clearInterval(timerInterval); // timer will stop when it will reach to zero
            alert('Time is up!');
        }
    }, 1000); // Updating the timer every second
}

startTimer(); // calling the function
