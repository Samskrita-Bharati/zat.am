/* global canvas ctx animation:writable gameLoop label loop paintCircle isIntersectingRectangleWithCircle generateRandomNumber generateRandomCharCode paintParticles createParticles processParticles */
let score = 0;
let lives = 10;
let caseSensitive = false;

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: "rgb(253, 135, 12)",
};

const letter = {
  font: "35px Monospace",
  color: "#666",
  width: 15,
  height: 20,
  highestSpeed: 1.6,
  lowestSpeed: 0.6,
  probability: 0.02,
};

let letters = [];

ctx.font = label.font;
letter.width = ctx.measureText("0").width;
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
window.addEventListener("resize", resizeHandler);

loop(function (frames) {
  paintCircle(center.x, center.y, center.radius, center.color);
  ctx.font = letter.font;
  ctx.fillStyle = letter.color;
  for (const l of letters) {
    const sanskritDigit = Sanscript.t(
      String.fromCharCode(l.code),
      "iast",
      "devanagari"
    ); //assigned to "sanskritDigit" for better readiblity

    ctx.fillText(sanskritDigit, l.x, l.y);
  }
  paintParticles();
  ctx.font = label.font;
  ctx.fillStyle = center.color;
  ctx.fillText(
    "Score: " + Sanscript.t(String(score), "iast", "devanagari"),
    label.left,
    label.margin
  );
  ctx.fillText(
    "Lives: " + Sanscript.t(String(lives), "iast", "devanagari"),
    label.right,
    label.margin
  );
  processParticles(frames);
  createLetters();
  removeLetters(frames);
});

function createLetters() {
  if (Math.random() < letter.probability) {
    const x = Math.random() < 0.5 ? 0 : canvas.width;
    const y = Math.random() * canvas.height;
    const dX = center.x - x;
    const dY = center.y - y;
    const norm = Math.sqrt(dX ** 2 + dY ** 2);
    const speed = generateRandomNumber(letter.lowestSpeed, letter.highestSpeed);
    const charCode = generateRandomCharCodeNum();
    letters.push({
      x,
      y,
      code: charCode, //assigned to charCode for better readiblity
      speedX: (dX / norm) * speed,
      speedY: (dY / norm) * speed,
    });
  }
}

function removeLetters(frames) {
  for (const l of letters) {
    if (
      isIntersectingRectangleWithCircle(
        { x: l.x, y: l.y - letter.height },
        letter.width,
        letter.height,
        center,
        center.radius
      )
    ) {
      if (--lives === 0) {
        window.alert("GAME OVER!");
        window.location.reload(false);
      } else if (lives > 0) {
        // window.alert("START AGAIN!");
        letters = [];
      }
      break;
    } else {
      l.x += l.speedX * frames;
      l.y += l.speedY * frames;
    }
  }
}

function type(i, l) {
  letters.splice(i, 1);
  score++;
  playSound(l.code);
  createParticles(l.x, l.y);
}

function keyDownHandler(e) {
  if (animation !== undefined && e.keyCode >= 48 && e.keyCode <= 57) {
    for (let i = letters.length - 1; i >= 0; i--) {
      const l = letters[i];
      if (e.keyCode === l.code) {
        type(i, l);
        return;
      }
    }
    score--;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 27) {
    if (animation === undefined) {
      animation = window.requestAnimationFrame(gameLoop);
    } else {
      window.cancelAnimationFrame(animation);
      animation = undefined;
    }
  }
}

function resizeHandler() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
}

function playSound(code) {
  const digit = String.fromCharCode(code);
  const paddedCode = digit.padStart(8, "0"); //padding to look for 8 char str in sounds :)
  const audioPath = `sounds/${paddedCode}.mp3`;
  const audio = new Audio(audioPath);
  //Debugging
  // audio.onerror = () => {
  //   console.warn(`Audio file not found: ${audioPath}`);
  // };
  audio.play();
}