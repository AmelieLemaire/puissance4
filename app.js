const xSelect = document.getElementById('x-select');
const ySelect = document.getElementById('y-select');
const color1Select = document.getElementById('color1-select');
const color2Select = document.getElementById('color2-select');
const gridContainer = document.getElementById('grid-container');
let currentPlayer = 1;
let gameBoard = [];

function initializeBoard() {
    const xSize = parseInt(xSelect.value);
    const ySize = parseInt(ySelect.value);
    gameBoard = [];
    for (let i = 0; i < ySize; i++) {
        gameBoard.push(new Array(xSize).fill(0));
        // Initialise un tableau vide de la taille sélectionnée plus tôt
    }
}

function generateGrid() {
    initializeBoard();

    let gridHTML = '<table>';
    const xSize = parseInt(xSelect.value);
    const ySize = parseInt(ySelect.value);
    for (let i = 0; i < ySize; i++) {
        gridHTML += '<tr>';
        for (let j = 0; j < xSize; j++) {
            gridHTML += `<td class='cell' data-x='${j}' data-y='${i}'></td>`;
            // Chaque cellule se voit attribuer une classe 'cell' et des attributs data-x et data-y contenant les coordonnées x et y de la cellule dans la grille
        }
        gridHTML += '</tr>';
    }
    gridHTML += '</table>';
    gridContainer.innerHTML = gridHTML;

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            // Récupère les attributs x et y avant d'appeler la fonction dropToken avec la coordonnée x
            dropToken(x);
        });
    });
}

function dropToken(x) {
    let y = gameBoard.length - 1;
    while (y >= 0 && gameBoard[y][x] !== 0) {
        y--;
        // Parcours chaque ligne de la colonne jusqu'à en trouver une vide
    }
    if (y >= 0) {
        gameBoard[y][x] = currentPlayer;
        renderBoard();
        if (checkWin(y, x)) {
            alert(`Joueur ${currentPlayer} a gagné !`);
            initializeBoard();
            renderBoard();
        } else {
            // Vérification pour un match nul
            if (checkDraw()) {
                alert("Match nul !");
                initializeBoard();
                renderBoard();
            } else {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
            }
        }
    }
}

function checkWin(y, x) {
    const xSize = gameBoard[0].length;
    const ySize = gameBoard.length;

    // Check horizontal
    // Parcours le tableau de gauche à droite et compte le nombre de jetons alignés et retourne true si il y en a 4
    let count = 1;
    for (let i = x - 1; i >= 0 && gameBoard[y][i] === currentPlayer; i--) {
        count++;
    }
    for (let i = x + 1; i < xSize && gameBoard[y][i] === currentPlayer; i++) {
        count++;
    }
    if (count >= 4) return true;

    // Check vertical
    // Parcours la colonne au-dessus et au-dessous du jeton sélectionné et vérifie s'il y en a 4 alignés
    count = 1;
    for (let i = y - 1; i >= 0 && gameBoard[i][x] === currentPlayer; i--) {
        count++;
    }
    for (let i = y + 1; i < ySize && gameBoard[i][x] === currentPlayer; i++) {
        count++;
    }
    if (count >= 4) return true;

    // Check diagonal
    // Parcours de haut en bas et de gauche à droite
    count = 1;
    for (let i = 1; i < 4; i++) {
        if (x + i < xSize && y + i < ySize && gameBoard[y + i][x + i] === currentPlayer) count++;
        else break;
    }
    // Parcours de bas en haut et de droite à gauche
    for (let i = 1; i < 4; i++) {
        if (x - i >= 0 && y - i >= 0 && gameBoard[y - i][x - i] === currentPlayer) count++;
        else break;
    }
    if (count >= 4) return true;

    // Check anti-diagonal
    // Parcours de bas en haut et de gauche à droite
    count = 1;
    for (let i = 1; i < 4; i++) {
        if (x + i < xSize && y - i >= 0 && gameBoard[y - i][x + i] === currentPlayer) count++;
        else break;
    }
    // Parcours de haut en bas et de droite à gauche
    for (let i = 1; i < 4; i++) {
        if (x - i >= 0 && y + i < ySize && gameBoard[y + i][x - i] === currentPlayer) count++;
        else break;
    }
    if (count >= 4) return true;

    return false;
}

function checkDraw() {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            if (gameBoard[i][j] === 0) {
                // S'il y a une cellule vide, le jeu n'est pas un match nul
                return false;
            }
        }
    }
    // Si aucune cellule vide n'est trouvée, c'est un match nul
    return true;
}

function renderBoard() {
    // Colorisation des cellules pour en faire des jetons
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        if (gameBoard[y][x] === 0) {
            cell.style.backgroundColor = 'lightblue';
        } else if (gameBoard[y][x] === 1) {
            cell.style.backgroundColor = color1Select.value;
        } else {
            cell.style.backgroundColor = color2Select.value;
        }
    });
}

xSelect.addEventListener('change', generateGrid);
ySelect.addEventListener('change', generateGrid);
color1Select.addEventListener('change', () => {
    const selectedColor = color1Select.value;
    color2Select.querySelectorAll('option').forEach(option => {
        if (option.value === selectedColor) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });
    if (color2Select.value === selectedColor) {
        color2Select.value = color2Select.querySelector('option:not(:disabled)').value;
    }
    renderBoard();
});
color2Select.addEventListener('change', () => {
    const selectedColor = color2Select.value;
    color1Select.querySelectorAll('option').forEach(option => {
        if (option.value === selectedColor) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });
    if (color1Select.value === selectedColor) {
        color1Select.value = color1Select.querySelector('option:not(:disabled)').value;
    }
    renderBoard();
});

generateGrid();