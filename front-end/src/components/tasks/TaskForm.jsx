import { useForm } from 'react-hook-form';
import { TextField, Button, Stack, MenuItem } from '@mui/material';
import { PRIORITY_OPTIONS } from '../../utils/constants';
import { taskSchema } from '../../utils/validators';
import { yupResolver } from '@hookform/resolvers/yup';

const TaskForm = ({ onSubmit, initialData, milestones }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {},
    resolver: yupResolver(taskSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          {...register('title')}
          label="Task Title"
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
        />
        <TextField
          {...register('description')}
          label="Description"
          multiline
          rows={4}
          fullWidth
        />
        <TextField
          {...register('milestone')}
          label="Milestone"
          select
          fullWidth
        >
          {milestones.map((milestone) => (
            <MenuItem key={milestone._id} value={milestone._id}>
              {milestone.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          {...register('priority')}
          label="Priority"
          select
          fullWidth
        >
          {PRIORITY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained">
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </Stack>
    </form>
  );
};

export default TaskForm;