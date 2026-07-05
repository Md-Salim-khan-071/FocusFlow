let tasks = [];

const taskInput = document.getElementById("input_area");
const addButton = document.getElementById("add_button");
const taskCategory = document.getElementById("task_category");
let taskList = document.querySelector(".active_tasks");   // querySelector uses css selectors hence . and # should be used for classes and ids
let completedTaskList = document.querySelector(".completed_tasks");
let completedSection = document.querySelector(".completed");
// console.log(taskList);

function addTask() {

    const title = taskInput.value;
    const category = taskCategory.value;

    // console.log(title);
    // console.log(category);

    const task = {
    id: Date.now(),
    title: title,
    category: category,
    completed: false,   // initially task is incomplete
    createdAt: new Date()  // stores date when task was  created 
    };

    tasks.push(task)  // pushes the object into the array 
    // console.log(tasks);
    renderTasks();  // bcoz the below function should run after we add the tasks
    taskInput.value = ""; //removes the text typed inside the input field after adding 
}
addButton.addEventListener("click", addTask);

function renderTasks(){
    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";
    for (const task of tasks){
        const taskElement = createTaskCard(task);
        
        const taskLeft = document.createElement("div");   // creates the the container for the left section which has checkbox and task title  
        taskLeft.classList.add("left_section_of_taskbox");

        const checkbox = document.createElement("input");  // creates the checkbox at the start of the task 
        checkbox.type = "checkbox";     
        checkbox.classList.add("task_checkbox");   
        
        checkbox.checked = task.completed   // task is the object where completed : false . when the checkbox is not checked it stays false . if initially in the object if completed : true the checkbox appears ticked from the start 
        checkbox.addEventListener("click", () => {
            task.completed = checkbox.checked;
            renderTasks()   // calling the function after checkbox , so that striking out and everything happens 
        }); //this listens to the chechboxs check . why not click ? bcoz checkboz goes checked -> unchecked -> checked hence it is change .


        
        const taskTitle = document.createElement("span");  // creates the actuall title of the task 
        taskTitle.textContent = task.title;
        taskTitle.classList.add("task_title");
        
        if (task.completed) {
            taskTitle.classList.add("completed-task");
        }     // this just strikes out the completed tasks

        taskLeft.appendChild(checkbox);
        taskLeft.appendChild(taskTitle);

        taskElement.appendChild(taskLeft);



        const task_actions = document.createElement("div")
        task_actions.classList.add("task-actions");
        
        const edit_button = document.createElement("button")
        edit_button.classList.add("edit-task");
        edit_button.classList.add("common_for_edit-and-delete");
        edit_button.textContent="🖋️"
        edit_button.addEventListener("click", () => {
            editTask(task.id);  // editTask is the function created . and task.id is sent as a parameter .
        });   // gets the id of the task , when edit is clicked .


        const delete_button = document.createElement("button")
        delete_button.classList.add("delete-task");
        delete_button.classList.add("common_for_edit-and-delete");
        delete_button.textContent="🗑️"

        task_actions.appendChild(edit_button);
        task_actions.appendChild(delete_button);       // adding buttons to action container
        
        taskElement.appendChild(task_actions);

        // for deleting the tasks 

        delete_button.dataset.id = task.id;
        delete_button.addEventListener("click", () => {
            deleteTask(task.id);
        });
        if (task.completed) {
            completedTaskList.appendChild(taskElement);
        }
        else {
            taskList.appendChild(taskElement);
        }   // if the checkbox is checked it creates completed tasklist and if not then just task list 
    }
    if (completedTaskList.children.length === 0) {
    completedSection.style.display = "none";
    }
    else {
        completedSection.style.display = "block";
    }
}

function createTaskCard(){
    const taskElement = document.createElement("div");   // creates the main div that  contains all the things of one task  
    taskElement.classList.add("task_box");   // add a classs to created div
    return taskElement;

    
    
}

function deleteTask(id) {
    tasks = tasks.filter(task=>task.id !== id);  // Keep every task whose ID is not equal to the ID we want to delete.  filter creates a new array that specifies the condition
    renderTasks();
}  // this function removes the task from the  array and hence it is removed

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newTitle = prompt("Edit Task", task.title);  // prompt is browser default . pops an alert like edit option 
    if (newTitle === null) {
    return;
    }
    if (newTitle.trim() === "") {   // trim removes empty spaces . if user just uses spaces and enters , then it will not be taken
    return;
    }
    task.title = newTitle.trim();
    renderTasks()
}

renderTasks();