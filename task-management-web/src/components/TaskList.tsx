import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick, onTaskDelete }) => {
  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task)}
          onDelete={() => onTaskDelete(task.id)}
        />
      ))}
    </ul>
  );
};

export default TaskList;
