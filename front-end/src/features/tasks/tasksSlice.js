import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  currentTask: null,
  status: 'idle',
  error: null
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    }
  }
});

export const { setTasks, addTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;