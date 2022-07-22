const myform = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasksArray = [];
checkEmptyArrayList();

if (localStorage.getItem("tasks")) {
  tasksArray = JSON.parse(localStorage.getItem("tasks"));
}

tasksArray.forEach(function (task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  const taskHtml = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18" />
      </button>
      <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18" />
      </button>
    </div>
  </li>`;

  tasksList.insertAdjacentHTML("beforeend", taskHtml);

  checkEmptyArrayList();
  saveToLocalStor();
});

//adding task
myform.addEventListener("submit", function (event) {
  event.preventDefault();

  // get text from the input field
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasksArray.push(newTask);

  const cssClass = newTask.done ? "task-title task-title--done" : "task-title";

  const taskHtml = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${newTask.text}</span>
    <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18" />
      </button>
      <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18" />
      </button>
    </div>
  </li>`;

  tasksList.insertAdjacentHTML("beforeend", taskHtml);

  //clearing input field; focusing on it
  taskInput.value = "";
  taskInput.focus();
  checkEmptyArrayList();
  saveToLocalStor();
});

//removing task

function removeTask(event) {
  if (event.target.dataset.action !== "delete") return;
  const taskNode = event.target.closest(".list-group-item");

  const nodeId = taskNode.id;

  const index = tasksArray.findIndex((task) => task.id == nodeId.id);

  tasksArray.splice(index, 1);

  taskNode.remove();

  checkEmptyArrayList();
  saveToLocalStor();
}
tasksList.addEventListener("click", removeTask);

//task is done
tasksList.addEventListener("click", doneTask);

function doneTask(event) {
  if (event.target.dataset.action !== "done") return;

  const parentNode = event.target.closest(".list-group-item");

  const id = parentNode.id;
  const task = tasksArray.find(function (task) {
    if (task.id == id) {
      return true;
    }
  });
  task.done = !task.done;

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
  checkEmptyArrayList();
  saveToLocalStor();
}

function checkEmptyArrayList() {
  if (tasksArray.length === 0) {
    const empListEl = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/notes.png" alt="Empty" width="48" class="mt-3" />
        <div class="empty-list__title">Task List is Empty</div>
      </li>`;
    tasksList.insertAdjacentHTML("afterbegin", empListEl);
  }

  if (tasksArray.length > 0) {
    const emptyListElement = document.querySelector("#emptyList");
    emptyListElement ? emptyListElement.remove() : null;
  }
}

function saveToLocalStor() {
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}
