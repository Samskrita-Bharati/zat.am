import { 
  update as updateSnake, 
  draw as drawSnake, 
  SNAKE_SPEED, 
  getSnakeHead, 
  snakeIntersection 
} from './snake.js';
import { update as updateFood, draw as drawFood } from './food.js';
import { outsideGrid } from './grid.js';

let lastRenderTime = 0;
let gameOver = false;
let highscore = localStorage.getItem('highscore') || 0; 
const gameBoard = document.getElementById('game-board');

function main(currentTime) {
  if (gameOver) {
    const displayedHighscore = highscore === 0 ? 0 : highscore;
    if (confirm(`पराजयः 🙁 | पुनः प्रयत्नार्थं ok नुदन्तु | Highscore: ${toSanskritNumber(displayedHighscore)}`)) {
      window.location = '/047-sl/content/game.html';
    }
    return;
  }

  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;

  lastRenderTime = currentTime;

  update();
  draw();
}

window.requestAnimationFrame(main);

function update() {
  updateSnake();
  updateFood();
  checkDeath();
}

function draw() {
  gameBoard.innerHTML = '';
  drawSnake(gameBoard);
  drawFood(gameBoard);
}

function checkDeath() {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

function toSanskritNumber(number) {
  const sanskritNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  const digits = number.toString().split('');
  return digits.map(digit => sanskritNumbers[parseInt(digit)]).join('');
}

export function updateHighscore(score) {
  const adjustedScore = score > 0 ? score - 1 : 0; // Decrement score by 1, but ensure it's not negative
  if (adjustedScore > highscore) {
    highscore = adjustedScore;
    localStorage.setItem('highscore', highscore);
  }
}
