//This will work, provided:

// Both files are loaded in your HTML.
// tasks is declared in the global scope (not inside a function).
// tasks_section.js is loaded before progress.js.

function updateProgressCard(){

    const totalTasks = tasks.length; 

    const completedTasks =
        tasks.filter(task => task.completed).length;

    const remainingTasks =
        totalTasks - completedTasks;

    let progressPercentage = 0;

    if(totalTasks > 0){
        progressPercentage = Math.round(
            (completedTasks / totalTasks) * 100
        );
    }

    document.getElementById("tasks_done").textContent =
        completedTasks;

    document.getElementById("tasks_remaining").textContent =
        remainingTasks;

    document.getElementById("total_tasks").textContent =
        totalTasks;

    document.getElementById("progress_percentage").textContent =
        `${progressPercentage}%`;

    // for the ring 
    const degrees = progressPercentage * 3.6;
    const circle = document.getElementById("progress_circle");

    circle.style.background =
    `
    conic-gradient(
        var(--button-color)  ${degrees}deg,
        var(--inside-sections) ${degrees}deg
    )
    
    `;


    // subtitles 
    const progress_subtitle = document.getElementById("progress_report_subtitle");
    if(progressPercentage === 0){
        progress_subtitle.textContent="Let's get started 🚀"
    }
    else if(progressPercentage>0 && progressPercentage<25){
        progress_subtitle.textContent="Every step counts 🌱"
    }
    else if(progressPercentage>=25 && progressPercentage<50){
        progress_subtitle.textContent="Building momentum 💪"
    }
    else if(progressPercentage>=50 && progressPercentage<75){
        progress_subtitle.textContent="Halfway there 🎯"
    }
    else if(progressPercentage>=75 && progressPercentage<100){
        progress_subtitle.textContent="Almost done 🔥"
    }
    else{
        progress_subtitle.textContent="Excellent work today! 🎉"
    }

    // completed task counts 
    const totalDaily =
    tasks.filter(task => task.category === "Daily").length;
    const completedDaily =
    tasks.filter(task =>
        task.category === "Daily" &&
        task.completed
    ).length;

    const totalWeekly =
    tasks.filter(task => task.category === "Weekly").length;
    const completedWeekly =
        tasks.filter(task =>
            task.category === "Weekly" &&
            task.completed
        ).length;

    const totalMilestones =
    tasks.filter(task => task.category === "Milestones").length;
    const completedMilestones =
        tasks.filter(task =>
            task.category === "Milestones" &&
            task.completed
        ).length;

    document.getElementById("daily_count").textContent =
    `${completedDaily}/${totalDaily}`;

    document.getElementById("weekly_count").textContent =
    `${completedWeekly}/${totalWeekly}`;

    document.getElementById("milestone_count").textContent =
    `${completedMilestones}/${totalMilestones}`;


    // for the progress bars . first we daily , weekly , milestone percenatges .

    let dailyPercentage = 0;
    if (totalDaily > 0) {
        dailyPercentage = (completedDaily / totalDaily) * 100;
    }

    let weeklyPercentage = 0;
    if (totalDaily > 0) {
        weeklyPercentage = (completedWeekly / totalWeekly) * 100;
    }

    let milestonesPercentage = 0;
    if (totalDaily > 0) {
        milestonesPercentage = (completedMilestones / totalMilestones) * 100;
    }

    document.getElementById("daily_progress_fill").style.width =`${dailyPercentage}%`;

    document.getElementById("weekly_progress_fill").style.width =`${weeklyPercentage}%`;

    document.getElementById("milestones_progress_fill").style.width =`${milestonesPercentage}%`;
}
updateProgressCard()  // function from progress.js