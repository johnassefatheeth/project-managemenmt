import api from './index';

export const register = (userData) => api.post('/auth/signup', userData);
export const login = (credentials) => api.post('/auth/login', credentials);