import { setTasks, addTask, updateTask } from './tasksSlice';
import * as api from '../../api/tasks';

export const fetchTasks = () => async (dispatch) => {
  try {
    const { data } = await api.getMyTasks();
    dispatch(setTasks(data));
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }
};

export const createNewTask = (taskData) => async (dispatch) => {
  try {
    const { data } = await api.createTask(taskData);
    dispatch(addTask(data));
  } catch (error) {
    console.error('Failed to create task:', error);
    throw error;
  }
};

export const changeTaskStatus = (taskId, status) => async (dispatch) => {
  try {
    const { data } = await api.updateTaskStatus(taskId, status);
    dispatch(updateTask(data));
  } catch (error) {
    console.error('Failed to update task:', error);
  }
};