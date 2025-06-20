import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectDetails } from '../store/slices/projectSlice';
import TaskBoard from '../components/tasks/TaskBoard';
import MilestoneList from '../components/milestones/MilestoneList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Calendar, Users, TrendingUp } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, isLoading } = useSelector((state) => state.projects);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetails(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Project not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentProject.name}
            </h1>
            {currentProject.description && (
              <p className="text-gray-600">{currentProject.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-green-600">
              {currentProject.progress || 0}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {currentProject.teamMembers?.length || 0} team members
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              Created {new Date(currentProject.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentProject.progress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Milestones</h2>
        <MilestoneList milestones={currentProject.milestones || []} />
      </div>

      {/* Task Board */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TaskBoard tasks={currentProject.tasks || []} projectId={id} />
      </div>
    </div>
  );
};

export default ProjectDetail;