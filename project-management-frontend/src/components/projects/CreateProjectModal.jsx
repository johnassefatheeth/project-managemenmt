import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { createProject } from '../../store/slices/projectSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.projects);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(createProject(data)).unwrap();
      toast.success('Project created successfully!');
      onClose();
      reset();
    } catch (error) {
      toast.error(error || 'Failed to create project');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              {...register('name', {
                required: 'Project name is required',
                minLength: {
                  value: 3,
                  message: 'Project name must be at least 3 characters',
                },
              })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter project name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter project description"
            />
          </div>

          <div>
            <label htmlFor="teamMembers" className="block text-sm font-medium text-gray-700 mb-1">
              Team Member IDs (Optional)
            </label>
            <input
              {...register('teamMembers')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter comma-separated user IDs"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter user IDs separated by commas (e.g., usr_123, usr_456)
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;