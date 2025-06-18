import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../features/tasks/tasksThunks';
import TaskItem from '../../components/tasks/TaskItem';
import { List, Typography } from '@mui/material';

const MyTasksPage = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Tasks
      </Typography>
      <List>
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </List>
    </div>
  );
};

export default MyTasksPage;