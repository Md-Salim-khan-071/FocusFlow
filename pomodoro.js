const POMODORO_STORAGE_KEY = "FocusFlowPomodoro";
const FOCUS_MINUTES = 30;
const BREAK_MINUTES = 10;


let minutes = FOCUS_MINUTES;
let seconds = 0;

let timer = null;

let isRunning = false;
let endtime = null;

let sessioncount = 0;

currentState = "focus";

const timerDisplay = document.getElementById("timer");

const startButton = document.getElementById("start_timer");

const pauseButton = document.getElementById("pause_timer");

const resetButton = document.getElementById("reset_timer");

const focusButton = document.getElementById("focus_tab");

const breakButton = document.getElementById("break_tab");

const take_A_break = new Audio("take a break.mp3")
const time_to_focus = new Audio("time to focus.mp3")

document.getElementById("session_count").textContent=`${sessioncount} focus sessions completed today`

function updateDisplay(){  // to display the time 

    const formattedMinutes = String(minutes).padStart(2, "0");   // without padStart 09:05 would look 9:5
    const formattedSeconds = String(seconds).padStart(2, "0");
    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
}
updateDisplay();

startButton.addEventListener("click",startTimer);
function startTimer(){
    if (isRunning){
        return
    }
    isRunning = true; // this because initially at the top we have it set to false

    endtime = Date.now() + ((FOCUS_MINUTES*60) + seconds)*1000;  // example : current time 22:00 , we start 30min timer , end time should be 22:30 . Date.now() stores in miliseconds so we convert 30mins into miliseconds . this is all done because if loop it keep decrementing after some  browser will stop after we change the tabs . but this approach if browser pauses the next time we open the tab , it will show the currect remaing time as we will calculating it and not  just decrementing .

    console.log("End Time:", endtime);
    console.log("Current Time:", Date.now());

    timer = setInterval(() => {
        const remainingTime = Math.max(
            0,
            Math.floor((endtime - Date.now()) / 1000)  // converts miliseconds to seconds
        );

        minutes = Math.floor(remainingTime / 60);    // converts seconds to minutes by getting quotient
        seconds = remainingTime % 60;   // this gets the remainder . so if seconds 622 . minutes become 10 and  seconds become 22.

        if(remainingTime <= 0){
            clearInterval(timer);
            isRunning = false;
            
            if (currentState === "focus") {
                take_A_break.play(); 
                sessioncount++;  
                savePomodoro()
                // this is where one session completes so here is where we are going integrate it with heatmap
                syncHeatmapWithPomodoro();
                document.getElementById("session_count").textContent=`${sessioncount} focus sessions completed today`
            } 
            else{
                time_to_focus.play();
            }
        }

        updateDisplay()
    }, 1000);
}

pauseButton.addEventListener("click",pauseTimer);
function pauseTimer(){
    clearInterval(timer);
    isRunning = false;
}

resetButton.addEventListener("click",resetTimer);
function resetTimer(){
    clearInterval(timer);
    if(currentState == "focus"){
        minutes = FOCUS_MINUTES;
        seconds = 0;
    }
    else{
        minutes = BREAK_MINUTES;
        seconds = 0;
    }
    isRunning = false;
    updateDisplay()
}

function savePomodoro() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const pomodoroData = {
        date: formattedDate,
        sessioncount: sessioncount
    };

    localStorage.setItem(
        POMODORO_STORAGE_KEY,
        JSON.stringify(pomodoroData)
    );
}



function loadPomodoro() {

    const storedData = localStorage.getItem(POMODORO_STORAGE_KEY);

    if (!storedData) {
        return;
    }

    const pomodoroData = JSON.parse(storedData);

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    if (pomodoroData.date === formattedDate) {

        sessioncount = pomodoroData.sessioncount;

    }
    else {

        sessioncount = 0;

        savePomodoro();

    }

}

// loadPomodoro();
document.getElementById("session_count").textContent =`${sessioncount} focus sessions completed today`;

focusButton.addEventListener("click", () => {
    switchMode("focus", FOCUS_MINUTES);
    focusButton.classList.add("active_mode");
    breakButton.classList.remove("active_mode");
});
breakButton.addEventListener("click", () => {
    switchMode("break", BREAK_MINUTES);
    breakButton.classList.add("active_mode");
    focusButton.classList.remove("active_mode");
});
function switchMode(mode, duration) {
    clearInterval(timer);
    isRunning = false; 
    currentState = mode;
    minutes = duration;
    seconds =  0;
    updateDisplay();
}

// updateDisplay()

function syncHeatmapWithPomodoro() {
        // function to connect with heatmap
    updateTodayHeatmap({
        completedPomodoros: sessioncount
    });

}
