import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects');
      // Extract the projects array from the nested response
      return response.data.data.projects;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await api.post('/projects', projectData);
      // Assuming create also returns nested structure, extract the project
      return response.data.data?.project || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  'projects/fetchProjectDetails',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      // Extract the project from the nested response
      return response.data.data?.project || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload; // Now this will be the projects array
        state.isLoading = false;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload); // Add the new project to the array
        state.isLoading = false;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.currentProject = action.payload; // Set the current project
        state.isLoading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearError } = projectSlice.actions;
export default projectSlice.reducer;