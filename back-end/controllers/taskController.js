const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createTask = catchAsync(async (req, res, next) => {
  const milestone = await Milestone.findById(req.params.milestoneId).populate('project');

  if (!milestone) {
    return next(new AppError('No milestone found with that ID', 404));
  }

  // Only project manager can create tasks
  if (!milestone.project.createdBy.equals(req.user.id)) {
    return next(new AppError('Only project managers can create tasks', 403));
  }

  const task = await Task.create({
    ...req.body,
    milestone: req.params.milestoneId,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      task
    }
  });
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