import api from './index';

export const createTask = (taskData) => api.post('/tasks', taskData);
export const getTask = (id) => api.get(`/tasks/${id}`);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });
export const getMyTasks = () => api.get('/tasks/my-tasks');