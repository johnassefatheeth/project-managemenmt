import { useSelector } from 'react-redux';

export const useAuth = () => {
  return useSelector((state) => state.auth);
};

export const useProjects = () => {
  return useSelector((state) => state.projects);
};

export const useTasks = () => {
  return useSelector((state) => state.tasks);
};