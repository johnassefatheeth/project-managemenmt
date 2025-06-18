import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../features/projects/projectsThunks';
import ProjectCard from '../../components/projects/ProjectCard';
import { Grid, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manager Dashboard
      </Typography>
      <Button 
        component={Link} 
        to="/projects/new" 
        variant="contained" 
        sx={{ mb: 3 }}
      >
        Create New Project
      </Button>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ManagerDashboard;