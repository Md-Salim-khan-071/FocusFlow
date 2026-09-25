# 🚀 FocusFlow

> **A full-stack personal productivity dashboard designed to help users manage tasks, track focus sessions, monitor productivity, and build consistent habits.**

FocusFlow started as a browser-based productivity dashboard using HTML, CSS, and JavaScript with Local Storage. It is now being evolved into a **cloud-backed productivity platform** using FastAPI, PostgreSQL, and modern deployment infrastructure.

---

## 🌐 Live Application

**Frontend:**  
`https://focus-flow-liart-gamma.vercel.app/`

**Backend API:**  
`https://focusflow-doix.onrender.com`

---

## ✨ Features

### 📋 Smart Task Manager

- ✅ Create, edit, and delete tasks
- 📅 Daily tasks
- 📆 Weekly tasks
- 🎯 Milestone tasks
- 🔄 Automatic daily and weekly rollovers
- 📚 Task history and archive
- ✔️ Keyboard shortcut support
- ☁️ Cloud-backed task storage
- 🔄 Tasks persist across browser sessions and devices

### 🍅 Pomodoro Timer

- ⏱️ Focus and break sessions
- ▶️ Start / Pause / Reset
- 🔔 Audio notifications
- 📊 Session counter
- ⚡ End-Time based timer architecture
- 🖥️ Accurate timing when the browser tab is inactive

> Pomodoro data is currently stored locally. Cloud synchronization is planned.

### 🔥 Productivity Heatmap

- 📊 GitHub-style productivity heatmap
- 📈 Daily productivity scoring
- 📝 Completed task tracking
- 🍅 Pomodoro session tracking
- 🔥 Daily streak calculation
- 💬 Interactive tooltips
- 📅 Automatic future-month generation

> Heatmap data is currently browser-based and will be migrated to the backend.

### 📊 Progress Dashboard

- Circular productivity indicator
- Completed vs remaining tasks
- Task completion statistics
- Daily / weekly / milestone progress
- Overall productivity overview

### 📝 Quick Notes

- 📝 Quick note-taking
- 💾 Automatic saving
- 🕒 Last-saved timestamp

> Notes currently use browser Local Storage.

### 🌤️ Dashboard Widgets

- 🕒 Live clock
- 📅 Current date
- 👋 Dynamic greeting
- 🌦️ Weather information
- 💡 Motivational quotes
- 🌙 Light / dark theme
- 📱 Responsive layout

---

# 🏗️ Architecture

FocusFlow is gradually evolving from a client-side application into a full-stack cloud application.

```text
                    FocusFlow
                        │
              ┌─────────┴─────────┐
              │                   │
         Frontend              Backend
          Vercel                Render
              │                   │
              │ HTTPS             │
              └─────────┬─────────┘
                        │
                     FastAPI
                        │
                   SQLAlchemy
                        │
                        ▼
                PostgreSQL
                  Supabase