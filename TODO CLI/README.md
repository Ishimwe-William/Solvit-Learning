# 📋 Task Manager (CLI & Web GUI)

A lightweight, zero-dependency Task Management application built with modern Node.js ES Modules. It provides both an interactive Command-Line Interface (CLI) and a browser-based Web GUI backed by a RESTful HTTP API.

---

## ✨ Features

- 🔄 **Dual Interface Modes**: Choose between an interactive Terminal CLI or a Web Dashboard.
- 💾 **Persistent Storage**: Tasks are automatically persisted to local `tasks.json`.
- 🛠️ **Full Task CRUD**:
  - **Create**: Add new tasks with title and description.
  - **Read**: View all tasks or filter by pending status.
  - **Update**: Edit task details or switch statuses between `pending`, `completed`, and `cancelled`.
  - **Delete**: Permanently remove tasks.
- 🚀 **Zero Dependencies**: Pure vanilla JavaScript using Node.js native modules (`node:http`, `node:fs/promises`, `node:readline/promises`).
- 🌐 **REST API & CORS Support**: HTTP API endpoints for integration and front-end interaction.

---

## 📁 Organized Project Structure

```text
TODO CLI/
├── src/                    # Backend source code
│   ├── cli.js              # Interactive CLI menu & terminal UI
│   ├── server.js           # HTTP server hosting static files & REST API endpoints
│   └── taskManager.js      # Business logic & file storage manager
├── public/                 # Static web GUI assets
│   ├── index.html          # Web dashboard entry page
│   ├── css/
│   │   └── styles.css      # Custom stylesheet
│   └── js/
│       └── client.js       # Client-side DOM manipulation & API client
├── index.js                # Root entry point
├── tasks.json              # Local database file
├── package.json            # Project configuration & NPM scripts
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)

### Installation

1. Navigate into the project directory:
   ```bash
   cd "TODO CLI"
   ```

2. No `npm install` required! The application uses native Node.js libraries exclusively.

---

## 💻 Usage

### 1. Web Dashboard & Server Mode

To launch the HTTP server and open the Web GUI:

```bash
npm start
```

Open your browser at: **`http://localhost:3000/`**

---

### 2. Interactive CLI Mode

To run the terminal interface:

```bash
npm run cli
```
*or*
```bash
node index.js --cli
```

#### CLI Menu Options:
```text
--- Menu ---
0. List All Tasks
1. Create Task
2. View Pending Tasks
3. Edit Task details
4. Complete/Cancel Task
5. Delete Task
6. Exit
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch all tasks | *None* |
| `GET` | `/api/tasks/:id` | Fetch task by ID | *None* |
| `POST` | `/api/tasks` | Create a new task | `{"name": "Buy groceries", "description": "Milk, Eggs"}` |
| `PUT` / `PATCH` | `/api/tasks/:id` | Update task details/status | `{"status": "completed"}` |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID | *None* |

---

## 📄 License

ISC License
