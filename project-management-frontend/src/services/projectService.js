import api from './api';

export const projectService = {
  getAllProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProjectById: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  createProject: async (projectData) => {
    // Process team members if provided as comma-separated string
    if (projectData.teamMembers && typeof projectData.teamMembers === 'string') {
      projectData.teamMembers = projectData.teamMembers
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);
    }

    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (projectId, projectData) => {
    const response = await api.patch(`/projects/${projectId}`, projectData);
    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  addTeamMember: async (projectId, userId) => {
    const response = await api.post(`/projects/${projectId}/members`, { userId });
    return response.data;
  },

  removeTeamMember: async (projectId, userId) => {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  },
};