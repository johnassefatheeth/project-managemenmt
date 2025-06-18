import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  currentProject: null,
  status: 'idle',
  error: null
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    }
  }
});

export const { setProjects, setCurrentProject, updateProject } = projectsSlice.actions;
export default projectsSlice.reducer;