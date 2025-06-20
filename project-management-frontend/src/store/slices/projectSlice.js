import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
// highlight-next-line
import { setMilestones } from "./milestoneSlice"; // 1. Import the action from the other slice

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/projects");
      return response.data.data.projects;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await api.post("/projects", projectData);
      return response.data.data?.project || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  "projects/fetchProjectDetails",
  // highlight-next-line
  async (projectId, { dispatch, rejectWithValue }) => {
    // 2. Add `dispatch` to the thunk arguments
    try {
      const response = await api.get(`/projects/${projectId}`);
      const project = response.data.data?.project || response.data;

      // highlight-start
      // 3. After fetching, dispatch the action to sync the milestone slice
      if (project && project.milestones) {
        dispatch(setMilestones(project.milestones));
      } else {
        // If there are no milestones, ensure the other slice is cleared
        dispatch(setMilestones([]));
      }
      // highlight-end

      return project; // Return the project for this slice's reducer
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
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
        state.projects = action.payload;
        state.isLoading = false;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        state.isLoading = false;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.currentProject = action.payload; // This part remains the same
        state.isLoading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearError } = projectSlice.actions;
export default projectSlice.reducer;