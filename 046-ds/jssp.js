var obj = {}; // obj with all keypress functions

obj.reset = function() {
    alert("समप्तम् !"); // sorry! You DIED!
    for (i = 0; i < robots.length; i++) {
        robots[i].style.top = 9 + "vh";
        curr[i] = 9;
    }
    d = 60;
    l = 50;
    spaceship.style.top = d + "vh";
    spaceship.style.left = l + "vw";
    //document.querySelector("#score").innerHTML = 0;
    //document.querySelector("#name").innerHTML = prompt("नूतनं खिलाडीनाम प्रविष्टं कुर्वन्तु:"); //Enter new player name:
}

obj.f = function() {
    a = parseInt(spaceship.style.left)
    b = parseInt(spaceship.style.top)
    for (i = 0; i < robots.length; i++) {
        if ((parseInt(robots[i].style.left) + 5 > a && a > parseInt(robots[i].style.left)) || ((a + 5 > parseInt(robots[i].style.left)) && a < parseInt(robots[i].style.left)) || ((a + 5 <= parseInt(robots[i].style.left) + 5) && a >= parseInt(robots[i].style.left))) {
            if ((parseInt(robots[i].style.top) + 5 > b) && (b + 5 > parseInt(robots[i].style.top))) {
                obj.reset();
                return;
            }
        }
    }
    k = event.key.toLowerCase();
    if (k == 's') {
        if (100 <= d + 7) {
            obj.reset();
            return;
        }
        d += 2;
        spaceship.style.top = d + "vh";
    } else if (k == 'w') {
        if (d <= 8) {
            obj.reset();
            return;
        }
        d -= 2;
        spaceship.style.top = d + "vh";
    } else if (k == 'd') {
        if (100 <= l + 6) {
            obj.reset();
            return;
        }
        l += 2;
        spaceship.style.left = l + "vw";
    } else if (k == 'a') {
        if (l <= 0) {
            obj.reset();
            return;
        }
        l -= 2;
        spaceship.style.left = l + "vw";
    }
    a = parseInt(spaceship.style.left)
    b = parseInt(spaceship.style.top)
    
    // Move the score update outside the loop
    let scoreUpdated = false;
    for (i = 0; i < robots.length; i++) {
        robots[i].style.top = curr[i] + "vh"
        curr[i] = curr[i] + speeds[i]
        if (curr[i] >= 94) {
            curr[i] = 9;
            k = Math.random() * 7;
            if (k < 1) {
                k = 1;
            }
            speeds[i] = k;
            
            if (!scoreUpdated) {
                // Update the score for each robot that reaches the bottom
                document.querySelector("#score").innerHTML = convertToSanskrit((convertToEnglish(document.querySelector("#score").innerHTML)) + 1);
                scoreUpdated = true;
            }
        }
    }
}

function convertToSanskrit(number) {
    const sanskritNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

    // Convert each digit of the number to Sanskrit numeral
    const sanskritDigits = number.toString().split('').map(digit => sanskritNumerals[digit]);

    return sanskritDigits.join('');
}

function convertToEnglish(sanskritNumber) {
    const sanskritNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    
    // Convert each Sanskrit numeral to English numeral
    const englishDigits = sanskritNumber.split('').map(digit => sanskritNumerals.indexOf(digit));

    return parseInt(englishDigits.join(''));
}


// main code starts
document.querySelector("#name").innerHTML = prompt("नाम किम्?"); // Enter your Name:

d = 60;
l = 50;
robots = document.querySelectorAll(".robo>div");
speeds = []
for (i = 0; i < robots.length; i++) {
    k = ((Math.random()) ** 2) * 7;
    if (k < 1) {
        k = 1;
    }
    speeds[i] = k;
}
curr = []
for (i = 0; i < robots.length; i++) {
    curr[i] = speeds[i] + 9
}

spaceship = document.querySelector("#player"); //main spaceship

window.addEventListener("keypress", obj.f, false); //keypress event handler

