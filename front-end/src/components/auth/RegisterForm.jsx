import { useForm } from 'react-hook-form';
import { TextField, Button, Stack } from '@mui/material';
import { registerSchema } from '../../utils/validators';
import { yupResolver } from '@hookform/resolvers/yup';

const RegisterForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <TextField
          {...register('name')}
          label="Full Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />
        <TextField
          {...register('email')}
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />
        <TextField
          {...register('password')}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
        />
        <TextField
          {...register('role')}
          label="Role"
          select
          SelectProps={{ native: true }}
          fullWidth
        >
          <option value="developer">Developer</option>
          <option value="project_manager">Project Manager</option>
        </TextField>
        <Button type="submit" variant="contained">
          Register
        </Button>
      </Stack>
    </form>
  );
};

export default RegisterForm;