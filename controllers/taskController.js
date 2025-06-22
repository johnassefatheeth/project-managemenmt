const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createTask = catchAsync(async (req, res, next) => {
  const { milestoneId} = req.body;
  const milestone = await Milestone.findById(milestoneId).populate(
    "project"
  );

  if (!milestone) {
    console.error("Milestone not found for ID:", req.params.milestoneId);
    return next(new AppError("No milestone found with that ID", 404));
  }

  if (!milestone.project.createdBy.equals(req.user.id)) {
    return next(new AppError("Only project managers can create tasks", 403));
  }

  // --- START DEBUGGING BLOCK ---
  try {
    // 1. Log the exact object you are trying to create
    const dataForTask = {
      ...req.body,
      milestone: req.body.milestoneId,
      createdBy: req.user.id,
    };
    console.log("Attempting to create task with this data:", dataForTask);

    // 2. Await the creation
    const task = await Task.create(dataForTask);

    // This part only runs if creation is successful
    res.status(201).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (error) {
    // 3. This will catch and log the specific Mongoose error
    console.error("!!! ERROR CREATING TASK !!!", error);

    // Send a detailed error response to the client
    return next(new AppError(`Task creation failed: ${error.message}`, 500));
  }
  // --- END DEBUGGING BLOCK ---
});

exports.updateTaskStatus = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate({
    path: 'milestone',
    populate: {
      path: 'project'
    }
  });

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  // Check if user is the assigned developer or project manager
  if (
    !task.assignedTo.equals(req.user.id) &&
    !task.milestone.project.createdBy.equals(req.user.id)
  ) {
    return next(new AppError('You are not authorized to update this task', 403));
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      task: updatedTask
    }
  });
});

exports.getUserTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ assignedTo: req.user.id })
    .populate('milestone createdBy')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks
    }
  });
});