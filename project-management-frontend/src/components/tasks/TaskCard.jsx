import React from 'react';
import { Calendar, User, AlertCircle } from 'lucide-react';
import { PRIORITIES } from '../../utils/constants';

const TaskCard = ({ task, isDragging = false }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case PRIORITIES.HIGH:
        return 'bg-red-100 text-red-800';
      case PRIORITIES.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case PRIORITIES.LOW:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === PRIORITIES.HIGH) {
      return <AlertCircle className="w-3 h-3" />;
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${
      isDragging ? 'shadow-lg rotate-2' : ''
    }`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-900 text-sm leading-5">
          {task.title}
        </h4>
        <span
          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
            task.priority
          )}`}
        >
          {getPriorityIcon(task.priority)}
          <span>{task.priority}</span>
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        {task.assignee && (
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{task.assignee.name}</span>
          </div>
        )}
        
        {task.dueDate && (
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {task.milestone && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Milestone: {task.milestone.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;