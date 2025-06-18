import { Card, CardContent, Typography, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Card sx={{ minWidth: 275, m: 2 }}>
      <CardContent>
        <Typography variant="h5" component={Link} to={`/projects/${project._id}`}>
          {project.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Progress: {project.progress}%
        </Typography>
        <div>
          {project.milestones?.map((milestone) => (
            <Chip
              key={milestone._id}
              label={milestone.name}
              color={milestone.status === 'Done' ? 'success' : 'default'}
              sx={{ mr: 1 }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;