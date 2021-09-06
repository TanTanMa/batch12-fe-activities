//DECLARATIONS
const tile = document.querySelectorAll('[tile]');
const board = document.getElementById(`board`)
const winModal =document.getElementById(`winModal`)
const winMessage = document.querySelector(`[winMessage]`)
const restartButton = document.getElementById(`restartButton`)
const undoButton = document.getElementById(`undo`);
const redoButton = document.getElementById(`redo`);
const OTurn = document.getElementById(`OTurn`);
const XTurn = document.getElementById(`XTurn`);
const newGameModal = document.getElementById(`newGame`);
const Xpoints = document.getElementById(`Xpoints`);
const Opoints = document.getElementById(`Opoints`);
const hardRestart = document.getElementById(`hardRestart`);
const exitModal = document.getElementById(`exitModal`);
const modalText = document.getElementById(`modalMessage`);
const x_class = "x"
const circle_class = "circle"
const winning_combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
let hardReset = false;
let Xp = 0;
let Op = 0;
let undoHistory = []
let redoHistory = []
let cellID;
let PMClass;


//FUNCTIONS

//Open new game modal, player chose if X or O;
function initializeGame(){
    gameReset(hardReset);
    newGameModal.style.display=`block`;
    winModal.classList.remove(`show`)
}

//Hide Modal, clears the board, reset all previous history moves
function startGame(){
    newGameModal.style.display=`none`
    tile.forEach(cell =>{
        cell.classList.remove(x_class);
        cell.classList.remove(circle_class);
        cell.removeEventListener(`click`, handleClick);
        cell.addEventListener('click', handleClick, {
            once:true
        })
    })
    undoHistory = [];
    redoHistory = [];
    setBoardHoverClass();
}

//change modal message on continue game and if new game
function gameReset(hardReset){
    if (hardReset){
        modalText.innerText = "New game?";
    } else {
        modalText.innerText = "Select Turn";
    }
};

//check if X or O turn and winning combination, switch turn
function handleClick(e){
    const cell = e.target
    const currentTurn = circleTurn ? circle_class : x_class
    placeMark(cell, currentTurn)
    if (checkWin(currentTurn)){
        endGame(false)
    } else if (isDraw()){
        endGame(true)
    } else {
    switchPlayer()
    }
}

//updates Score board if reset, clears score too
function renderScore(hardReset){
    if (hardReset){
        Xp = 0;
        Op = 0;
    };
    Xpoints.innerText = Xp;
    Opoints.innerText = Op;
}

//Check if draw, else increment point to the winning letter, show win modal
function endGame(draw){
    if (draw){
        winMessage.innerText = `Draw!`
    } else {
        circleTurn ? Op += 1 : Xp += 1;
        winMessage.innerText = `${circleTurn ? "O" : "X"} Wins!`
    }
    renderScore();
    winModal.classList.add(`show`)
}

//places X or O on tile depending on the current player
//if previously undid a move, clears and hide redo to prevent touch move
function placeMark(cell, currentTurn){
    cell.classList.add(currentTurn);
    saveMove(cell, currentTurn);
    if(redoHistory.length > 0){
        redoHistory = [];
        redoButton.style.display = 'none';
    };
};

//Save new moves to undo history
function saveMove(cell, currentTurn){
    let stringID = cell.id.toString()
    undoHistory.push(`${stringID},${currentTurn}`);
    undoButton.style.display = "block";
}

//moves undo to redo history and vice versa
function movingHistory(arr1, arr2){
    let previousMove = arr1.pop();
    arr2.push(previousMove);
    cellID = previousMove.slice(0,2)
    PMClass = previousMove.slice(3)
    return cellID, PMClass;
}

//removes the latest marked tile, show redo button, switch player 
function undoMoves(){
    if(undoHistory.length > 0){
        movingHistory(undoHistory, redoHistory);
        if (PMClass == "x"){
            document.getElementById(`${cellID}`).classList.remove(x_class);
        } else {
            document.getElementById(`${cellID}`).classList.remove(circle_class)
        };
        document.getElementById(`${cellID}`).addEventListener('click', handleClick, {
            once:true
        })
        redoButton.style.display = 'block';
        switchPlayer()
    }else{
        undoButton.style.display = "none"
    };
}

//adds the latest undid tile, switch player
function redoMoves(){
    if (redoHistory.length > 0){
        movingHistory(redoHistory, undoHistory);
        if (PMClass == "x"){
            document.getElementById(`${cellID}`).classList.add(x_class);
        } else {
            document.getElementById(`${cellID}`).classList.add(circle_class)
        }
        document.getElementById(`${cellID}`).addEventListener('click', handleClick, {
            once:false
        });
        switchPlayer()
    }else{
        redoButton.style.display = "none"
    };
}

//switches the currentTurn every turn
//if circleTurn = True, O turns : false = X turn 
function swapTurns(){
    circleTurn = !circleTurn
};

//set the hover tiles depending on the current player
function setBoardHoverClass(){
    board.classList.remove(x_class);
    board.classList.remove(circle_class);
    if (circleTurn){
        board.classList.add(circle_class)
    }else{
        board.classList.add(x_class)
    };
}

//counter check the winning combination arrays with the board arrays, via currentTurn
function checkWin(currentTurn){
    return winning_combinations.some(combination =>{
        return combination.every(index => {
            return tile[index].classList.contains(currentTurn)
        })
    })
}

//check if if all tiles are filled and and no winning combination is found 
function isDraw(){
    return [...tile].every(cell =>{
       return cell.classList.contains(x_class) || cell.classList.contains(circle_class)
    })
}
function renderGame(){
    startGame();
    renderScore(hardReset);
}

function switchPlayer(){
    swapTurns();
    setBoardHoverClass();
}

//ADD EVENTLISTENER

OTurn.addEventListener(`click`, function(){
    circleTurn = true;
    renderGame();
});

XTurn.addEventListener(`click`, function(){
    circleTurn = false;
    renderGame();
});

exitModal.addEventListener(`click`, function(){
    newGameModal.style.display=`none`
});

redoButton.addEventListener(`click`, function(){
    redoMoves();
})

undoButton.addEventListener(`click`, function(){
    undoMoves()
})

restartButton.addEventListener(`click`, function(){
    hardReset = false;
    initializeGame();
});

hardRestart.addEventListener(`click`,function(){
    hardReset = true;
    renderScore();
    initializeGame();
});

//ON START
initializeGame();


