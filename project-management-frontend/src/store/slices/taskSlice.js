import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyTasks = createAsyncThunk(
  "tasks/fetchMyTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tasks/my-tasks");
      console.log("Fetched tasks:", response.data.data.tasks);
      return response.data.data.tasks;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const reorderMilestones = createAsyncThunk(
  'tasks/reorderMilestones',
  async (milestones, { rejectWithValue }) => {
    try {
      const response = await api.patch('/milestones', { milestones });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateTaskLocal: (state, action) => {
      const { taskId, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task._id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.isLoading = false;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex(task => task._id === action.payload._id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload;
        }
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

export const { clearError, updateTaskLocal } = taskSlice.actions;
export default taskSlice.reducer;