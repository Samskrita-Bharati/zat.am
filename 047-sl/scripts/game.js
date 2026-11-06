import { 
  update as updateSnake, 
  draw as drawSnake, 
  SNAKE_SPEED, 
  getSnakeHead, 
  snakeIntersection,
  resetSnake
} from './snake.js';
import { update as updateFood, draw as drawFood, resetFood, getScore } from './food.js';
import { outsideGrid } from './grid.js';
import { resetInput } from './input.js';

let lastRenderTime = 0;
let gameOver = false;
let highscore = Number.parseInt(localStorage.getItem('highscore'), 10) || 0;
const gameBoard = document.getElementById('game-board');
const gameOverDialog = document.getElementById('game-over-dialog');
const currentScore = document.getElementById('snake-current-score');
const bestScore = document.getElementById('snake-best-score');
const gameOverRoundScore = document.getElementById('game-over-round-score');
const gameOverHighscore = document.getElementById('game-over-highscore');
const restartButton = document.getElementById('restart-button');

function main(currentTime) {
  if (gameOver) {
    showGameOver();
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
  updateScoreboard();
}

function checkDeath() {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

function showGameOver() {
  gameOverRoundScore.textContent = toSanskritNumber(getScore());
  gameOverHighscore.textContent = toSanskritNumber(highscore);
  gameOverDialog.hidden = false;
  restartButton.focus();
}

function restartGame() {
  gameOver = false;
  lastRenderTime = 0;
  resetInput();
  resetSnake();
  resetFood();
  gameOverDialog.hidden = true;
  draw();
  window.requestAnimationFrame(main);
}

restartButton.addEventListener('click', restartGame);

function updateScoreboard() {
  currentScore.textContent = toSanskritNumber(getScore());
  bestScore.textContent = toSanskritNumber(highscore);
}

function toSanskritNumber(number) {
  const sanskritNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  const digits = number.toString().split('');
  return digits.map(digit => sanskritNumbers[parseInt(digit)]).join('');
}

export function updateHighscore(score) {
  const adjustedScore = score > 0 ? score - 1 : 0;
  if (adjustedScore > highscore) {
    highscore = adjustedScore;
    localStorage.setItem('highscore', highscore);
  }

  updateScoreboard();
}
