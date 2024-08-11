import React, { useState } from 'react';
import { Task } from '../types';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('New');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, status, priority, dueDate });
    setTitle('');
    setDescription('');
    setStatus('New');
    setPriority('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-6 bg-background border border-border rounded-lg shadow-lg">
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-btn-background"
        />
      </div>
      <div className="mb-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-btn-background"
          rows={3}
        />
      </div>
      <div className="mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-btn-background"
        >
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          placeholder="Priority"
          className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-btn-background"
        />
      </div>
      <div className="mb-6">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-btn-background"
        />
      </div>
      <button type="submit" className="w-full p-3 bg-btn-background text-foreground rounded-md hover:bg-btn-background-hover transition duration-300">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
