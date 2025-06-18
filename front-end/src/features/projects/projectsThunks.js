import { setProjects, setCurrentProject } from './projectsSlice';
import * as api from '../../api/projects';

export const fetchProjects = () => async (dispatch) => {
  try {
    const { data } = await api.getProjects();
    dispatch(setProjects(data));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }
};

export const fetchProjectDetails = (id) => async (dispatch) => {
  try {
    const { data } = await api.getProject(id);
    dispatch(setCurrentProject(data));
  } catch (error) {
    console.error('Failed to fetch project:', error);
  }
};