const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const togglemodalButton = document.querySelector("#toggle-modal");
const modal = document.querySelector(".add-new-task");
const taskTitle = document.querySelector("#task-title");
const taskDescrp = document.querySelector("#taskdescprition");
const addNewTaskBtn = document.querySelector("#add-new-task");
const bg = document.querySelector(".bg");
const currentdate = document.querySelector(".middle");

let dragElement = null;
let taskTitleInputValue = "";
let taskDescrpInputValue = "";


const d = new Date();
const day = String(d.getDate()).padStart(2, "0");
const month = d.toLocaleString("en-US", { month: "long" });
const year = d.getFullYear();
currentdate.innerText = `${day}-${month}-${year}`;

// ====================================
// SAVE TASKS
// ====================================
function saveTasks() {
  const todoTasks = [];
  const progressTasks = [];
  const doneTasks = [];

  document.querySelectorAll("#todo .task").forEach(task => {
    todoTasks.push({
      title: task.querySelector("h2").textContent,
      desc: task.querySelector("p").textContent
    });
  });

  document.querySelectorAll("#progress .task").forEach(task => {
    progressTasks.push({
      title: task.querySelector("h2").textContent,
      desc: task.querySelector("p").textContent
    });
  });

  document.querySelectorAll("#done .task").forEach(task => {
    doneTasks.push({
      title: task.querySelector("h2").textContent,
      desc: task.querySelector("p").textContent
    });
  });

  localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
  localStorage.setItem("progressTasks", JSON.stringify(progressTasks));
  localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
}

// ====================================
// Update Counts
// ====================================
function updatecounts() {
  document.querySelector("#todo .count").textContent =
    document.querySelectorAll("#todo .task").length;

  document.querySelector("#progress .count").textContent =
    document.querySelectorAll("#progress .task").length;

  document.querySelector("#done .count").textContent =
    document.querySelectorAll("#done .task").length;
}

// ====================================
// DELETE HANDLER
// ====================================
function attachDeleteEvent(task) {
  task.querySelector(".deleteBtn").addEventListener("click", () => {
    task.remove();
    updatecounts();
    saveTasks();
  });
}

// ====================================
// DRAG + DROP with Animation
// ====================================
function addDragEvents(column) {
  column.addEventListener("dragenter", e => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", e => {
    e.preventDefault();
  });

  column.addEventListener("drop", () => {
    if (dragElement) column.append(dragElement);
    column.classList.remove("hover-over");
    dragElement.classList.remove("dragging");
    updatecounts();
    saveTasks();
  });
}

// ====================================
// Create Task Element
// ====================================
function createTaskElement(taskData) {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;

  task.innerHTML = `
    <h2>${taskData.title}</h2>
    <p>${taskData.desc}</p>
    <button class="deleteBtn">Delete</button>
  `;

  task.addEventListener("dragstart", () => {
    dragElement = task;
    task.classList.add("dragging"); // animation class
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
    dragElement = null;
  });

  attachDeleteEvent(task);
  return task;
}

// ====================================
// Load Tasks
// ====================================
function loadTasks() {
  const todoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  const progressTasks = JSON.parse(localStorage.getItem("progressTasks")) || [];
  const doneTasks = JSON.parse(localStorage.getItem("doneTasks")) || [];

  todoTasks.forEach(t => todo.appendChild(createTaskElement(t)));
  progressTasks.forEach(t => progress.appendChild(createTaskElement(t)));
  doneTasks.forEach(t => done.appendChild(createTaskElement(t)));
}

// ====================================
// Input Handling
// ====================================
taskTitle.addEventListener("input", () => {
  taskTitleInputValue = taskTitle.value;
});

taskDescrp.addEventListener("input", () => {
  taskDescrpInputValue = taskDescrp.value;
});

// ====================================
// Modal Open
// ====================================
togglemodalButton.addEventListener("click", () => {
  modal.style.display = "flex";
  taskTitle.value = "";
  taskDescrp.value = "";
  taskTitleInputValue = "";
  taskDescrpInputValue = "";
});

// Close modal when clicking background
bg.addEventListener("click", () => {
  modal.style.display = "none";
});

// ====================================
// Add New Task
// ====================================
addNewTaskBtn.addEventListener("click", () => {
  modal.style.display = "none";

  const task = createTaskElement({
    title: taskTitleInputValue,
    desc: taskDescrpInputValue
  });

  todo.appendChild(task);
  updatecounts();
  saveTasks();
});

// ====================================
// Add Drag events to columns
// ====================================
addDragEvents(todo);
addDragEvents(progress);
addDragEvents(done);

// ====================================
// DARK / LIGHT THEME SWITCHER
// ====================================
const themeBtn = document.querySelector("#themeBtn");

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    document.body.classList.add("light");
  }
}


// Load Tasks + counts
loadTasks();
updatecounts();
