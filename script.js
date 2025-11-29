const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const togglemodalButton = document.querySelector("#toggle-modal");
const modal = document.querySelector(".add-new-task");
const taskTitle = document.querySelector("#task-title");
const taskDescrp = document.querySelector("#taskdescprition");
const addNewTaskBtn = document.querySelector("#add-new-task");
const bg = document.querySelector(".bg");
let dragElement = null;
let taskTitleInputValue = "";
let taskDescrpInputValue = "";

function saveTasks() {
  const todoTasks = [];
  const progressTasks = [];
  const doneTasks = [];
  document.querySelectorAll("#todo .task").forEach(task => {
    todoTasks.push({title: task.querySelector("h2").textContent, desc: task.querySelector("p").textContent});
  });
  document.querySelectorAll("#progress .task").forEach(task => {
    progressTasks.push({title: task.querySelector("h2").textContent, desc: task.querySelector("p").textContent});
  });
  document.querySelectorAll("#done .task").forEach(task => {
    doneTasks.push({title: task.querySelector("h2").textContent, desc: task.querySelector("p").textContent});
  });
  localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
  localStorage.setItem("progressTasks", JSON.stringify(progressTasks));
  localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
}

function updatecounts() {
  document.querySelector("#todo .count").textContent = document.querySelectorAll("#todo .task").length;
  document.querySelector("#progress .count").textContent = document.querySelectorAll("#progress .task").length;
  document.querySelector("#done .count").textContent = document.querySelectorAll("#done .task").length;
}

function attachDeleteEvent(task) {
  task.querySelector(".deleteBtn").addEventListener("click", () => {
    task.remove();
    updatecounts();
    saveTasks();
  });
}

function addDragEvents(column) {
  column.addEventListener("dragenter", e => { e.preventDefault(); column.classList.add("hover-over"); });
  column.addEventListener("dragleave", e => { e.preventDefault(); column.classList.remove("hover-over"); });
  column.addEventListener("dragover", e => { e.preventDefault(); });
  column.addEventListener("drop", e => {
    e.preventDefault();
    if (dragElement) column.append(dragElement);
    column.classList.remove("hover-over");
    updatecounts();
    saveTasks();
  });
}

function createTaskElement(taskData) {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  task.innerHTML = `<h2>${taskData.title}</h2><p>${taskData.desc}</p><button class="deleteBtn">Delete</button>`;
  task.addEventListener("dragstart", () => { dragElement = task; });
  attachDeleteEvent(task);
  return task;
}

function loadTasks() {
  const todoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  const progressTasks = JSON.parse(localStorage.getItem("progressTasks")) || [];
  const doneTasks = JSON.parse(localStorage.getItem("doneTasks")) || [];
  todoTasks.forEach(t => todo.appendChild(createTaskElement(t)));
  progressTasks.forEach(t => progress.appendChild(createTaskElement(t)));
  doneTasks.forEach(t => done.appendChild(createTaskElement(t)));
}

taskTitle.addEventListener("input", () => { taskTitleInputValue = taskTitle.value; });
taskDescrp.addEventListener("input", () => { taskDescrpInputValue = taskDescrp.value; });

togglemodalButton.addEventListener("click", () => { 
  modal.style.display = "flex"; 
  taskTitle.value = ""; taskDescrp.value = ""; taskTitleInputValue = ""; taskDescrpInputValue = "";
});

bg.addEventListener("click", () => { modal.style.display = "none"; });

addNewTaskBtn.addEventListener("click", () => {
  modal.style.display = "none";
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  task.innerHTML = `<h2>${taskTitleInputValue}</h2><p>${taskDescrpInputValue}</p><button class="deleteBtn">Delete</button>`;
  task.addEventListener("dragstart", () => { dragElement = task; });
  attachDeleteEvent(task);
  todo.appendChild(task);
  updatecounts();
  saveTasks();
});

addDragEvents(todo);
addDragEvents(progress);
addDragEvents(done);
loadTasks();
updatecounts();
