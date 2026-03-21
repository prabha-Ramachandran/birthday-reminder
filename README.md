# 🎂 Birthday Reminder App

A full-stack web application to manage birthday reminders with complete CRUD operations.

## Features
- ✅ Add new birthdays
- ✅ View all birthdays  
- ✅ Edit birthday details
- ✅ Delete birthdays
- ✅ Upcoming birthday reminders (next 30 days)
- ✅ Browser notifications for today's birthdays

## Technologies Used
- *Frontend*: HTML5, CSS3, JavaScript
- *Backend*: Node.js, Express.js
- *Database*: MongoDB
- *Version Control*: Git & GitHub

## How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed

### Steps

1. *Clone the repository*
   ```bash
   git clone https://github.com/prabha-Ramachandran/birthday-reminder.git
   cd birthday-reminder
   # Birthday Reminder App
2. Install backend dependencies: cd backend && npm install
3. Start MongoDB
4. Run backend: node server.js
5. Open frontend with Live Server

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/birthdays | Get all birthdays |
| POST | /api/birthdays | Add new birthday |
| PUT | /api/birthdays/:id | Update birthday |
| DELETE | /api/birthdays/:id | Delete birthday |

## Project Structure

birthday-reminder/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md

## Author
Prabha R
