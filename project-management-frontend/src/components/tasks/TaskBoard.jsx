import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateTaskStatus } from '../../store/slices/taskSlice';
import TaskCard from './TaskCard';
import SortableTaskCard from './SortableTaskCard';
import CreateTaskModal from './CreateTaskModal';
import { TASK_STATUSES } from '../../utils/constants';

const TaskBoard = ({ tasks = [], projectId }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = [
    { id: TASK_STATUSES.TODO, title: 'To Do', color: 'bg-gray-100' },
    { id: TASK_STATUSES.IN_PROGRESS, title: 'In Progress', color: 'bg-blue-100' },
    { id: TASK_STATUSES.COMPLETED, title: 'Completed', color: 'bg-green-100' },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const findContainer = (id) => {
    if (id in TASK_STATUSES || Object.values(TASK_STATUSES).includes(id)) {
      return id;
    }

    const task = tasks.find(task => task._id === id);
    return task ? task.status : null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    // Update task status when dragging over different container
    const newStatus = overContainer;
    dispatch(updateTaskStatus({ 
      taskId: active.id, 
      status: newStatus 
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    if (activeContainer !== overContainer) {
      dispatch(updateTaskStatus({ 
        taskId: active.id, 
        status: overContainer 
      }));
    }

    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find(task => task._id === activeId) : null;

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            
            return (
              <div key={column.id} className="flex flex-col">
                <div className={`${column.color} rounded-lg p-4 mb-4`}>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {column.title}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {columnTasks.length} tasks
                  </span>
                </div>

                <SortableContext
                  items={columnTasks.map(task => task._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex-1 space-y-3 p-2 rounded-lg min-h-[200px] border-2 border-dashed border-gray-200">
                    {columnTasks.map((task) => (
                      <SortableTaskCard key={task._id} task={task} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
};

export default TaskBoard;