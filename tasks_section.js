
let tasks = [];

const taskInput = document.getElementById("input_area");
const addButton = document.getElementById("add_button");
const taskCategory = document.getElementById("task_category");
let taskList = document.querySelector(".active_tasks");   // querySelector uses css selectors hence . and # should be used for classes and ids
let completedTaskList = document.querySelector(".completed_tasks");
let completedSection = document.querySelector(".completed");
const completedHeader = document.getElementById("completed_at_header");


// for the daily , weekly , milestone toggle
let selectedCategory = "Daily";  //  .. this says when page starts it should be on daily 
const dailyButton = document.getElementById("daily_tab");
const weeklyButton = document.getElementById("weekly_tab");
const milestoneButton = document.getElementById("milestones_tab");

dailyButton.addEventListener("click", () => {
    selectedCategory = "Daily";
    renderTasks();
});

weeklyButton.addEventListener("click", () => {
    selectedCategory = "Weekly";
    renderTasks();
});

milestoneButton.addEventListener("click", () => {
    selectedCategory = "Milestones";
    renderTasks();
});

// let subtitleTaskCategory = document.getElementById("subtitle"); 
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
    saveTasks();
    renderTasks();  // bcoz the below function should run after we add the tasks
    
    taskInput.value = ""; //removes the text typed inside the input field after adding 

    updateProgressCard()  // function from progress.js

    syncHeatmapWithTasks() // helper function tfor the heatmap and task integration
}
addButton.addEventListener("click", addTask);

function renderTasks(){
    
    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => task.category === selectedCategory);

    for (const task of filteredTasks){   
        relatedCategorySubtitle()
        lengthOfCategory()
        const taskElement = createTaskCard(task);
        
        const taskLeft = document.createElement("div");   // creates the the container for the left section which has checkbox and task title  
        taskLeft.classList.add("left_section_of_taskbox");

        const checkbox = document.createElement("input");  // creates the checkbox at the start of the task 
        checkbox.type = "checkbox";     
        checkbox.classList.add("task_checkbox");   
        
        checkbox.checked = task.completed   // task is the object where completed : false . when the checkbox is not checked it stays false . if initially in the object if completed : true the checkbox appears ticked from the start 
        checkbox.addEventListener("click", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks()   // calling the function after checkbox , so that striking out and everything happens 
            syncHeatmapWithTasks() // helper function tfor the heatmap and task integration
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

    updateProgress() // update progress function call 
    updateProgressCard()  // function from progress.js
}

function createTaskCard(){
    const taskElement = document.createElement("div");   // creates the main div that  contains all the things of one task  
    taskElement.classList.add("task_box");   // add a classs to created div
    return taskElement;
    updateProgressCard()  // function from progress.js
}

function deleteTask(id) {
    tasks = tasks.filter(task=>task.id !== id);  // Keep every task whose ID is not equal to the ID we want to delete.  filter creates a new array that specifies the condition
    saveTasks();
    renderTasks();
    updateProgressCard()  // function from progress.js
    syncHeatmapWithTasks() // helper function tfor the heatmap and task integration
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
    saveTasks()
    renderTasks()
    updateProgressCard()  // function from progress.js
}

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
    updateProgressCard()  // function from progress.js
} // we should save the data after each modification like add , edit , delete . so we will call this function after each modification function

function loadTasks(){
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    updateProgressCard()  // function from progress.js
    syncHeatmapWithTasks() // helper function tfor the heatmap and task integration .
}

function updateProgress(){
    const totalTasks = tasks.length;
    
    const completedTasks = tasks.filter(task => task.completed).length

    completedHeader.textContent = `${completedTasks}/${totalTasks} Tasks Completed`;  // we already took it D.get.elembyid at th start .

} // call this renderTasks function because all other functions call renderTasks so automatically this function will be called everytime 

function relatedCategorySubtitle(){
    if (selectedCategory == "Daily"){
        document.getElementById("subtitle").textContent="𖣠 Small Actions For Today";
    }
    else if (selectedCategory == "Weekly"){
        document.getElementById("subtitle").textContent="𖣠 Steps toward bigger goals this week";
    }
    else if (selectedCategory == "Milestones"){
        document.getElementById("subtitle").textContent="𖣠 Big milestones to work toward";
    }
}
function lengthOfCategory(){
    const dailyCount = tasks.filter(task => task.category === "Daily").length;
    const weeklyCount = tasks.filter(task => task.category === "Weekly").length;
    const milestoneCount = tasks.filter(task => task.category === "Milestones").length;   // reason to add these here and not at the top is : if we add it at top then they will read the empty tasks=[] and never change later showing 0,0,0

    document.getElementById("length_of_daily_task").textContent=`${dailyCount}`
    document.getElementById("length_of_weekly_task").textContent=`${weeklyCount}`
    document.getElementById("length_of_milestone_task").textContent=`${milestoneCount}`
}

loadTasks();
renderTasks();


function syncHeatmapWithTasks() {  // this is helper function that gets the total and completed tasks for the heatmap . this function will be called everytime when something changes in the task section 
    console.log("syncHeatmapWithTasks called");
    const totalTasks = tasks.length;

    const completedTasks =
        tasks.filter(task => task.completed).length;

    updateTodayHeatmap({
        totalTasks,
        completedTasks
    });

}

// important notes :
// tasks is an array . 
// task is the object containing all task info . each "task" object will be stores as 1 element in "tasks" array 
