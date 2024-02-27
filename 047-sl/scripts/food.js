import { onSnake, expandSnake } from './snake.js';
import { randomGridPosition } from './grid.js';
import { updateHighscore } from './game.js';

let food = getRandomFoodPosition();
let foodNumber = 1; 
const EXPANSION_RATE = 5;

export function update() {
  if (onSnake(food)) {
    expandSnake(EXPANSION_RATE);
    foodNumber++; 
    food = getRandomFoodPosition();
    updateHighscore(foodNumber); 
  }
}

export function draw(gameBoard) {
  const foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  foodElement.textContent = toSanskritNumber(foodNumber); 
  gameBoard.appendChild(foodElement);
}

function getRandomFoodPosition() {
  let newFoodPosition;
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = randomGridPosition();
  }
  return newFoodPosition;
}

function toSanskritNumber(number) {
  const sanskritNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return number.toString().split('').map(digit => sanskritNumbers[digit]).join('');
}
