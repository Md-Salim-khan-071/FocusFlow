const POMODORO_STORAGE_KEY = "FocusFlowPomodoro";
const FOCUS_MINUTES = 1;
const BREAK_MINUTES = 1;


let minutes = FOCUS_MINUTES;
let seconds = 0;

let timer = null;

let isRunning = false;

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

    timer = setInterval(() => {
        if (seconds > 0) {
            seconds--;
        }
        else if(minutes > 0 && seconds == 0){
            minutes--;
            seconds=59;
        }
        else if(minutes == 0){
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


// focusButton.addEventListener("click",focusState)
// function focusState(){
//     clearInterval(timer);
//     isRunning = false;

//     currentState="focus"

//     minutes = FOCUS_MINUTES;
//     seconds = 0;

//     updateDisplay()
// }

// breakButton.addEventListener("click",breakState)
// function breakState(){
//     clearInterval(timer);
//     isRunning = false;   // because when user switches break . the timer should stop

//     currentState="break"
//     minutes = BREAK_MINUTES;
//     seconds = 0;
    
//     updateDisplay()
// }
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
