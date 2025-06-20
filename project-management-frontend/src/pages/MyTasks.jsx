import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTasks } from "../store/slices/taskSlice";
import TaskItem from "../components/tasks/taskItem";
import LoadingSpinner from "../components/common/LoadingSpinner";

const taskStatuses = ["All", "To Do", "In Progress", "Done"];

const MyTasks = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const dispatch = useDispatch();
  const { myTasks, isLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch]);

  const filteredTasks =
    activeFilter === "All"
      ? myTasks
      : myTasks.filter((task) => task.status === activeFilter);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
      </div>

      {/* Filter Buttons */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {taskStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`${
                activeFilter === status
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
            >
              {status}
            </button>
          ))}
        </nav>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => <TaskItem key={task._id} task={task} />)
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              You have no tasks for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;