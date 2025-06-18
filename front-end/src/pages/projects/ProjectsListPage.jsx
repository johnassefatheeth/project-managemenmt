import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../features/projects/projectsThunks';
import { Grid, Typography } from '@mui/material';
import ProjectCard from '../../components/projects/ProjectCard';

const ProjectsListPage = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        All Projects
      </Typography>
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

export default ProjectsListPage;