import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../features/users/usersThunks';
import { Typography, Paper, Avatar } from '@mui/material';

const UserProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  if (!currentUser) return <div>Loading...</div>;

  return (
    <Paper sx={{ p: 3 }}>
      <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
        {currentUser.name.charAt(0)}
      </Avatar>
      <Typography variant="h4">{currentUser.name}</Typography>
      <Typography variant="subtitle1">{currentUser.email}</Typography>
      <Typography variant="body1">
        Role: {currentUser.role}
      </Typography>
      <Typography variant="body1">
        Projects Assigned: {currentUser.projects_assigned}
      </Typography>
    </Paper>
  );
};

export default UserProfilePage;