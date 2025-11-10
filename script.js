// Ambil elemen DOM
const splashScreen = document.getElementById('splash-screen');
const modeSelector = document.getElementById('mode-selector');
const gameBoardScreen = document.getElementById('game-board-screen');

const startButton = document.getElementById('start-button');
const modePVPButton = document.getElementById('mode-pvp');
const modePVCButton = document.getElementById('mode-pvc');

const statusArea = document.getElementById('status-area');
const resetButton = document.getElementById('reset-button');
const cells = document.querySelectorAll('.cell');
const popupResult = document.getElementById('popup-result');
const resultMessage = document.getElementById('result-message');
const newGameButton = document.getElementById('new-game-button');

// Variabel Global
let gameActive = true;
let currentPlayer = 'X'; 
let gameState = ["", "", "", "", "", "", "", "", ""]; 
let gameMode = null; // 'PVP' atau 'PVC'

// Kondisi Kemenangan yang Mungkin (TETAP SAMA)
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Pesan Game (TETAP SAMA)
const winningMessage = () => `Player ${currentPlayer} has **won**! 🎉`;
const drawMessage = () => `It's a **draw**! 🤝`;
const currentPlayerTurn = () => {
    if (gameMode === 'PVC' && currentPlayer === 'O') {
        return `**AI** is thinking...`;
    }
    return `It's Player **${currentPlayer}**'s turn.`;
};


// ----------------------------------------------------
// FUNGSI NAVIGASI LAYAR
// ----------------------------------------------------
function showScreen(screenToShow) {
    // Sembunyikan semua layar
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hide');
        screen.classList.remove('active');
    });
    // Tampilkan layar yang diminta
    screenToShow.classList.remove('hide');
    screenToShow.classList.add('active');
}

// ----------------------------------------------------
// FUNGSI GAME LOGIC
// ----------------------------------------------------

// 1. Fungsi Inisialisasi
function startGame() {
    statusArea.innerHTML = currentPlayerTurn();
    popupResult.classList.add('hide'); 
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('X', 'O', 'winning', 'disabled');
        cell.addEventListener('click', handleCellClick, { once: true });
    });

    statusArea.style.transform = 'scale(1)'; 
    
    // Jika Mode AI dan giliran O, biarkan AI bergerak
    if (gameMode === 'PVC' && currentPlayer === 'O') {
        setTimeout(handleAIMove, 500);
    }
}

// 2. Fungsi Menangani Klik Sel (TETAP SAMA)
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // Pencegahan jika mode AI dan giliran AI
    if (gameState[clickedCellIndex] !== "" || !gameActive || (gameMode === 'PVC' && currentPlayer === 'O')) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

// 3. Fungsi AI Move (Sederhana)
function handleAIMove() {
    // Dapatkan semua sel kosong
    const availableIndices = gameState
        .map((val, index) => val === "" ? index : null)
        .filter(val => val !== null);
    
    if (availableIndices.length > 0 && gameActive) {
        // Pilih sel kosong secara acak
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const aiCell = cells[randomIndex];

        handleCellPlayed(aiCell, randomIndex);
        handleResultValidation();
    }
}


// 4. Fungsi Menambahkan Simbol ke Sel (TETAP SAMA)
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer);
    clickedCell.classList.add('disabled'); 
}

// 5. Fungsi Cek Hasil Game (Ditambahkan AI logic)
function handleResultValidation() {
    // ... (Logika Cek Pemenang dan Seri TETAP SAMA) ...

    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === b && b === c && a !== '') {
            roundWon = true;
            winCondition.forEach(index => {
                cells[index].classList.add('winning');
            });
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        showResult(winningMessage());
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        gameActive = false;
        showResult(drawMessage());
        return;
    }

    // Jika belum ada pemenang, ganti pemain
    handlePlayerChange();

    // Logika Tambahan untuk AI
    if (gameMode === 'PVC' && currentPlayer === 'O' && gameActive) {
        setTimeout(handleAIMove, 500); // Tunda gerakan AI selama 500ms
    }
}

// 6. Fungsi Ganti Pemain (TETAP SAMA)
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusArea.innerHTML = currentPlayerTurn();
    statusArea.style.transform = 'scale(1.1)'; 
    setTimeout(() => {
        statusArea.style.transform = 'scale(1)';
    }, 300);
}

// 7. Fungsi Menampilkan Popup Hasil (TETAP SAMA)
function showResult(message) {
    resultMessage.innerHTML = message;
    popupResult.classList.remove('hide');
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
}


// ----------------------------------------------------
// EVENT LISTENERS BARU
// ----------------------------------------------------

// Tombol Mulai Permainan
startButton.addEventListener('click', () => {
    showScreen(modeSelector);
});

// Pilih Mode Player vs Player
modePVPButton.addEventListener('click', () => {
    gameMode = 'PVP';
    showScreen(gameBoardScreen);
    startGame();
});

// Pilih Mode Player vs AI
modePVCButton.addEventListener('click', () => {
    gameMode = 'PVC';
    showScreen(gameBoardScreen);
    startGame();
});


// Tombol Reset Game dan New Game
resetButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', () => {
    showScreen(modeSelector); // Kembali ke pemilihan mode
});


// Mulai dengan Splash Screen saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    showScreen(splashScreen);
});