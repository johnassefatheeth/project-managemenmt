import React, { useState, useEffect } from "react"; // Import useEffect
import { useDispatch, useSelector } from "react-redux"; // 1. Import useSelector
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CheckCircle,
  Circle,
  GripVertical,
  Calendar,
  Target,
} from "lucide-react";
// 2. BUG FIX: Import from milestoneSlice, not taskSlice
import { reorderMilestones } from "../../store/slices/milestoneSlice";
import toast from "react-hot-toast";

// SortableMilestone sub-component does not need any changes
const SortableMilestone = ({ milestone }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Target className="w-5 h-5 text-blue-500" />;
        case 'Not Started':
            return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-4 p-4 border rounded-lg ${getStatusColor(milestone.status)} ${
        isDragging ? 'shadow-lg' : 'hover:shadow-sm'
      } transition-shadow`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex-shrink-0">
        {getStatusIcon(milestone.status)}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{milestone.name}</h3>
        {milestone.description && (
          <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
        )}
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          {milestone.dueDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {milestone.tasks && (
            <span>{milestone.tasks.length} tasks</span>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          milestone.status === 'completed' 
            ? 'bg-green-100 text-green-800'
            : milestone.status === 'in_progress'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {milestone.status?.replace('_', ' ') || 'pending'}
        </span>
      </div>
    </div>
  );
};

// 3. Remove the `milestones` prop from the function signature
const MilestoneList = () => {
  // 4. Get the milestones directly from the Redux store
  const { milestones } = useSelector((state) => state.milestones);
  const [items, setItems] = useState(milestones);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      try {
        const reorderedData = newItems.map((milestone, index) => ({
          id: milestone._id,
          order: index,
        }));

        await dispatch(reorderMilestones(reorderedData)).unwrap();
        toast.success("Milestones reordered successfully!");
      } catch (error) {
        setItems(items); // Revert on error
        console.error("Failed to reorder milestones:", error);
        toast.error("Failed to reorder milestones");
      }
    }
  };

  // 5. Use useEffect to sync local state when Redux state changes
  useEffect(() => {
    // Sort milestones by order before setting them to ensure consistency
    const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);
    setItems(sortedMilestones);
  }, [milestones]);

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No milestones defined for this project</p>
        <p className="text-sm text-gray-400 mt-2">
          Click "Add Milestone" to get started.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((milestone) => (
            <SortableMilestone key={milestone._id} milestone={milestone} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default MilestoneList;