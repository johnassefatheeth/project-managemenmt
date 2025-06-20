import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import milestoneReducer from "./slices/milestoneSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    milestones: milestoneReducer
  },
});

export default store;