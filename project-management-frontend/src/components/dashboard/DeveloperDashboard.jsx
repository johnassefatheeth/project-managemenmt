import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CheckSquare, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { fetchProjects } from '../../store/slices/projectSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { TASK_STATUSES, PRIORITIES } from '../../utils/constants';

const DeveloperDashboard = () => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Debug: Log what projects actually is
  console.log('Projects:', projects, 'Type:', typeof projects, 'Is Array:', Array.isArray(projects));

  // Ensure projects is an array with more robust checking
  const projectsArray = Array.isArray(projects) ? projects : [];
  
  const myTasks = projectsArray.reduce((acc, project) => {
    const projectTasks = project.tasks?.filter(task => 
      task.assignee?._id === user?._id
    ) || [];
    return [...acc, ...projectTasks.map(task => ({ ...task, projectName: project.name }))];
  }, []);

  const stats = [
    {
      name: 'My Tasks',
      value: myTasks.length,
      icon: CheckSquare,
      color: 'bg-blue-500',
    },
    {
      name: 'In Progress',
      value: myTasks.filter(t => t.status === TASK_STATUSES.IN_PROGRESS).length,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Completed',
      value: myTasks.filter(t => t.status === TASK_STATUSES.COMPLETED).length,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'High Priority',
      value: myTasks.filter(t => t.priority === PRIORITIES.HIGH).length,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
  ];

  const recentTasks = myTasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case PRIORITIES.HIGH:
        return 'text-red-600 bg-red-100';
      case PRIORITIES.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case PRIORITIES.LOW:
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TASK_STATUSES.TODO:
        return 'text-gray-600 bg-gray-100';
      case TASK_STATUSES.IN_PROGRESS:
        return 'text-blue-600 bg-blue-100';
      case TASK_STATUSES.COMPLETED:
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-sm p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-green-100">
          You have {myTasks.filter(t => t.status !== TASK_STATUSES.COMPLETED).length} active tasks to work on.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">My Recent Tasks</h2>
            <Link
              to="/my-tasks"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recentTasks.length > 0 ? (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 rounded-lg p-2">
                      <CheckSquare className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-500">{task.projectName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  {task.dueDate && (
                    <div className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tasks assigned yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;