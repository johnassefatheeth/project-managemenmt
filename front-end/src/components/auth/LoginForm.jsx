import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';

const LoginForm = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('email')} label="Email" fullWidth />
      <TextField {...register('password')} label="Password" type="password" fullWidth />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;