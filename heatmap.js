
const heatmap_storage_key = "FocusFlowHeatmap"

function initializeHeatmap(){
    const heatmapData = LoadHeatmap();   // loading the existing heatmap data . loaded as an array  . if its a first time user then there will be no existing data so the below if block
    if(heatmapData.length === 0){
        const today = new Date();

        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        const monthData = generateMonth(currentYear, currentMonth);  // it will run the below  function current date year as paramters 

        SaveHeatmap(monthData);
        return monthData;
    }
    appendMissingMonths(heatmapData);
    calculateStreak();
    return heatmapData;
}
const initialize_data = initializeHeatmap();
renderHeatmap(initialize_data);


// suppose if a user uses the app in july and stays inactive for next 2 months and comeback  in october . then august , september should also be generated 

function appendMissingMonths(heatmapData) {  // the  above function has already loaded the data , so we just reuse it 
    // now we need when was the cell created 
    const lastEntry = heatmapData[heatmapData.length - 1];   // gets the last element of the array

    const lastDate = new Date(lastEntry.date);
    const lastYear = lastDate.getFullYear();
    const lastMonth = lastDate.getMonth();
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let workingYear = lastYear;
    let workingMonth = lastMonth;   // these two are like cursor  points for the last entry . 

    // now we should loop and generate the missing months . that workinyear = currentyear , workingmonth = currenmonth

    while( workingMonth != currentMonth || workingYear != currentYear){  //  when both are equal stop the loop
        workingMonth++ ;    // now if this goes on incrementing when december comes i.e 11 . it will go to 12 and month exists there
        if(workingMonth > 11){
            workingMonth = 0;  // sets month to 0 . i.e january
            workingYear++;  // increments the year
        }
        const newMonth = generateMonth(workingYear , workingMonth) ;
        heatmapData.push(...newMonth);
    }
    SaveHeatmap(heatmapData);
}



function generateMonth(year , month){  // work of  this function is to generate everyday of a month . ( 2026 , 1 ) means year : 2026 and month february , as indexing strts from 0 . 
     
    const MonthData = []; // everyday generated will be pushed into an  array

    // next step will be to know how many days are in current month
    const DaysInMonth = new Date(year , month + 1 , 0).getDate(); // suppose month is july becomes 6 as indexing starts from 0 . here we add + 1 so it becomes 7 , but now it goes to august , so we write 0 . that says Day 0 of august , which one day before august that is 31st july . we get 31

    for(let day =1 ; day <= DaysInMonth ; day++){  // loops through everyday after we get the total days in month

        const currentDate = new Date(year, month, day); // creating a date object

        const formattedyear = currentDate.getFullYear();
        const formattedmonth = String(currentDate.getMonth() + 1).padStart(2, "0");
        const formattedday = String(currentDate.getDate()).padStart(2, "0");

        const formattedDate = `${formattedyear}-${formattedmonth}-${formattedday}`;
 
        MonthData.push({
            date: formattedDate,
            score: 0,
            totalTasks: 0,
            completedTasks: 0,
            completedPomodoros: 0
        });     //  here a  dictionary is created and score is given 0 which will later be calculate  through task completion and pomodoro sessions
    }
    return MonthData;
}


// now problem is there is one big array of the dates  , we can loop and get the dates but , there will be no month seperation . sor first we convert the array from [ 30july ,  31 july ,  1august  ,  2agust] to {july[1,2,3,4,...] , august[1,2,3,4,....]} 
// then it will be simple logic . loop over months inside each month loop over days 
function groupHeatmapByMonth(heatmapData) { // the purpose of this function is converting one big array into months 
    
    const groupedData = {};  // creating an empty dictionary
    
    for (const day of heatmapData){
        // now in each iteration we will get one date and score . we need to get the month from that date .
        const monthKey = day.date.slice(0,7);  // ex:2026-07-31 . only "2026-07" is from index 0-6 .
        
        if (!groupedData[monthKey]) {  // if the month exists or not in groupedData dictionary . "if this month does not exist then"
            groupedData[monthKey] = [];  // create an array of that month as one element of dictionary
        }
        groupedData[monthKey].push(day);  // this pushes the day in that month 
    }
    return groupedData;
}


// now rendering all this on the page
function renderHeatmap(heatmapData){
    const heatmapContainer = document.querySelector(".main_heatmap");  // this is  the heatmap  container made in html already
    heatmapContainer.innerHTML = "";  // this is to remove risks of duplicating 
     
    const groupedData = groupHeatmapByMonth(heatmapData);   // getting the above grouped data 

    for(const [monthKey, monthData] of Object.entries(groupedData)){   // objects looping [key , value]

        const monthBlock = document.createElement("div");  // in the first iteration we will get the first month and we will  crate a container of that month
        monthBlock.classList.add("month-block");  // class for that div 
        heatmapContainer.appendChild(monthBlock);  // the whole month block  into the full heatmap container

        const monthTitle =document.createElement("h4"); // inside that container we need the month heading
        const [year , month] = monthKey.split("-") // ex : month is 2026-07 this divides as [2026 , 07]
        const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        monthNames[Number(month) - 1]
        monthTitle.textContent =`${monthNames[Number(month)-1]} ${year}`;
        monthBlock.appendChild(monthTitle);  // this will append monthTitle in monthBlock container

        const monthGrid = document.createElement("div");  // creates one months grid  , where each date cell of that month will stored .
        monthGrid.classList.add("month-grid");
        monthBlock.appendChild(monthGrid); // stores grid of that month in that months block

        // no we loop inside the month  for  each day
        for ( const day of monthData){
            const cell = document.createElement("div") // cell boxes will be created 
            cell.classList.add("heatmap-cell");
            cell.classList.add(`level${day.score}`);   //this will create a class name based on scroe . example score = 0  . classname becomes level0 . we have already defined colors for each level 
            const dayNumber = day.date.split("-")[2];
            cell.textContent = "";
            monthGrid.appendChild(cell);
        }   
    }
      
}

// now we need get the data object of todays date  for updating the cell 
function getTodayHeatmapEntry(heatmapData) { // purpose is to only find todays data object 
    const today = new Date();  // get todays date 
    
    // we need to  convert the recieved data in our format : (2026-07-28) 
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    // using find() we get object of todays date .
    const todayEntry = heatmapData.find(
        day => day.date === formattedDate
    );
    return todayEntry;
}

function updateTodayHeatmap(productivityData) {
    
    // Load complete heatmap data
    const heatmapData = LoadHeatmap();

    // Get today's object
    const todayEntry = getTodayHeatmapEntry(heatmapData);

    // Update only the values that were passed
    if (productivityData.completedTasks !== undefined) {
        todayEntry.completedTasks = productivityData.completedTasks;
    }

    if (productivityData.totalTasks !== undefined) {
        todayEntry.totalTasks = productivityData.totalTasks;
    }

    if (productivityData.completedPomodoros !== undefined) {
        todayEntry.completedPomodoros = productivityData.completedPomodoros;
    }

    console.log("Before Score Calculation:", todayEntry);

    // Calculate score
    const score = calculateHeatmapScore(todayEntry);
    // console.log("Returned Score =", score);
    // console.log("Calculated Score:", score);

    // Store score
    todayEntry.score = score;

    console.log("After Score Assignment:", todayEntry);

    // Save updated heatmap
    SaveHeatmap(heatmapData);

    // Re-render UI
    renderHeatmap(heatmapData);

    calculateStreak();

}

function calculateHeatmapScore(todayEntry){
    // what if user does not create any task today . total tasks should be greater than 0 otherwise percentage should not  be calculated
    let taskPercentage = 0;
    if(todayEntry.totalTasks > 0){
        taskPercentage = (todayEntry.completedTasks/todayEntry.totalTasks)*100
    }

    // for pomodor percentage we need one goal .
    const DAILY_POMODORO_GOAL = 6;
    let pomodoroPercentage = (todayEntry.completedPomodoros/DAILY_POMODORO_GOAL)*100 ;
    pomodoroPercentage = Math.min(pomodoroPercentage , 100) ; // this limits the percentage  100  . why ? pomodoro goal is 6 . but what is user did 9 pomodoro cycles . 

    // calculating weighted percentages of both 
    const weightedTaskPercentage = taskPercentage*0.6;
    const weightedPomodoroPercentage = pomodoroPercentage*0.4;

    // actual produtivity percentage
    const productivityPercentage = weightedTaskPercentage + weightedPomodoroPercentage

    // actuall scores 
    if(productivityPercentage === 0){
        return 0;
    }
    else if(productivityPercentage>0 && productivityPercentage <= 25){
        return 1;
    }
    else if(productivityPercentage>25 && productivityPercentage <= 50){
        return 2;
    }
    else if(productivityPercentage>50 && productivityPercentage<=75){
        return 3;
    }
    else{
        return 4;
    }
}

function calculateStreak() {
    const heatmapData = LoadHeatmap();
    const todayIndex = getTodayHeatmapIndex(heatmapData);
    let streak = 0;
    for (let i = todayIndex; i >= 0; i--) {
        const day = heatmapData[i];
        if (day.score > 0) {
            streak++;
        }
        else {
            break;
        }
    }
    const streakText = streak === 1 ? "Day" : "Days";
    document.getElementById("streak").textContent =`🔥 ${streak} ${streakText} Streak`;
}

function getTodayHeatmapIndex(heatmapData) {  // this function is to get todays date .  for streak calculation
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const todayIndex = heatmapData.findIndex(
        day => day.date === formattedDate
    );
    return todayIndex;
}

function SaveHeatmap(data){
    const jsondata = JSON.stringify(data);  // data will be dictionary one element  . all the info about one task or focus session will be stored in "data" .
    localStorage.setItem(heatmap_storage_key , jsondata)
}

function LoadHeatmap(){
    const StoredData = localStorage.getItem(heatmap_storage_key);

    if(StoredData){
        return JSON.parse(StoredData);
    }
    return []
}
