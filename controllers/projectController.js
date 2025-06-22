const Project = require('../models/Project');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createProject = catchAsync(async (req, res, next) => {
  const { name, description, startDate, endDate } = req.body;
  // Use 'let' to allow teamMembers to be reassigned.
  let { teamMembers } = req.body;

  // --- SOLUTION ---
  // Check if teamMembers is "falsy" (undefined, null, empty string)
  // or if it's an array containing just an empty string.
  if (
    !teamMembers ||
    teamMembers.length === 0 ||
    (Array.isArray(teamMembers) && teamMembers[0] === "")
  ) {
    // If so, assign it an empty array.
    teamMembers = [];
  }

  // This handles cases where teamMembers might be sent as a JSON string
  // from the client, e.g., "['id1', 'id2']".
  if (typeof teamMembers === "string") {
    try {
      teamMembers = JSON.parse(teamMembers);
      // After parsing, filter out any empty strings again just in case.
      teamMembers = teamMembers.filter((id) => id && id.trim() !== "");
    } catch (e) {
      // If it's not a JSON string, it might be a single ID.
      // We'll wrap it in an array. If it's an empty string, it becomes [].
      teamMembers = teamMembers.trim() ? [teamMembers] : [];
    }
  }

  const project = await Project.create({
    name,
    description,
    startDate,
    endDate,
    teamMembers, // Use the cleaned-up teamMembers array
    createdBy: req.user.id,
  });

  res.status(201).json({
    status: "success",
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
    .populate('teamMembers createdBy milestones');
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
