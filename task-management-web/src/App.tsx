import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task } from './types';

const BACKEND_URL = 'http://localhost:5000';
const socket = io(BACKEND_URL);

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('task_created', (newTask: Task) => {
      console.log('New task received:', newTask);
      setTasks(prevTasks => {
        if (!prevTasks.some(task => task.id === newTask.id)) {
          return [...prevTasks, newTask];
        }
        return prevTasks;
      });
    });

    socket.on('task_updated', (updatedTask: Task) => {
      console.log('Updated task received:', updatedTask);
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      ));
    });

    socket.on('task_deleted', (deletedTaskId: number) => {
      console.log('Deleted task ID received:', deletedTaskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== deletedTaskId));
    });

    return () => {
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_deleted');
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched tasks:', data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskSubmit = async (newTask: Omit<Task, 'id'>) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }
      const createdTask = await response.json();
      console.log('Task created:', createdTask);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Task deleted:', taskId);
      // The task will be removed from the list when the WebSocket event is received
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Task Management</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <TaskForm onSubmit={handleTaskSubmit} />
          </div>
          <div className="md:w-2/3">
            <TaskList tasks={tasks} onTaskClick={handleTaskClick} onTaskDelete={handleTaskDelete} />
          </div>
        </div>
        {selectedTask && (
          <div className="mt-8 p-6 bg-background border border-border rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Selected Task</h2>
            <p className="mb-2"><strong>Title:</strong> {selectedTask.title}</p>
            <p className="mb-2"><strong>Status:</strong> {selectedTask.status}</p>
            <p className="mb-2"><strong>Description:</strong> {selectedTask.description || 'No description'}</p>
            <p className="mb-2"><strong>Priority:</strong> {selectedTask.priority || 'Not set'}</p>
            <p className="mb-2"><strong>Due Date:</strong> {selectedTask.dueDate || 'Not set'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
