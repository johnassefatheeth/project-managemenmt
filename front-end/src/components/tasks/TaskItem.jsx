import { useState } from 'react';
import { 
  ListItem, 
  ListItemText, 
  Checkbox, 
  IconButton, 
  Menu, 
  MenuItem 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { changeTaskStatus } from '../../features/tasks/tasksThunks';

const TaskItem = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleStatusChange = (e) => {
    const newStatus = e.target.checked ? 'completed' : 'todo';
    dispatch(changeTaskStatus(task._id, newStatus));
  };

  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem>Edit</MenuItem>
            <MenuItem>Delete</MenuItem>
          </Menu>
        </>
      }
    >
      <Checkbox
        edge="start"
        checked={task.status === 'completed'}
        onChange={handleStatusChange}
      />
      <ListItemText
        primary={task.title}
        secondary={`Priority: ${task.priority}`}
      />
    </ListItem>
  );
};

export default TaskItem;