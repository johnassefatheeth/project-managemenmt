import { useForm } from 'react-hook-form';
import { TextField, Button, Stack, Autocomplete } from '@mui/material';
import { projectSchema } from '../../utils/validators';
import { yupResolver } from '@hookform/resolvers/yup';

const ProjectForm = ({ onSubmit, initialData, users }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialData || {},
    resolver: yupResolver(projectSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          {...register('name')}
          label="Project Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />
        <TextField
          {...register('description')}
          label="Description"
          multiline
          rows={4}
          fullWidth
        />
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(user) => user.name}
          renderInput={(params) => (
            <TextField {...params} label="Team Members" />
          )}
        />
        <Button type="submit" variant="contained" size="large">
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </Stack>
    </form>
  );
};

export default ProjectForm;