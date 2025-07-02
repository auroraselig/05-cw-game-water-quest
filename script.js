// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items

const grid = document.querySelector('.game-grid');
const startBtn = document.getElementById('start-game');
const cansDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const achievements = document.getElementById('achievements');
const difficultySelect = document.getElementById('difficulty');

const DIFFICULTY_SETTINGS = {
  easy:   { totalCans: 15, time: 40, spawnRate: 1200 },
  normal: { totalCans: 20, time: 30, spawnRate: 1000 },
  hard:   { totalCans: 25, time: 20, spawnRate: 700 }
};

let score = 0;
let timeLeft = 30;
let timerInterval;
let totalCans = DIFFICULTY_SETTINGS.normal.totalCans;
let spawnRate = DIFFICULTY_SETTINGS.normal.spawnRate;

// Creates the 3x3 game grid where items will appear
function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < totalCans; i++) {
    const can = document.createElement('div');
    can.classList.add('can');
    can.innerHTML = '🛢️';
    can.dataset.index = i;
    can.addEventListener('click', collectCan);
    grid.appendChild(can);
  }
}

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

function collectCan(e) {
  if (!gameActive) return;
  const can = e.currentTarget;
  if (can.classList.contains('collected')) return;
  can.classList.add('collected');
  score++;
  cansDisplay.textContent = score;
  can.innerHTML = '💧';
  // Visual feedback
  can.style.background = '#ffd54f';
  setTimeout(() => {
    // Remove the can element from the DOM after feedback
    can.remove();
  }, 200);

  if (score === totalCans) {
    endGame(true);
  }
}

// Initializes and starts a new game
function startGame() {
  // Get selected difficulty
  const difficulty = difficultySelect.value;
  totalCans = DIFFICULTY_SETTINGS[difficulty].totalCans;
  timeLeft = DIFFICULTY_SETTINGS[difficulty].time;
  spawnRate = DIFFICULTY_SETTINGS[difficulty].spawnRate;

  score = 0;
  cansDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  achievements.textContent = '';
  gameActive = true;
  createGrid();
  startBtn.disabled = true;

  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  spawnInterval = setInterval(spawnWaterCan, spawnRate);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

function endGame(won) {
  clearInterval(timerInterval);
  gameActive = false;
  startBtn.disabled = false;
  if (won) {
    // Show correct number of cans for the selected difficulty
    const difficulty = difficultySelect.value;
    const cansGoal = DIFFICULTY_SETTINGS[difficulty].totalCans;
    achievements.textContent = `🎉 You collected ${cansGoal} cans!`;
    achievements.style.color = '#388e3c';
  } else {
    achievements.textContent = '⏰ Time\'s up! Try again!';
    achievements.style.color = '#d32f2f';
  }
}

// Set up click handler for the start button
startBtn.addEventListener('click', startGame);

// Ensure the grid is created when the page loads
window.addEventListener('DOMContentLoaded', () => {
  createGrid();
});
