const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createMilestone = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);
  
  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  // Check if user is project manager or team member
  if (
    !project.createdBy.equals(req.user.id) &&
    !project.teamMembers.some(member => member.equals(req.user.id))
  ) {
    return next(new AppError('You are not authorized to add milestones to this project', 403));
  }

  const milestone = await Milestone.create({
    ...req.body,
    project: req.params.projectId,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      milestone
    }
  });
});

exports.updateMilestone = catchAsync(async (req, res, next) => {
  const milestone = await Milestone.findById(req.params.id).populate('project');

  if (!milestone) {
    return next(new AppError('No milestone found with that ID', 404));
  }

  // Check if user is project manager or team member
  if (
    !milestone.project.createdBy.equals(req.user.id) &&
    !milestone.project.teamMembers.some(member => member.equals(req.user.id))
  ) {
    return next(new AppError('You are not authorized to update this milestone', 403));
  }

  const updatedMilestone = await Milestone.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      milestone: updatedMilestone
    }
  });
});

exports.reorderMilestones = catchAsync(async (req, res, next) => {
  const { milestones } = req.body;
  
  if (!milestones || !Array.isArray(milestones)) {
    return next(new AppError('Please provide an array of milestones with their new order', 400));
  }

  const bulkOps = milestones.map(milestone => ({
    updateOne: {
      filter: { _id: milestone.id },
      update: { $set: { order: milestone.order } }
    }
  }));

  await Milestone.bulkWrite(bulkOps);

  res.status(200).json({
    status: 'success',
    message: 'Milestones reordered successfully'
  });
});