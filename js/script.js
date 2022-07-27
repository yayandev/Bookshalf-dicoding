function hideoff () {
  let hide = document.getElementById("hideoff");
  let home = document.getElementById("home");
  
  home.setAttribute("class", "hideoff");
  hide.setAttribute("class", "");
}


function list() {
  let home = document.getElementById("home");
  let list = document.getElementById("mylist");



  list.setAttribute("class", "");
  home.setAttribute("class", "hideoff");
}



const todos = [];
const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addTodo() {
  const textJudul = document.getElementById("Judul").value;
  const textPenulis = document.getElementById("Penulis").value;
  const textTahun = document.getElementById("Tahun").value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, textJudul, textPenulis, textTahun, false);
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert("berhasil");
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, textJudul, textPenulis, textTahun, isCompleted) {
  return {
    id,
    textJudul,
    textPenulis,
    textTahun,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById("list_baru");
  uncompletedTODOList.innerHTML = "";

  const completedTODOList = document.getElementById("list_sudah");
  completedTODOList.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) uncompletedTODOList.append(todoElement);
    else completedTODOList.append(todoElement);
  }
});

function makeTodo(todoObject) {
  const textJudul = document.createElement("h2");
  textJudul.innerText = todoObject.textJudul;

  const textPenulis = document.createElement("p");
  textPenulis.innerText = todoObject.textPenulis;

  const textTahun = document.createElement("p");
  textTahun.innerText = todoObject.textTahun;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textJudul, textPenulis, textTahun);

  const container = document.createElement("div");
  container.classList.add("list");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const hapusuncomplite = document.createElement("button");
    hapusuncomplite.classList.add("trash-button");
    hapusuncomplite.setAttribute("onclick", "hapusuncomplite();");

    container.append(undoButton, hapusuncomplite);
  } else {

    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });

    const hapuscomplite = document.createElement("button");
    hapuscomplite.classList.add("trash-button");

    hapuscomplite.setAttribute("onclick", "hapuscomplite()");


    container.append(checkButton, hapuscomplite);
    
  }
  return container;
}

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function hapuscomplite(todoId) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === 1) return;
  confirm("yakin?");
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function hapusuncomplite(todoId) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === 1) return;
  confirm("yakin?");
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
