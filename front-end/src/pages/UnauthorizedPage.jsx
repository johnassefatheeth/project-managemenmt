import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="body1" paragraph>
        You don't have permission to access this page.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Go to Home
      </Button>
    </div>
  );
};

export default UnauthorizedPage;