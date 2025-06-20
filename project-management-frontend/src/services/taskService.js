import api from './api';

export const taskService = {
  getAllTasks: async (milistoneId) => {
    const response = await api.get(`${milistoneId}/tasks`);
    return response.data;
  },

  getTaskById: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  getMyTasks: async () => {
    const response = await api.get('/tasks/my-tasks');
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.patch(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  assignTask: async (taskId, userId) => {
    const response = await api.patch(`/tasks/${taskId}/assign`, { userId });
    return response.data;
  },

  // Milestone related
  reorderMilestones: async (milestones) => {
    const response = await api.patch('/milestones', { milestones });
    return response.data;
  },
};