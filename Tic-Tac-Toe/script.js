//DECLARATIONS
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById(`board`)
const winningMessageElement =document.getElementById(`winningMessage`)
const winningMessageTextElement = document.querySelector(`[data-winning-message-text]`)
const individualCells = Array.from(cellElements);
const restartButton = document.getElementById(`restartButton`)
const undoButton = document.getElementById(`undo`);


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

let internalBoard=[
    [],
    [],
    [],
];
let movesHistory = []
let movesHistory2 = []
let circleTurn



undoButton.addEventListener(`click`, function(){
    undoMoves()
})
//FUNCTIONS

function startGame(){
    circleTurn = false
    cellElements.forEach(cell =>{
        cell.classList.remove(x_class);
        cell.classList.remove(circle_class);
        cell.removeEventListener(`click`, handleClick);
        cell.addEventListener('click', handleClick, {
            once:true
        })
    })
    movesHistory = [];
    setBoardHoverClass();
    winningMessageElement.classList.remove(`show`);
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


function endGame(draw){
    if (draw){
        winningMessageTextElement.innerText = `Draw!`
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Wins!`
    }
    winningMessageElement.classList.add(`show`)
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass);
    checkId(cell, currentClass);
}

function checkId(cell, currentClass){
    const id = cell.id;
    let stringID = id.toString()
    let mainArray= stringID.charAt(0);
    let subArray = stringID.charAt(1);
    internalBoard[mainArray][subArray] = currentClass;
    movesHistory.push(`${stringID},${currentClass}`);
    console.log(mainArray, subArray, internalBoard, movesHistory);
}

function undoMoves(cell){
    let previousMove = movesHistory.pop();
    movesHistory2.push(previousMove);
    // const id = cell.id;
    // let stringID = id.toString()
    let cellID = previousMove.slice(0,2)
    let PMClass = previousMove.slice(3)
    // let previousMoveNobox = previousMove.slice(3,6)
    let mainArray= cellID.charAt(0);
    let subArray = cellID.charAt(1);
    // console.log(previousMoveNobox);
    // let checkClass = internalBoard[mainArray][subArray];
    console.log(mainArray, subArray);
    if (PMClass == "x"){
        document.getElementById(`${cellID}`).classList.remove(x_class);
    } else {
        document.getElementById(`${cellID}`).classList.remove(circle_class)
    }
    internalBoard[mainArray][subArray] = null;
    document.getElementById(`${cellID}`).addEventListener('click', handleClick, {
        once:true
    })
    console.log(internalBoard, movesHistory2, movesHistory);

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

// console.table(internalBoard);


//ON START
startGame()

restartButton.addEventListener(`click`, startGame);
