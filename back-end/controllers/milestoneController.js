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

  try {
    // 1. Log the object you are about to create
    const dataToCreate = {
      ...req.body,
      project: req.params.projectId,
      createdBy: req.user.id,
    };

    console.log("Attempting to create milestone with this data:", dataToCreate);

    // 2. Await the creation
    const milestone = await Milestone.create(dataToCreate);

    // This will only run if creation is successful
    res.status(201).json({
      status: "success",
      data: {
        milestone,
      },
    });
  } catch (error) {
    // 3. This will catch the specific error from Milestone.create()
    console.error("!!! ERROR CREATING MILESTONE !!!", error);

    // Send a detailed error response back to the client
    return next(new AppError(`Milestone creation failed: ${error.message}`, 500));
  }
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
  // 1. Get projectId from URL params
  const { projectId } = req.params.projectId;
  const { milestones } = req.body;

  console.log(`Reordering milestones for project: ${projectId}`);

  if (!milestones || !Array.isArray(milestones)) {
    return next(
      new AppError(
        "Please provide an array of milestones with their new order",
        400
      )
    );
  }

  // 2. Find the project and verify user authorization
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  // Check if user is project manager or team member
  if (
    !project.createdBy.equals(req.user.id) &&
    !project.teamMembers.some((member) => member.equals(req.user.id))
  ) {
    return next(
      new AppError(
        "You are not authorized to modify milestones for this project",
        403
      )
    );
  }

  // 3. Enhance security in bulk operation by adding projectId to the filter
  const bulkOps = milestones.map((milestone) => ({
    updateOne: {
      filter: {
        _id: milestone.id, // Mongoose can cast 'id' to '_id'
        project: projectId, // IMPORTANT: Ensures we only update milestones of this project
      },
      update: { $set: { order: milestone.order } },
    },
  }));

  // 4. Perform the bulk write operation
  const result = await Milestone.bulkWrite(bulkOps);

  // Optional: Check if all operations were successful
  if (result.nModified !== milestones.length) {
    console.warn(
      "Warning: Not all milestones were found or updated. This could be due to invalid milestone IDs for the given project."
    );
  }

  res.status(200).json({
    status: "success",
    message: "Milestones reordered successfully",
  });
});