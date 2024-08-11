#!/bin/bash

# Task Manager Startup Script

# Exit immediately if a command exits with a non-zero status
set -e

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required commands
if ! command_exists python; then
  echo "Python is not installed. Please install Python and try again."
  exit 1
fi

if ! command_exists npm; then
  echo "npm is not installed. Please install Node.js and npm, then try again."
  exit 1
fi

# Navigate to the project root directory
cd "$(dirname "$0")"

# Activate virtual environment if it exists, create it if it doesn't
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python -m venv venv
fi

source venv/bin/activate

# Install or upgrade pip
pip install --upgrade pip

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r backend/requirements.txt

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd task-management-web
npm install
cd ..

# Start the backend server
echo "Starting backend server..."
python backend/app.py &
BACKEND_PID=$!

# Start the frontend development server
echo "Starting frontend development server..."
cd task-management-web
npm start &
FRONTEND_PID=$!

# Function to kill processes on script exit
cleanup() {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
}

# Set up trap to call cleanup function on script exit
trap cleanup EXIT

# Wait for user input to stop the servers
echo "Press CTRL+C to stop the servers."
wait
