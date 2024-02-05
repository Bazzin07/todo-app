const taskinput = document.querySelector("input");
const dateinput = document.querySelector(".schedule-date");
const addtask = document.querySelector(".add-btn")
let  alertmsg = document.querySelector(".alert-message");
const list = document.querySelector(".todos-list-body");
const deletebtn = document.querySelector(".delete");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

window.addEventListener("DOMContentLoaded", () => {
    showtodos();
    if (!todos.length) {
      displayTodos([]);
    }
  });

let RandomID = () => {
    return   (
        Math.random().toString(36).substring(2,15) +  Math.random().toString(36).substring(2,15)
    );
}

let todo = (taskinput,dateinput) => {
    let task = {
        id : RandomID(),
        task : taskinput.value,
        dueDate : dateinput.value,
        completed : false,
        status : "pending",
    };
    todos.push(task);
}
taskinput.addEventListener("keyup", (evt) =>{
    if(evt.key === 13 && taskinput.value.length > 0){
        todo(taskinput,dateinput);
        taskinput.value = ""
        storage();
    }
});

addtask.addEventListener("click",() =>{
    if (taskinput.value === ""){
       alertmessage("Enter the TASK","error")
    }
    else{
        todo(taskinput,dateinput);
        taskinput.value = "";
        dateinput.value = "";
        alertmessage("Task has been added successfully","success")
        storage();
        showtodos();
    }
})

let alertmessage = (message,type) => {
        let alertbox = `<div class="alert alert-${type} shadow-lg mb-5 w-full">
                           <div>
                                <span>
                                      ${message}
                                </span>
                            </div>
                        </div>`;
        alertmsg.innerHTML = alertbox;  
        alertmsg.classList.remove("show","hide");
        alertmsg.classList.add("show")              
        setTimeout (() => {
            alertmsg.classList.remove("show");
            alertmsg.classList.add("hide");
            setTimeout(() => {
                alertmsg.innerHTML = "";
            },500);
        }, 3000);                           
}

let storage = () => {
    localStorage.setItem("todos",JSON.stringify(todos));
}

let showtodos = () => {
    list.innerHTML = "";
    if(todos.length === 0) {
        list.innerHTML =`<tr><td colspan="5" class="text-center">No task found</td></tr>`;
        return;
    }
    todos.forEach((todo) =>{
        list.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.dueDate || "No due date"}</td>
                <td>${todo.status}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="edit('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="complete('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deletetodo('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
    `;
  });
}


let cleartodos = () => {
    if (todos.length > 0) {
        todos = [];
        storage();
        showtodos();
        alertmessage("ALL THE TODOS HAS BEEN CLEARED","success");
    }
    else {
        alertmessage("NO TODOS TO CLEAR","error");
    }
}
deletebtn.addEventListener("click",cleartodos);

let emode = false;


let edit = (id) => {
    let todo = todos.find((todo) => todo.id === id);
    taskinput.value = todo.task;
    todos = todos.filter((todo) => todo.id !== id);
    addtask.innerHTML = "<i class='fa-solid fa-check fa-xl style= color: #000000;'></i>";
    storage();
    emode = true;
    addtask.addEventListener("click",editmode);
}  
   let editmode = () => {
        if(emode){
        alertmessage("Todo updated successfully","success");
        }
        else {
            alertmessage("Task has been added successfully","success");
        }
        addtask.innerHTML = "<i class='fa-solid fa-plus fa-xl' style='color: #000000;'></i>";
        emode = false;

    addtask.removeEventListener("click",editmode);
    }

addtask.addEventListener("click",editmode);

function complete (id) {
   let todo = todos.find((todo) => todo.id === id);
   todo.completed = !todo.completed;
   todo.status = "completed";
   alertmessage("Task Completed","success");
   storage();
   showtodos();
}   


function deletetodo(id) {
   todos = todos.filter((todo) => todo.id !== id );
   storage();
   showtodos();
   alertmessage("Task Deleted Successfully","success");
}


function filterTodos(status) {
    let filteredTodos;
    switch (status) {
      case "all":
        filteredTodos = todos;
        break;
      case "pending":
        filteredTodos = todos.filter((todo) => !todo.completed);
    
        break;
      case "completed":
        filteredTodos = todos.filter((todo) => todo.completed);
        break;
    }
    displayTodos(filteredTodos);

  }

function displayTodos(showtodos) {
    list.innerHTML = "";
    if (showtodos.length === 0) {
      list.innerHTML = `<tr><td colspan="5" class="text-center">No task found</td></tr>`;
      return;
    }
    let content = "";   
     showtodos.forEach((todo) => {
        content += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.dueDate || "No due date"}</td>
                <td>${todo.status}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="edit('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="complete('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deletetodo('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
    `;
  });
    list.innerHTML = content;
}
