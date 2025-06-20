import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, TrendingUp, MoreVertical } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link
            to={`/projects/${project._id}`}
            className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
          >
            {project.name}
          </Link>
          {project.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status || 'active'}
        </span>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-green-600">
            {project.progress || 0}%
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${project.progress || 0}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{project.teamMembers?.length || 0} members</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          to={`/projects/${project._id}`}
          className="text-primary-600 hover:text-primary-500 font-medium text-sm"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;