import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../features/auth/authThunks';
import RegisterForm from '../../components/auth/RegisterForm';
import { Container, Typography } from '@mui/material';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (userData) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      navigate('/login');
    } catch (error) {
      alert(`Registration failed: ${error}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Register New Account
      </Typography>
      <RegisterForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default RegisterPage;