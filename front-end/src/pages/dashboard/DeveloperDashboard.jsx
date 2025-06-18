import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../features/tasks/tasksThunks';
import { fetchProjects } from '../../features/projects/projectsThunks';
import { Grid, Typography } from '@mui/material';
import TaskItem from '../../components/tasks/TaskItem';

const DeveloperDashboard = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            My Tasks
          </Typography>
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            My Projects
          </Typography>
          {projects.map((project) => (
            <div key={project._id}>{project.name}</div>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default DeveloperDashboard;