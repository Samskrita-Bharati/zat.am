/* global canvas ctx animation:writable gameLoop label loop paintCircle isIntersectingRectangleWithCircle generateRandomNumber generateRandomCharCode paintParticles createParticles processParticles */
let score = 0;
let lives = 10;
let caseSensitive = true;

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: '#FF6347'
};

const letter = {
  font: '35px Monospace',
  color: '#0095DD',
  width: 15,
  height: 20,
  highestSpeed: 1.6,
  lowestSpeed: 0.6,
  probability: 0.02
};

let letters = [];

ctx.font = label.font;
letter.width = ctx.measureText('0').width;
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
window.addEventListener('resize', resizeHandler);

loop(function (frames) {
  paintCircle(center.x, center.y, center.radius, center.color);
  ctx.font = letter.font;
  ctx.fillStyle = letter.color;
  for (const l of letters) {
    ctx.fillText(Sanscript.t(String.fromCharCode(l.code),'iast', 'devanagari'), l.x, l.y);
  }
  paintParticles();
  ctx.font = label.font;
  ctx.fillStyle = center.color;
  ctx.fillText('Score: ' + Sanscript.t(String(score),'iast', 'devanagari'), label.left, label.margin);
  ctx.fillText('Lives: ' + Sanscript.t(String(lives),'iast', 'devanagari'), label.right, label.margin);
  processParticles(frames);
  createLetters();
  removeLetters(frames);
});

function createLetters () {
  if (Math.random() < letter.probability) {
    const x = Math.random() < 0.5 ? 0 : canvas.width;
    const y = Math.random() * canvas.height;
    const dX = center.x - x;
    const dY = center.y - y;
    const norm = Math.sqrt(dX ** 2 + dY ** 2);
    const speed = generateRandomNumber(letter.lowestSpeed, letter.highestSpeed);
    letters.push({
      x,
      y,
	  code: generateRandomCharCodeNum(caseSensitive),
      speedX: dX / norm * speed,
      speedY: dY / norm * speed
    });
  }
}

function removeLetters (frames) {
  for (const l of letters) {
    if (isIntersectingRectangleWithCircle({ x: l.x, y: l.y - letter.height }, letter.width, letter.height, center, center.radius)) {
      if (--lives === 0) {
        window.alert('GAME OVER!');
        window.location.reload(false);
      } else if (lives > 0) {
        window.alert('START AGAIN!');
        letters = [];
      }
      break;
    } else {
      l.x += l.speedX * frames;
      l.y += l.speedY * frames;
    }
  }
}

function type (i, l) {
  letters.splice(i, 1);
  score++;
  createParticles(l.x, l.y);
}


function keyDownHandler (e) {
	debugger;
//  if (animation !== undefined && e.keyCode >= 65 && e.keyCode <= 90) {
	 if (animation !== undefined && e.keyCode >= 48 && e.keyCode <= 57) {
    for (let i = letters.length - 1; i >= 0; i--) {
      const l = letters[i];
        if (e.keyCode === l.code || e.keyCode + 32 === l.code) {
          type(i, l);
          return;
        }
    }
    score--;
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 27) {
    if (animation === undefined) {
      animation = window.requestAnimationFrame(gameLoop);
    } else {
      window.cancelAnimationFrame(animation);
      animation = undefined;
    }
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
}
