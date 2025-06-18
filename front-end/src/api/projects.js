import api from './index';

export const createProject = (projectData) => api.post('/projects', projectData);
export const getProject = (id) => api.get(`/projects/${id}`);
export const getProjects = () => api.get('/projects');
export const updateProject = (id, updates) => api.patch(`/projects/${id}`, updates);