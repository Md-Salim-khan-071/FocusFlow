# 🚀 FocusFlow

> **A modern Personal Productivity Dashboard** built with **HTML, CSS, and JavaScript** to help you stay focused, manage tasks, track productivity, and build consistent habits.

<!-- ![Status](https://img.shields.io/badge/Status-Active-success)
![Made With](https://img.shields.io/badge/Made%20With-JavaScript-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

--- -->

## ✨ Features

### 📋 Smart Task Manager
- ✅ Create, edit, and delete tasks
- 📅 Daily Tasks
- 📆 Weekly Tasks
- 🎯 Milestone Tasks
- 🔄 Automatic Daily & Weekly Rollovers
- 📚 Task History Archive
- ✔️ Keyboard shortcut (Press **Enter** to add tasks)

---

### 🍅 Pomodoro Timer
- ⏱️ Focus & Break sessions
- ▶️ Start / Pause / Reset
- 🔔 Audio notifications
- 📊 Session counter
- ⚡ Accurate timer using **End-Time Architecture**
- 🖥️ Works correctly even when the browser tab is inactive

---

### 🔥 Productivity Heatmap
- GitHub-style heatmap
- 📈 Daily productivity score
- 📝 Tracks completed tasks
- 🍅 Tracks Pomodoro sessions
- 🔥 Daily streak calculation
- 💬 Interactive tooltips
- 📅 Automatically generates future months

---

### 📊 Progress Dashboard
- Circular progress indicator
- Task completion statistics
- Remaining vs Completed tasks
- Overall productivity overview

---

### 📝 Quick Notes
- Auto-save notes
- Persistent local storage
- Last saved timestamp

---

### 🌤️ Dashboard Widgets
- 🕒 Live Clock
- 📅 Current Date
- 👋 Dynamic Greeting
- 🌦️ Weather Information
- 💡 Motivational Quotes
- 🌙 Theme Toggle

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (ES6)
- Local Storage API

---

## 📂 Project Structure

```
FocusFlow/
│
├── index.html
├── style.css
├── script.js
├── tasks_section.js
├── pomodoro.js
├── progress.js
├── heatmap.js
├── quick_notes.js
└── assets/
```

---

## 🧠 How It Works

### Daily Task Lifecycle

```
Create Task
      │
      ▼
Complete Task
      │
      ▼
Daily Rollover
      │
      ├── Completed → History
      └── Incomplete → Next Day
```

---

### Weekly Task Lifecycle

```
Create Weekly Task
        │
        ▼
Complete During Week
        │
        ▼
Visible Until Week Ends
        │
        ▼
Archived Automatically
```

---

### Heatmap Scoring

Productivity is calculated using:

- ✅ Completed Tasks (60%)
- 🍅 Completed Pomodoro Sessions (40%)

Final productivity score determines the heatmap color intensity.

---

## 💾 Data Storage

FocusFlow stores data locally using the browser's Local Storage.

Stored information includes:

- Tasks
- Task History
- Pomodoro State
- Heatmap Data
- Notes
- Theme Preference
- Progress Statistics

---

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/FocusFlow.git
```

2. Open the project

```bash
cd FocusFlow
```

3. Launch using VS Code Live Server or simply open:

```
index.html
```

---

## 📸 Screenshots

> *(Add screenshots here once the UI is finalized.)*

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Heatmap

![Heatmap](screenshots/heatmap.png)

### Task History

![History](screenshots/history.png)

---

## 🎯 Future Improvements

- User Authentication
- Cloud Sync
- Export Reports (PDF / CSV)
- Calendar Integration
- Notifications & Reminders
- Mobile Responsive Layout
- Progressive Web App (PWA)
- Electron Desktop Version

---

## 🤝 Contributing

Contributions, ideas, and feature requests are welcome!

Feel free to fork the project and submit a pull request.

---

## 👨‍💻 Author

**Mohammed Salim Usman Khan**

If you found this project useful, consider giving it a ⭐ on GitHub!