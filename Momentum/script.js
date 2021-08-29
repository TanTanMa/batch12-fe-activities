// ------- DECLARATIONS -----------

//  User Name Declarations
const nameForm = document.querySelector(`.name-form`);
const userNameInput = document.getElementById(`userName`);
const nameSubmit = document.getElementById(`nameSubmit`);
const greeting = document.querySelector(`.greeting`);
const userName = document.getElementById(`name`);
const noName = document.getElementById(`noName`);
const nameQuestion = document.querySelector(`.name-question`);

// User Focus Declarations
const focusForm = document.getElementById(`focusForm`);
const focusQuestion = document.querySelector(`.focus-question`);
const userFocusInput = document.getElementById(`focusInput`);
const focusSubmit = document.getElementById(`focusSubmit`);
const focusWindow = document.querySelector(`.focus-main`);
const userFocus = document.getElementById(`focus`);
const setFocus = document.getElementById(`setFocus`);

// Qoutes Declarations
const setQoute = document.getElementById(`qoute`);
const createQoute = document.getElementById(`qoute-make`);
const createSetQoute = document.getElementById(`qoute-set`);
const generateQoute = document.getElementById(`qoute-generate`);
const qouteContainer = document.getElementById(`qoute-container`);
const qouteOptions = document.querySelector(`.quote-option-container`);

// Time and Date Declarations
const time = document.getElementById("time");
const date = document.getElementById("date");

// To Do list Declarations
const listsContainer = document.querySelector(`[data-lists]`);
const newListForm = document.querySelector(`[data-new-list-form]`);
const newListInput = document.querySelector(`[data-new-list-input]`);
const deleteListButton = document.querySelector(`[data-delete-list-button]`);
const listDisplayContainer = document.querySelector(`[data-list-display-container]`);
const listTitleElement = document.querySelector(`[data-list-title]`);
const listCountElement = document.querySelector(`[data-list-count]`);
const tasksContainer = document.querySelector(`[data-tasks]`);
const taskTemplate = document.getElementById(`task-template`);
const newTaskForm = document.querySelector(`[data-new-task-form]`);
const newTaskInput = document.querySelector(`[data-new-task-input]`);
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]');
const exitList = document.getElementById(`exit-button`);
const ToDoWindow = document.getElementById(`ToDoWindow`);
const enterList = document.getElementById(`toDoToggle`);

// Local Storage Declarations
const LOCAL_STORAGE_LIST_KEY = `task.lists`;
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = `task.selectedListId`;
let userData = {
    name: "",
    focus: ""
};
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);


// ------------ FUNCTIONS ------------


//SAVE AND LOAD FUNCTIONS
// save current datas on local storage; ToDo ELements; current selected major; user focus and name
function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
    localStorage.setItem("currentData", JSON.stringify(userData));
};

// load user data **ISSUES**
function load(){
    let oldData = localStorage.getItem("currentData");
    if(!oldData) {
        saveState()
        location.reload()
      };
    userData = JSON.parse(oldData);
};

//USER'S INFORMATIONS FUNCTIONS
// getName - get the user input, show greeting, hide user forms, show focus form
function getName(){
    let nameValue = userNameInput.value;
    if (nameValue == undefined || nameValue == null || nameValue == ""){
        nameQuestion.innerText = `Don't be shy, type it. Type it out loud..`;
    } else {
        userName.innerHTML = nameValue;
        userData.name = nameValue;
        nameForm.style.display = `none`;
        greeting.style.display = `block`;
        focusForm.style.display = `flex`;
        save();
        console.log(userData.name);
    }
};

//getFocus - get user focus input, hide forms, show focus and qoutes
function getFocus(){
    let focusValue = userFocusInput.value;
    if (focusValue == undefined || focusValue == null || focusValue == ""){
        focusQuestion.innerText = `Why are we even here?`
    } else {
        userFocus.innerHTML = focusValue;
        userData.focus = focusValue;
        focusForm.style.display = `none`;
        focusWindow.style.display = `flex`;
        getQoute();
        save();
        console.log(userData.focus);
    }
}

//QOUTES FUNCTION
// get and render random Qoutes
function getQoute(){
    fetch("https://complimentr.com/api")
    .then(res =>{
        return res.json()
    })
    .then(data => setQoute.innerHTML = data.compliment);
    qouteContainer.style.display = `flex`
}

//DATE AND TIME FUNCTION
// fetch and render current date and time
function updateTimeDate(){
    let upDate = new Date();
    let hours = upDate.getHours();
    let minutes= upDate.getMinutes();
    time.innerHTML = `${hours}:${minutes}`;
    date.innerHTML = upDate.toDateString();
}

//TODO LIST FUNCTIONS
// create json on new task; unique `id is based on current time created.
function createTask(name){
    return {id: Date.now().toString(), name: name, complete: false};
};

// create json for new major; unique `id` is based on current time created.
function createList(name){
   return {id: Date.now().toString(), name: name, tasks:[]};
};

function saveAndRender(){
    save();
    render();
};

// show all elements in ToDoWindow, show task list on click of a major list
//if no major list selected dont show task window
//if major list is selected > set task title to selected major list, show task counter, clear task container 
//renderTask will show saved tasks unique to selected major list
function render(){
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedListId);
    if (selectedListId == null || selectedList == undefined || selectedListId == ''){
        listDisplayContainer.style.display = `none`;
    } else {
        listDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    };
};

// Show each task; get template from HTML, set checkbox and label(HTMLfor) ids similar to task.Id, add, checkedboxes to complete: true, add task to task container
function renderTasks(selectedList){
    selectedList.tasks.forEach(task =>{
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector(`input`);
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector(`label`);
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    });
};

// task counter, plural or singular logic: increment counter +1 on unchecked, -1 on checked
function renderTaskCount(selectedList){
    const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTasksCount == 1 ? "task":"tasks";
    listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaining`;
};

// add created major list, show major list, highlights selected major list
function renderLists(){
    lists.forEach(list => {
        const listElement = document.createElement(`li`);
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        if (list.id === selectedListId) {listElement.classList.add(`active-list`)};
        listsContainer.appendChild(listElement);
    });
};

function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    };
};


//---------- EVENT LISTENERS ----------

//USER NAME LISTENERS
//if user wants to change their name
userName.addEventListener(`dblclick`, ()=>{
    greeting.style.display = `none`;
    nameForm.style.display = `flex`;
    nameQuestion.innerText = `Give name, not trust issues.`;
    focusWindow.style.display = `none`;

});

nameSubmit.addEventListener(`click`, function(e){
    e.preventDefault();
    getName();
});


// USER FOCUS LISTENERS
// if user wants to change their focus.
userFocus.addEventListener(`dblclick`, ()=>{
    userFocus.setAttribute(`contenteditable`, `true`);
    userFocus.focus();
    setFocus.style.display = `block`;
});

// remove the editing capabilities of the FOCUS after user changed it
setFocus.addEventListener(`click`, ()=>{
    userFocus.setAttribute(`contenteditable`, `false`);
    setFocus.style.display = `none`;
});

focusSubmit.addEventListener(`click`, function(e){
    e.preventDefault();
    getFocus();
});


//QOUTES LISTENERS
// generate random qoute on click
generateQoute.addEventListener("click", function(){
    getQoute();
});

// if user wants to make their own qoutes.
createQoute.addEventListener("click", () => {
    setQoute.setAttribute("contenteditable", "true")
    setQoute.focus();
    createQoute.style.display = `none`;
    createSetQoute.style.display = `block`
});

// finalize the qoute, after user editted the qoute
createSetQoute.addEventListener(`click`, ()=>{
    setQoute.setAttribute("contenteditable", "false");
    createQoute.style.display = `block`;
    createSetQoute.style.display =`none`;
})

// show generate qoutes and edit qoutes options
qouteContainer.addEventListener(`click`, function(){
    if (qouteOptions.style.display === `none`){
        qouteOptions.style.display = `flex`;
    } else {
        qouteOptions.style.display = `none`;
    };
});


//DATE AND TIME LISTENERS
//render qoute from time click
time.addEventListener(`click`, function(){
    if (qouteContainer.style.display === `none`){
        qouteContainer.style.display = `flex`
    } else {
        qouteContainer.style.display = `none`
    };
});


//TODO LIST LISTENERS
// hide the Task-ToDo window, show "bucket list" button
exitList.addEventListener(`click`, function(){
    ToDoWindow.style.display = `none`;
    enterList.style.display = `block`;
});

//Open Task-ToDo, Hide "bucket list" button
enterList.addEventListener(`click`, function(){
    ToDoWindow.style.display = `flex`;
    enterList.style.display = `none`;
})

// open Task list, on click of a Major list item
listsContainer.addEventListener(`click`, e =>{
    if (e.target.tagName.toLowerCase()==='li'){
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    };
});

// event: user completed/checked a task, increment the task counter
tasksContainer.addEventListener(`click`, e =>{
    if (e.target.tagName.toLowerCase()===`input`){
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);
    };
});

// event: user want to delete all completed or checked tasks
clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
  });


// event: user wants to delete a Major list; give all list that are not selected > set the selected list into null
deleteListButton.addEventListener(`click`, e =>{
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
});

// event: user creates a new major list; check if user passed a value, create major list
newListForm.addEventListener('submit', e =>{
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName ==="" || listName == undefined) return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

// event: user creates a task list, new task is under a specified/targeted/selected major list
newTaskForm.addEventListener('submit', e =>{
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (taskName == null || taskName == "" || taskName == undefined) {return};
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
});




//----------- RENDERS ON START ----------
nameForm.style.display = `flex`;
updateTimeDate();
setInterval(updateTimeDate, 1000);
render();















































