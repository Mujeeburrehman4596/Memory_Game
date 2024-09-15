const cardsArray = [
    { name: 'heart', img: '❤️' },
    { name: 'smile', img: '😊' },
    { name: 'cry', img: '😭' },
    { name: 'love', img: '😍' },
    { name: 'heart', img: '❤️' },
    { name: 'smile', img: '😊' },
    { name: 'cry', img: '😭' },
    { name: 'love', img: '😍' }
];

let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let playerTurn = true;
let playerScore = 0;
let computerScore = 0;

const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const messageDisplay = document.getElementById('message');

// Shuffle cards and initialize the game board
function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

function initializeGame() {
    shuffle(cardsArray);
    gameBoard.innerHTML = '';
    playerScore = 0;
    computerScore = 0;
    updateScores();
    messageDisplay.textContent = '';
    playerTurn = true;

    cardsArray.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;
        cardElement.dataset.index = index;
        cardElement.innerHTML = `<div class="front"></div><div class="back">${card.img}</div>`;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard || !playerTurn) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second click
    secondCard = this;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        if (playerTurn) {
            playerScore++;
        } else {
            computerScore++;
        }
        disableCards();
    } else {
        unflipCards();
    }

    updateScores();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();

    checkEndGame();
    playerTurn = !playerTurn;

    if (!playerTurn) {
        setTimeout(computerMove, 1000); // Delay for computer's move
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();

        playerTurn = !playerTurn;

        if (!playerTurn) {
            setTimeout(computerMove, 1000); // Delay for computer's move
        }
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function updateScores() {
    playerScoreDisplay.textContent = `Player: ${playerScore}`;
    computerScoreDisplay.textContent = `Computer: ${computerScore}`;
}

function checkEndGame() {
    const totalPairs = cardsArray.length / 2;
    if (playerScore + computerScore === totalPairs) {
        lockBoard = true;
        if (playerScore > computerScore) {
            messageDisplay.textContent = 'You Win!';
        } else if (computerScore > playerScore) {
            messageDisplay.textContent = 'Computer Wins!';
        } else {
            messageDisplay.textContent = 'It\'s a Draw!';
        }
    }
}

function computerMove() {
    // Computer flips two random cards
    const unflippedCards = [...document.querySelectorAll('.card:not(.flipped)')];
    if (unflippedCards.length < 2) return;

    const randomCard1 = unflippedCards[Math.floor(Math.random() * unflippedCards.length)];
    randomCard1.classList.add('flipped');
    firstCard = randomCard1;

    setTimeout(() => {
        const remainingUnflippedCards = unflippedCards.filter(card => !card.classList.contains('flipped'));
        const randomCard2 = remainingUnflippedCards[Math.floor(Math.random() * remainingUnflippedCards.length)];
        randomCard2.classList.add('flipped');
        secondCard = randomCard2;

        checkForMatch();
    }, 1000);
}

resetButton.addEventListener('click', initializeGame);

// Start the game
initializeGame();
