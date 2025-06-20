// src/utils/constants.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Project Management System';

export const ROLES = {
  PROJECT_MANAGER: 'project_manager',
  DEVELOPER: 'developer'
};

export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};