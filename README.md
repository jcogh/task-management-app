# Task Management Application

A modern, real-time task management application built with React, TypeScript, and Flask. This application allows users to create, view, update, and delete tasks.

## Features

- Create new tasks with title, description, status, priority, and due date
- View a list of all tasks
- Delete tasks
- Real-time updates using WebSocket communication
- Responsive design for both desktop and mobile devices

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Socket.IO Client
- Backend:
  - Flask
  - Flask-SocketIO
  - SQLAlchemy
  - SQLite

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- Python (v3.8 or later)
- pip

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/jcogh/task-management-app.git
   cd task-management-app
   ```

2. Set up the backend:
   ```
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

## Configuration

1. Backend configuration:
   - Open `backend/app.py` and modify the `SECRET_KEY` if needed.
   - Adjust the database URI in `backend/app.py` if you want to use a different database.

2. Frontend configuration:
   - Open `frontend/src/config.ts` and modify the `BACKEND_URL` if your backend is not running on the default `http://localhost:5000`.

## Running the Application

1. Start the backend server:
   ```
   cd backend
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   python app.py
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to use the application.

## Usage

- To create a new task, fill out the form on the left side of the screen (or top on mobile devices) and click "Add Task".
- To view task details, click on a task in the list.
- To delete a task, click the "Delete" button next to the task in the list.
- The task list will update in real-time for all connected clients when tasks are added or deleted.

## Contributing

Contributions to this project are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Flask](https://flask.palletsprojects.com/)
- [Socket.IO](https://socket.io/)
