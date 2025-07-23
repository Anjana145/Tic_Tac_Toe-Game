let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'friend';
let scores = { x: 0, o: 0, draw: 0 };
let musicPlaying = false;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const playerSelection = document.getElementById('player-selection');
const gameScreen = document.getElementById('game-screen');
const winMessage = document.getElementById('win-message');
const musicBtn = document.getElementById('music-btn');
const backgroundMusic = document.getElementById('background-music');

const startGameBtn = document.getElementById('start-game-btn');
const vsFriendBtn = document.getElementById('vs-friend');
const vsComputerBtn = document.getElementById('vs-computer');
const backToWelcomeBtn = document.getElementById('back-to-welcome');
const backToSelectionBtn = document.getElementById('back-to-selection');
const playAgainBtn = document.getElementById('play-again-btn');
const changeModeBtn = document.getElementById('change-mode-btn');

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset-btn');
const newGameButton = document.getElementById('new-game-btn');
const winText = document.getElementById('win-text');
const winIcon = document.getElementById('win-icon');
const gameModeDisplay = document.getElementById('game-mode');

const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreDraw = document.getElementById('score-draw');

// Music Control
musicBtn.addEventListener('click', toggleMusic);

function toggleMusic() {
    if (musicPlaying) {
        backgroundMusic.pause();
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        musicBtn.classList.remove('bg-red-500');
        musicBtn.classList.add('bg-gradient-to-r', 'from-pink-500', 'to-teal-500');
    } else {
        backgroundMusic.play().catch(e => console.log("Autoplay prevented, user interaction required"));
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        musicBtn.classList.remove('bg-gradient-to-r', 'from-pink-500', 'to-teal-500');
        musicBtn.classList.add('bg-red-500');
    }
    musicPlaying = !musicPlaying;
}

// Event Listeners
startGameBtn.addEventListener('click', () => showScreen('selection'));
vsFriendBtn.addEventListener('click', () => setGameMode('friend'));
vsComputerBtn.addEventListener('click', () => setGameMode('computer'));
backToWelcomeBtn.addEventListener('click', () => showScreen('welcome'));
backToSelectionBtn.addEventListener('click', () => showScreen('selection'));
playAgainBtn.addEventListener('click', hideWinMessage);
changeModeBtn.addEventListener('click', () => showScreen('selection'));

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
newGameButton.addEventListener('click', newGame);

// Functions
function showScreen(screen) {
    welcomeScreen.classList.add('hidden');
    playerSelection.classList.add('hidden');
    gameScreen.classList.add('hidden');
    
    switch(screen) {
        case 'welcome':
            welcomeScreen.classList.remove('hidden');
            break;
        case 'selection':
            playerSelection.classList.remove('hidden');
            break;
        case 'game':
            gameScreen.classList.remove('hidden');
            break;
    }
}

function setGameMode(mode) {
    gameMode = mode;
    gameModeDisplay.textContent = mode === 'friend' ? 'Playing vs Friend' : 'Playing vs Computer';
    resetGame();
    showScreen('game');
}

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

    if (board[cellIndex] !== '' || !gameActive) {
        return;
    }

    makeMove(cellIndex, currentPlayer);

    if (checkWin()) {
        handleWin();
    } else if (checkDraw()) {
        handleDraw();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        
        if (gameMode === 'computer' && currentPlayer === 'O' && gameActive) {
            setTimeout(makeComputerMove, 600);
        } else {
            updateStatus();
        }
    }
}

function makeMove(cellIndex, player) {
    board[cellIndex] = player;
    const cell = cells[cellIndex];
    cell.textContent = player;
    cell.classList.add(player === 'X' ? 'text-blue-500' : 'text-red-500');
    cell.classList.add('scale-110');
    
    // Add fun animation
    cell.style.animation = 'bounce 0.3s';
    setTimeout(() => {
        cell.style.animation = '';
    }, 300);
}

function makeComputerMove() {
    if (!gameActive) return;

    // Simple AI - find available moves
    const availableMoves = [];
    board.forEach((cell, index) => {
        if (cell === '') availableMoves.push(index);
    });

    // Choose random move
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const moveIndex = availableMoves[randomIndex];

    makeMove(moveIndex, 'O');

    if (checkWin()) {
        handleWin();
    } else if (checkDraw()) {
        handleDraw();
    } else {
        currentPlayer = 'X';
        updateStatus();
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Highlight winning cells with fun animation
            pattern.forEach(index => {
                cells[index].classList.add('bg-yellow-200', 'border-yellow-500', 'animate-pulse');
            });
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function handleWin() {
    gameActive = false;
    updateStatus(`Player ${currentPlayer} Wins!`);
    
    if (currentPlayer === 'X') {
        scores.x++;
    } else {
        scores.o++;
    }
    updateScores();

    if (gameMode === 'computer' && currentPlayer === 'O') {
        winText.textContent = 'Computer Wins!';
        winIcon.innerHTML = '🤖';
    } else {
        winText.textContent = `Player ${currentPlayer} Wins!`;
        winIcon.innerHTML = currentPlayer === 'X' ? '🎉' : '🎊';
    }
    showWinMessage();
}

function handleDraw() {
    gameActive = false;
    updateStatus("It's a Draw!");
    scores.draw++;
    updateScores();
    
    winText.textContent = "It's a Draw!";
    winIcon.innerHTML = '🤝';
    showWinMessage();
}

function updateStatus(message) {
    if (message) {
        statusDisplay.textContent = message;
    } else {
        if (gameMode === 'computer' && currentPlayer === 'O') {
            statusDisplay.textContent = "🤖 Computer's Turn 🤖";
        } else {
            statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }
}

function updateScores() {
    scoreX.textContent = scores.x;
    scoreO.textContent = scores.o;
    scoreDraw.textContent = scores.draw;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'w-16 h-16 bg-white border-2 border-purple-400 rounded-xl flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-pink-50 transition-all duration-200 shadow cell hover:scale-105 transform';
    });
    
    updateStatus();
    hideWinMessage();
}

function newGame() {
    scores = { x: 0, o: 0, draw: 0 };
    updateScores();
    resetGame();
}

function showWinMessage() {
    winMessage.classList.remove('hidden');
}

function hideWinMessage() {
    winMessage.classList.add('hidden');
}

// Initialize
updateStatus();