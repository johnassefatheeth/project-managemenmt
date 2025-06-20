import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FolderOpen, Users, CheckSquare, TrendingUp, Plus } from 'lucide-react';
import { fetchProjects } from '../../store/slices/projectSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const ProjectManagerDashboard = () => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const stats = [
    {
      name: 'Total Projects',
      value: projects.length,
      icon: FolderOpen,
      color: 'bg-blue-500',
      href: '/projects',
    },
    {
      name: 'Active Projects',
      value: projects.filter(p => p.status === 'active').length,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'Team Members',
      value: projects.reduce((acc, p) => acc + (p.teamMembers?.length || 0), 0),
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Tasks',
      value: projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0),
      icon: CheckSquare,
      color: 'bg-orange-500',
    },
  ];

  const recentProjects = projects.slice(0, 5);

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
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-sm p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your projects today.
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
            {stat.href && (
              <div className="mt-4">
                <Link
                  to={stat.href}
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  View all →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 rounded-lg p-2">
                      <FolderOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">
                        {project.teamMembers?.length || 0} members • {project.progress || 0}% complete
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-primary-600 hover:text-primary-500 font-medium text-sm"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No projects yet</p>
              <Link
                to="/projects"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Project</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;