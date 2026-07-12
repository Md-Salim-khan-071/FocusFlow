// Tasks
loadTasks();
checkForNewDate();
renderTasks();

// Progress Card
updateProgressCard();

// Heatmap
const initialize_data = initializeHeatmap();
renderHeatmap(initialize_data);

// Notes
loadNotes();

// Pomodoro
loadPomodoro();
updateDisplay();