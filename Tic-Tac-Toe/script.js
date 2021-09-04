//DECLARATIONS
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById(`board`)
const winningMessageElement =document.getElementById(`winningMessage`)
const winningMessageTextElement = document.querySelector(`[data-winning-message-text]`)
const restartButton = document.getElementById(`restartButton`)
const undoButton = document.getElementById(`undo`);
const redoButton = document.getElementById(`redo`);
const OTurn = document.getElementById(`OTurn`);
const XTurn = document.getElementById(`XTurn`);
const newGameModal = document.getElementById(`newGame`);
const Xpoints = document.getElementById(`Xpoints`);
const Opoints = document.getElementById(`Opoints`);
const localRestart = document.getElementById(`localRestart`);
const exitModal = document.getElementById(`exitModal`);
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

let Xp = 0;
let Op = 0;
let movesHistory = []
let movesHistory2 = []
// let circleTurn

redoButton.addEventListener(`click`, function(){
    redoMoves();
})

undoButton.addEventListener(`click`, function(){
    undoMoves()
})
//FUNCTIONS
function initializeGame(){
    newGameModal.style.display=`block`;
    OTurn.addEventListener(`click`, function(){
        circleTurn = true;
        startGame();
    })
    XTurn.addEventListener(`click`, function(){
        circleTurn = false;
        startGame();
    })
    exitModal.addEventListener(`click`, function(){
        newGameModal.style.display=`none`
    });
    winningMessageElement.classList.remove(`show`)
}


function startGame(){
    newGameModal.style.display=`none`
    cellElements.forEach(cell =>{
        cell.classList.remove(x_class);
        cell.classList.remove(circle_class);
        cell.removeEventListener(`click`, handleClick);
        cell.addEventListener('click', handleClick, {
            once:true
        })
    })
    movesHistory = [];
    movesHistory2 = [];
    setBoardHoverClass();
}

function handleClick(e){
    const cell = e.target
    const currentClass = circleTurn ? circle_class : x_class
    placeMark(cell, currentClass)
    if (checkWin(currentClass)){
        endGame(false)
    } else if (isDraw()){
        endGame(true)
    } else {
    swapTurns()
    setBoardHoverClass()
}
}
function renderScore(){
    Xpoints.innerText = Xp;
    Opoints.innerText = Op;
}

function endGame(draw){
    if (draw){
        winningMessageTextElement.innerText = `Draw!`
    } else {
        if(circleTurn){
            Op += 1;
            renderScore();
        } else {
            Xp += 1;
            renderScore();
        }
    }
    winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Wins!`
    winningMessageElement.classList.add(`show`)
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass);
    checkId(cell, currentClass);
    if(movesHistory2.length > 0){
        movesHistory2 = [];
        redoButton.style.display = 'none';
    } else {return};
};

function checkId(cell, currentClass){
    const id = cell.id;
    let stringID = id.toString()
    movesHistory.push(`${stringID},${currentClass}`);
    // console.log(mainArray, subArray, internalBoard, movesHistory);
}

function undoMoves(){
    if(movesHistory.length > 0){
    let previousMove = movesHistory.pop();
    movesHistory2.push(previousMove);
    let cellID = previousMove.slice(0,2)
    let PMClass = previousMove.slice(3)
    if (PMClass == "x"){
        document.getElementById(`${cellID}`).classList.remove(x_class);
    } else {
        document.getElementById(`${cellID}`).classList.remove(circle_class)
    }
    document.getElementById(`${cellID}`).addEventListener('click', handleClick, {
        once:true
    })
    redoButton.style.display = 'block';
    swapTurns();
    setBoardHoverClass();}
    else {
        return;
    }
}

function redoMoves(){
    if (movesHistory2.length > 0){
    previousMove = movesHistory2.pop();
    movesHistory.push(previousMove);
    let cellID = previousMove.slice(0,2)
    let PMClass = previousMove.slice(3)
    if (document.getElementById(`${cellID}`).classList.contains(x_class || circle_class)){movesHistory.pop();
    } else {
        if (PMClass == "x"){
            document.getElementById(`${cellID}`).classList.add(x_class);
        } else {
            document.getElementById(`${cellID}`).classList.add(circle_class)
        }
        document.getElementById(`${cellID}`).addEventListener('click', handleClick, {
            once:false
    })};
    swapTurns();
    setBoardHoverClass();
    } else {
        return;
    }
}

function swapTurns(){
    circleTurn = !circleTurn
}

function setBoardHoverClass(){
    board.classList.remove(x_class)
    board.classList.remove(circle_class)
    if (circleTurn){
        board.classList.add(circle_class)
    } else {
        board.classList.add(x_class)
    }
}

function checkWin(currentClass){
    return winning_combinations.some(combination =>{
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function isDraw(){
    return [...cellElements].every(cell =>{
       return cell.classList.contains(x_class) || cell.classList.contains(circle_class)
    })
}


//ON START

initializeGame();

restartButton.addEventListener(`click`, initializeGame);
localRestart.addEventListener(`click`,function(){
    Xp = 0;
    Op = 0;
    renderScore();
    initializeGame();
});
