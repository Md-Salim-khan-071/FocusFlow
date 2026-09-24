// Heatmap
const initialize_data = initializeHeatmap();
renderHeatmap(initialize_data);

// Tasks
loadTasks().then(() => {
    checkForNewDate();
    checkForNewWeek();
    renderTasks();
});

// Progress
updateProgressCard();

// Notes
loadNotes();

// Pomodoro
loadPomodoro();
updateDisplay();