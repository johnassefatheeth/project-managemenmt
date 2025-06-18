import api from './index';

export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, updates) => api.patch(`/users/${id}`, updates);