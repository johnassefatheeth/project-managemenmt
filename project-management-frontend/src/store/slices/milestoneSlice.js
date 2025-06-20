import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Thunk to create a new milestone for a specific project
export const createMilestone = createAsyncThunk(
  "milestones/createMilestone",
  async ({ projectId, milestoneData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/${projectId}/milestones`,
        milestoneData
      );
      console.log("Milestone created:", response.data);
      // The backend returns the created milestone nested in the data object
      return response.data.data.milestone;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk to update an existing milestone
export const updateMilestone = createAsyncThunk(
  "milestones/updateMilestone",
  async ({ milestoneId, updateData }, { rejectWithValue }) => {
    try {
      // The API route for updating is /milestones/:id
      const response = await api.patch(
        `/${projectId}/milestones/${milestoneId}`,
        updateData
      );
      return response.data.data.milestone;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk to reorder milestones
export const reorderMilestones = createAsyncThunk(
  "milestones/reorderMilestones",
  async ({projectId,milestones}, { rejectWithValue }) => {
    try {
      // The API route for reordering is a PATCH to /milestones
      // The body should be { milestones: [...] }
      await api.patch(`/${projectId}/milestones`, { milestones });
      // The API doesn't return the updated list, only a success message.
      // So, we return the original input to the reducer to update the state.
      return milestones;
    } catch (error) {
        console.error("Error reordering milestones:", error);
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const milestoneSlice = createSlice({
  name: "milestones",
  initialState: {
    // This will hold the milestones for the currently viewed project
    milestones: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    // Synchronous action to set milestones when a project is loaded.
    // This is crucial for syncing state from the projectSlice.
    setMilestones: (state, action) => {
      state.milestones = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMilestone.fulfilled, (state, action) => {
        // Add the newly created milestone to our state array
        state.milestones.push(action.payload);
        state.isLoading = false;
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        // Find the updated milestone in the array and replace it
        const index = state.milestones.findIndex(
          (m) => m._id === action.payload._id
        );
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(reorderMilestones.fulfilled, (state, action) => {
        // Update the order of each milestone in the state based on the action payload
        action.payload.forEach((updatedMilestone) => {
          const existingMilestone = state.milestones.find(
            (m) => m._id === updatedMilestone.id
          );
          if (existingMilestone) {
            existingMilestone.order = updatedMilestone.order;
          }
        });
        // Sort the array by the new order to reflect the change in the UI
        state.milestones.sort((a, b) => a.order - b.order);
        state.isLoading = false;
      })
      // Use addMatcher for generic pending/rejected cases to reduce boilerplate
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

export const { setMilestones, clearError } = milestoneSlice.actions;
export default milestoneSlice.reducer;