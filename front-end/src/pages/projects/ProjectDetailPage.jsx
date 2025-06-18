import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectDetails } from '../../features/projects/projectsThunks';
import { Typography, LinearProgress, List, ListItem } from '@mui/material';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjectDetails(id));
  }, [dispatch, id]);

  if (!currentProject) return <div>Loading...</div>;

  return (
    <div>
      <Typography variant="h4">{currentProject.name}</Typography>
      <LinearProgress 
        variant="determinate" 
        value={currentProject.progress} 
        sx={{ my: 2, height: 10 }}
      />
      <Typography variant="h6">Milestones</Typography>
      <List>
        {currentProject.milestones?.map((milestone) => (
          <ListItem key={milestone._id}>
            {milestone.name} - {milestone.status}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ProjectDetailPage;