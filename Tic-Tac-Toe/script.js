//DECLARATIONS
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById(`board`)
const winningMessageElement =document.getElementById(`winningMessage`)
const winningMessageTextElement = document.querySelector(`[data-winning-message-text]`)
const individualCells = Array.from(cellElements);
const restartButton = document.getElementById(`restartButton`)
const undoButton = document.getElementById(`undo`);
//GridBoard Declarations
// const a1 = document.getElementById(`a1`);
// const a2 = document.getElementById(`a2`);
// const a3 = document.getElementById(`a3`);
// const b1 = document.getElementById(`b1`);
// const b2 = document.getElementById(`b2`);
// const b3 = document.getElementById(`b3`);
// const c1 = document.getElementById(`c1`);
// const c2 = document.getElementById(`c2`);
// const c3 = document.getElementById(`c3`);

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
    [null,null,null],
    [null,null,null],
    [null,null,null],
];

let circleTurn



undoButton.addEventListener(`click`, function(){
    console.log(`undo here`);
})
//FUNCTIONS
function undoMoves(){

}
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
    console.log(mainArray, subArray);
    console.log(internalBoard);
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
