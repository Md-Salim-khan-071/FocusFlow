const API_BASE_URL = "https://YOUR-RENDER-URL.onrender.com";

let tasks = [];

const LAST_OPEN_DATE_KEY = "FocusFlowLastOpenDate";
const LAST_OPEN_WEEK_KEY = "FocusFlowLastOpenWeek";

const taskInput = document.getElementById("input_area");
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();   // Prevents form submission if inside a form
        addTask();
    }
});  // to add if pressed enter 

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


// for the task history 
const taskHistoryButton = document.getElementById("task_history_button");
const historyOverlay = document.querySelector(".history_overlay");
const closeButton = document.getElementById("close_button");
const historyContent = document.querySelector(".history_content");

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

async function addTask() {

    const title = taskInput.value.trim();
    const category = taskCategory.value;

    if (!title) {
        return;
    }

    try {

        const response = await fetch(`${API_BASE_URL}/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                category: category
            })
        });

        if (!response.ok) {
            throw new Error("Failed to create task");
        }

        const data = await response.json();

        const task = {
            id: data.id,
            title: data.title,
            category: data.category,
            completed: data.completed,
            createdAt: data.created_at,
            archived: data.archived,
            completedDate: data.completed_date
        };

        tasks.push(task);

        taskInput.value = "";

        renderTasks();
        updateProgressCard();
        syncHeatmapWithTasks();

    } catch (error) {

        console.error("Error creating task:", error);

        alert("Could not save task. Make sure the FocusFlow backend is running.");
    }
}
addButton.addEventListener("click", addTask);

function renderTasks() {

    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => task.category === selectedCategory && task.archived === false);

    for (const task of filteredTasks) {
        relatedCategorySubtitle()
        lengthOfCategory()
        const taskElement = createTaskCard(task);

        const taskLeft = document.createElement("div");   // creates the the container for the left section which has checkbox and task title  
        taskLeft.classList.add("left_section_of_taskbox");

        const checkbox = document.createElement("input");  // creates the checkbox at the start of the task 
        checkbox.type = "checkbox";
        checkbox.classList.add("task_checkbox");

        checkbox.checked = task.completed   // task is the object where completed : false . when the checkbox is not checked it stays false . if initially in the object if completed : true the checkbox appears ticked from the start 
        checkbox.addEventListener("change", async () => {

            const completed = checkbox.checked;

            const completedDate = completed
                ? getFormattedTodayDate()
                : null;

            try {

                const response = await fetch(
                    `${API_BASE_URL}/tasks/${task.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            completed: completed,
                            completed_date: completedDate
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to update task");
                }

                const updatedTask = await response.json();

                task.completed = updatedTask.completed;
                task.completedDate = updatedTask.completed_date;

                renderTasks();
                syncHeatmapWithTasks();

            } catch (error) {

                console.error("Error updating task:", error);

                checkbox.checked = !completed;

                alert("Could not update task.");
            }
        });//this listens to the chechboxs check . why not click ? bcoz checkboz goes checked -> unchecked -> checked hence it is change .



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
        edit_button.textContent = "🖋️"
        edit_button.addEventListener("click", () => {
            editTask(task.id);  // editTask is the function created . and task.id is sent as a parameter .
        });   // gets the id of the task , when edit is clicked .


        const delete_button = document.createElement("button")
        delete_button.classList.add("delete-task");
        delete_button.classList.add("common_for_edit-and-delete");
        delete_button.textContent = "🗑️"

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

function createTaskCard() {
    const taskElement = document.createElement("div");   // creates the main div that  contains all the things of one task  
    taskElement.classList.add("task_box");   // add a classs to created div
    return taskElement;
    updateProgressCard()  // function from progress.js
}

async function deleteTask(id) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/tasks/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        tasks = tasks.filter(task => task.id !== id);

        renderTasks();
        updateProgressCard();
        syncHeatmapWithTasks();

    } catch (error) {

        console.error("Error deleting task:", error);

        alert("Could not delete task.");
    }
} // this function removes the task from the  array and hence it is removed

async function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const newTitle = prompt("Edit Task", task.title);

    if (newTitle === null) {
        return;
    }

    if (newTitle.trim() === "") {
        return;
    }

    const updatedTitle = newTitle.trim();

    try {

        const response = await fetch(
            `${API_BASE_URL}/tasks/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: updatedTitle
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        const updatedTask = await response.json();

        task.title = updatedTask.title;

        renderTasks();
        updateProgressCard();

    } catch (error) {

        console.error("Error updating task:", error);

        alert("Could not update task.");
    }
}

function checkForNewDate() {   // this function checks whether today is a new day or not . 
    const formattedDate = getFormattedTodayDate();

    const lastOpenDate = localStorage.getItem(LAST_OPEN_DATE_KEY);
    console.log(formattedDate);

    if (lastOpenDate === null) {
        localStorage.setItem(LAST_OPEN_DATE_KEY, formattedDate);   // saves todays date 
        return;
    }
    if (lastOpenDate === formattedDate) {
        return;
    }
    else {
        dailyRollover();
    }
    localStorage.setItem(LAST_OPEN_DATE_KEY, formattedDate);
    // console.log(localStorage.getItem(LAST_OPEN_DATE_KEY)); // saves todays date 
}

function dailyRollover() {  // task is to loop through every daily task . if it is completed move to archive if  not rollover to next day . this runs only when new date occurs 
    for (const task of tasks) {

        if (task.category === "Daily") {  // this if block for checking if the task category is daily 
            if (task.completed === true) {
                task.archived = true;
                // task.completedDate = getFormattedTodayDate();
            }
        }
    }
    saveTasks();
}
function getCurrentWeekNumber() {
    const today = new Date();
    // First day of the year
    const firstDay = new Date(today.getFullYear(), 0, 1);     // today.getFullYear = 2026 , 0 = january , 1 = 1 . becomes 1-1-2026 
    // Days passed since Jan 1
    const daysPassed = Math.floor((today - firstDay) / (1000 * 60 * 60 * 24));
    // Week number
    const weekNumber = Math.ceil((daysPassed + firstDay.getDay() + 1) / 7);
    return weekNumber;
}
function checkForNewWeek() {
    const currentWeek = getCurrentWeekNumber()
    const lastOpenWeek = localStorage.getItem(LAST_OPEN_WEEK_KEY);
    // First time opening the app
    if (lastOpenWeek === null) {
        localStorage.setItem(LAST_OPEN_WEEK_KEY, currentWeek);
        return;
    }
    // Same week
    if (Number(lastOpenWeek) === currentWeek) {   // why number(lastOpenWeek) bcoz localStorage saves it as "28" etc and "28" is not equal to 28
        return;
    }
    // New week detected
    console.log("New Week Detected");
    weeklyRollover();
    localStorage.setItem(LAST_OPEN_WEEK_KEY, currentWeek);
}
function weeklyRollover() {
    for (const task of tasks) {
        if (task.category === "Weekly") {
            if (task.completed) {
                task.archived = true;
                // task.completedDate = getFormattedTodayDate();
            }
        }
    }
    saveTasks();
    renderTasks();
}


function groupHistoryByDate(historyTasks) {
    const groupedHistory = {};
    for (const task of historyTasks) {
        const dateKey = task.completedDate;
        if (!groupedHistory[dateKey]) {
            groupedHistory[dateKey] = [];
        }
        groupedHistory[dateKey].push(task);
    }
    return groupedHistory;
}
function formatHistoryDate(dateString) {
    const date = new Date(dateString);
    const options = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    return date.toLocaleDateString("en-IN", options);
}

taskHistoryButton.addEventListener("click", () => {
    historyOverlay.style.display = "flex";
    const historyTasks = tasks.filter(task => task.archived);

    if (historyTasks.length === 0) {
        historyContent.innerHTML = `
            <div class="empty_history">
                <h2>No completed tasks yet 📂</h2>
                <p>Complete some tasks to build your history.</p>
            </div>
        `;
        return;
    }

    const groupedHistory = groupHistoryByDate(historyTasks);

    historyContent.innerHTML = "";
    const sortedHistory = Object.entries(groupedHistory).sort(
        ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
    );
    for (const [date, tasksOnDate] of sortedHistory) {

        // Create date heading
        const dateHeading = document.createElement("h3");
        dateHeading.textContent = `📅 ${formatHistoryDate(date)}`;
        dateHeading.classList.add("history_date_heading");
        historyContent.appendChild(dateHeading);

        // Loop through tasks completed on that date
        for (const task of tasksOnDate) {
            const taskCard = document.createElement("div");
            taskCard.classList.add("history_task_card");
            taskCard.innerHTML = `
                <div class="history_task_title">
                    ✅ ${task.title}
                </div>

                <div class="history_task_details">
                    📁 ${task.category} Task
                </div>
            `;
            historyContent.appendChild(taskCard);
        }
    }
});

closeButton.addEventListener("click", () => {
    historyOverlay.style.display = "none";
});

// we should save the data after each modification like add , edit , delete . so we will call this function after each modification function

async function loadTasks() {

    try {

        const response = await fetch(`${API_BASE_URL}/tasks/`);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const data = await response.json();

        tasks = data.map(task => ({
            id: task.id,
            title: task.title,
            category: task.category,
            completed: task.completed,
            createdAt: task.created_at,
            archived: task.archived,
            completedDate: task.completed_date
        }));

        updateProgressCard();
        syncHeatmapWithTasks();

    } catch (error) {

        console.error("Error loading tasks:", error);

        alert("Could not load tasks from FocusFlow server.");
    }
}

function updateProgress() {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(task => task.completed).length

    completedHeader.textContent = `${completedTasks}/${totalTasks} Tasks Completed`;  // we already took it D.get.elembyid at th start .

} // call this renderTasks function because all other functions call renderTasks so automatically this function will be called everytime 

function relatedCategorySubtitle() {
    if (selectedCategory == "Daily") {
        document.getElementById("subtitle").textContent = "𖣠 Small Actions For Today";
    }
    else if (selectedCategory == "Weekly") {
        document.getElementById("subtitle").textContent = "𖣠 Steps toward bigger goals this week";
    }
    else if (selectedCategory == "Milestones") {
        document.getElementById("subtitle").textContent = "𖣠 Big milestones to work toward";
    }
}
function lengthOfCategory() {
    const dailyCount = tasks.filter(task => task.category === "Daily").length;
    const weeklyCount = tasks.filter(task => task.category === "Weekly").length;
    const milestoneCount = tasks.filter(task => task.category === "Milestones").length;   // reason to add these here and not at the top is : if we add it at top then they will read the empty tasks=[] and never change later showing 0,0,0

    document.getElementById("length_of_daily_task").textContent = `${dailyCount}`
    document.getElementById("length_of_weekly_task").textContent = `${weeklyCount}`
    document.getElementById("length_of_milestone_task").textContent = `${milestoneCount}`
}


function syncHeatmapWithTasks() {
    console.log("syncHeatmapWithTasks called");
    const today = getFormattedTodayDate();
    const totalTasks = tasks.filter(task =>
        !task.completed || task.completedDate === today
    ).length;
    const completedTasks = tasks.filter(task =>
        task.completed && task.completedDate === today
    ).length;
    updateTodayHeatmap({
        totalTasks,
        completedTasks
    });
}

function getFormattedTodayDate() {
    const today = new Date();  // get todays date 
    // we need to  convert the recieved data in our format : (2026-07-28) 
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

// loadTasks();
// checkForNewDate();
// renderTasks();
// important notes :
// tasks is an array .
// task is the object containing all task info . each "task" object will be stores as 1 element in "tasks" array 
