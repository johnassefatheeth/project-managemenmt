const Project = require('../models/Project');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createProject = catchAsync(async (req, res, next) => {
  const { name, description, startDate, endDate, teamMembers } = req.body;

  const project = await Project.create({
    name,
    description,
    startDate,
    endDate,
    teamMembers,
    createdBy: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({
    $or: [
      { createdBy: req.user.id },
      { teamMembers: { $in: [req.user.id] } },
    ],
  }).populate('teamMembers createdBy');

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects,
    },
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('teamMembers createdBy');
  console.log("Fetching project with ID:", req.params.id);

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  // Check if user is part of the project
  if (
    !project.teamMembers.some(member => member._id.equals(req.user.id)) &&
    !project.createdBy._id.equals(req.user.id)
  ) {
    return next(new AppError('You are not authorized to access this project', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});
