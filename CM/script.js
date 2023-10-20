/* -----------------------
FASE DI PREPARAZIONE
------------------------ */

// Recuperare dalla pagina tutti gli elementi di interesse
const scoreCounter = document.querySelector('.score-counter');
const grid = document.querySelector('.grid');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again')

// Preparo delle informazioni utili alla logica di gioco
const totalCells = 100;
const totalBombs = 16;
const treasure = 1;
const maxScore = totalCells - totalBombs;
const bombsList = [];
let treasureCell = 0;
let score = 0;

// Generare TOT bombe casuali
while (bombsList.length < totalBombs) {
    const number = Math.floor(Math.random() * totalCells) + 1;
    if (!bombsList.includes(number)) bombsList.push(number);
}

// Prendere una bomba a caso e generare il tesoro
treasureCell = getRandomCell(bombsList);

console.log(bombsList);
console.log("il tesoro si trova nella cella ", treasureCell);

/* -----------------------
GRIGLIA E LOGICA DI GIOCO
-----------------------*/
let isCellEven = false;
let isRowEven = false;

for (let i = 1; i <= totalCells; i++) {
    // Creo un elemento e gli do la classe 'cell'
    const cell = document.createElement('div');
    cell.classList.add('cell');

    isCellEven = i % 2 === 0;

    // Se la riga è pari e la cella è pari: casella grigia
    // Se la riga è dispari e la cella è dispari: casella grigia
    if (isRowEven && isCellEven) cell.classList.add('cell-dark');
    else if (!isRowEven && !isCellEven) cell.classList.add('cell-dark');

    // Se sono alla fine della riga...
    if (i % 10 === 0) isRowEven = !isRowEven;

    // # Gestiamo il click della cella
    cell.addEventListener('click', function () {
        // ! Controllo che la cella non sia stata già cliccata
        if (cell.classList.contains('cell-clicked')) return;

        // Se è il tesoro...
        if (treasureCell === i) {
            cell.classList.add('cell-treasure');
            treasureFound();
            // Se è una bomba....
        } else if (bombsList.includes(i)) {
            cell.classList.add('cell-bomb');
            endGame(false);

            // Se non lo è...
        } else {
            cell.classList.add('cell-clicked');
            updateScore();
        }
    });

    // Lo inserisco nella griglia
    grid.appendChild(cell);
}


/* -------------------
FUNZIONI
-------------------*/

// Funzione per generare casualmente una cella tesoro tra le bombe
function getRandomCell(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Funzione per aggiornare il punteggio
function updateScore() {
    // Incremento lo score
    score++;
    // Lo inserisco nel contatore
    scoreCounter.innerText = String(score).padStart(5, 0);

    // Controlliamo se l'utente ha vinto
    if (score === maxScore) endGame(true);
}

// Funzione per decretare la fine del gioco
function endGame(isVictory) {
    if (isVictory === true) {
        // Coloriamo di verde e cambiamo il messaggio
        endGameScreen.classList.add('win');
        endGameText.innerHTML = 'YOU<br>WIN';
    } else {
        // Riveliamo tutte le bombe e il tesoro
        revealAllBombs();
        revealTreasure();
    }

    // Mostriamo la schermata rimuovendo la classe
    endGameScreen.classList.remove('hidden');
}
//Funzione per la vittoria bonus (tesoro)
function treasureFound() {
    endGameScreen.classList.add('win-treasure');
    endGameText.innerHTML = 'TREASURE<br>FOUND!';
    scoreCounter.innerText = String(maxScore).padStart(5, 0);
    revealAllBombs();
    revealTreasure();
    endGameScreen.classList.remove('hidden');
}

// Funzione per ricaricare la pagina
function playAgain() {
    location.reload();
}


// # BONUS
// Funzione che rivela tutte le bombe
function revealAllBombs() {
    // Recupero tutte le celle
    const cells = document.querySelectorAll('.cell');
    for (let i = 1; i <= cells.length; i++) {
        // controllo se la cella è una bomba
        if (bombsList.includes(i)) {
            const cellToReveal = cells[i - 1];
            cellToReveal.classList.add('cell-bomb');
        }
    }
}

// Funzione che rivela il tesoro
function revealTreasure() {
    // Recupero tutte le celle
    const cells = document.querySelectorAll('.cell');
    for (let i = 1; i <= cells.length; i++) {
        // controllo se la cella è una bomba
        if (treasureCell === i) {
            const cellToReveal = cells[i - 1];
            cellToReveal.classList.add('cell-treasure');
        }
    }
}

/* ---------------------
EVENTI
-----------------------*/

playAgainButton.addEventListener('click', playAgain);