const setQoute = document.getElementById(`qoute`);
const createQoute = document.getElementById(`qoute-make`);
const generateQoute = document.getElementById(`qoute-generate`);
const qouteContainer = document.getElementById(`qoute-container`);
const qouteOptions = document.querySelector(`.quote-option-container`);


function getQoute(){
    fetch("https://complimentr.com/api")
    .then(res =>{
        return res.json()
    })
    .then(data => setQoute.innerHTML = data.compliment)
}
getQoute()

generateQoute.addEventListener("click", function(){
    getQoute();
});

createQoute.addEventListener("click", () => {
    setQoute.setAttribute("contenteditable", "true")
    setQoute.focus()
});

qouteContainer.addEventListener(`click`, function(){
    if (qouteOptions.style.display === `none`){
        qouteOptions.style.display = `flex`;
    } else {
        qouteOptions.style.display = `none`;
    };
});













//date and time
const time = document.getElementById("time");
const date = document.getElementById("date");

function updateTimeDate(){
    let upDate = new Date();
    let hours = upDate.getHours();
    let minutes= upDate.getMinutes();
    time.innerHTML = `${hours}:${minutes}`;
    date.innerHTML = upDate.toDateString();
}

updateTimeDate();
setInterval(updateTimeDate, 1000);


//show qoute from time
time.addEventListener(`click`, function(){
    if (qouteContainer.style.display === `none`){
        qouteContainer.style.display = `flex`
    } else {
        qouteContainer.style.display = `none`
    };
});











//Todo-task list logic
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

//todo task storage
const LOCAL_STORAGE_LIST_KEY = `task.lists`;
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = `task.selectedListId`;
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

exitList.addEventListener(`click`, function(){
    ToDoWindow.style.display = `none`;
    enterList.style.display = `block`;
});

enterList.addEventListener(`click`, function(){
    ToDoWindow.style.display = `flex`;
    enterList.style.display = `none`;
})

listsContainer.addEventListener(`click`, e =>{
    if (e.target.tagName.toLowerCase()==='li'){
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    };
});

tasksContainer.addEventListener(`click`, e =>{
    if (e.target.tagName.toLowerCase()===`input`){
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);
    };
});

clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
  });

deleteListButton.addEventListener(`click`, e =>{
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
});

newListForm.addEventListener('submit', e =>{
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName ===" ") return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

newTaskForm.addEventListener('submit', e =>{
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (taskName == null || taskName === ``) return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
});

function createTask(name){
    return {id: Date.now().toString(), name: name, complete: false};
};

function createList(name){
   return {id: Date.now().toString(), name: name, tasks:[]};
};

function saveAndRender(){
    save();
    render();
};

function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
};

function render(){
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedListId);
    if (selectedListId == null || selectedList == undefined){
        listDisplayContainer.style.display = `none`;
    } else {
        listDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    };
};

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

function renderTaskCount(selectedList){
    const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTasksCount == 1 ? "task":"tasks";
    listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaining`;
};

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
render();