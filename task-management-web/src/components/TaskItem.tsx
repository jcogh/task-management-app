import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onClick: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <li
      className="p-4 bg-background border border-border rounded-lg shadow-md cursor-pointer hover:bg-opacity-80 transition duration-300 flex justify-between items-center"
      onClick={onClick}
    >
      <div>
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <p className="text-foreground-secondary">{task.status}</p>
      </div>
      <button
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700 text-foreground font-bold py-2 px-4 rounded-md transition duration-300"
      >
        Delete
      </button>
    </li>
  );
};

export default TaskItem;
