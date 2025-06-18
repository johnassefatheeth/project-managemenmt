import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/auth/authThunks';
import LoginForm from '../../components/auth/LoginForm';
import { Container, Typography } from '@mui/material';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (credentials) => {
    try {
      const resultAction = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/');
      }
    } catch (error) {
      // Error is already handled in the slice
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <LoginForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default LoginPage;