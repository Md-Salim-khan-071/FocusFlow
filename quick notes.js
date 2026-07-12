const notesArea = document.getElementById("quick_notes");
const lastSaved = document.getElementById("last_saved");


// Save notes to localStorage
function saveNotes() {

    // Get the current time
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");

    // Month starts from 0, so add 1
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const year = now.getFullYear();

    // Save the note
    localStorage.setItem("quickNotes", notesArea.value);

    // Save the time
    const saveTime = `${hours}:${minutes} on ${date}/${month}/${year}`;

    localStorage.setItem("lastSavedTime", saveTime);

    // Update UI
    lastSaved.textContent = `Last saved at: ${saveTime}`;
}


// Load notes from localStorage
function loadNotes() {

    // Read the saved notes
    const savedNotes = localStorage.getItem("quickNotes");
    const savedLast = localStorage.getItem("lastSavedTime");

    // If notes exist, display them
    if (savedNotes !== null) {
        notesArea.value = savedNotes;
    }
    if (savedLast !== null) {
    lastSaved.textContent = `Last saved: ${savedLast}`;
    }
}


// Listen while the user types
notesArea.addEventListener("input", saveNotes);


// Load notes when the page opens
// loadNotes();