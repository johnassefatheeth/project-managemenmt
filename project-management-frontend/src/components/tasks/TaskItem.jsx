import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Folder, Flag } from "lucide-react";

const getStatusClass = (status) => {
  switch (status) {
    case "To Do":
      return "bg-gray-200 text-gray-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Done":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const TaskItem = ({ task }) => {
  return (
    <Link
      to={`/projects/${task.project?._id}`}
      className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800 mb-2">{task.title}</h3>
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClass(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">{task.description}</p>
      <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Folder className="w-4 h-4 text-gray-400" />
          <span>{task.project?.name || "N/A"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Flag className="w-4 h-4 text-gray-400" />
          <span>{task.milestone?.title || "N/A"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>
            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TaskItem;