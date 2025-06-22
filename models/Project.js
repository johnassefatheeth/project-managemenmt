const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a project name"],
    },
    description: {
      type: String,
      required: [true, "Please provide a project description"],
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please provide an end date"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    teamMembers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "on_hold"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  // ADD THIS: Options to include virtuals when converting to JSON
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ADD THIS: Virtual populate to fetch milestones
projectSchema.virtual("milestones", {
  ref: "Milestone", // The model to look into
  foreignField: "project", // The field in the Milestone model
  localField: "_id", // The field in the Project model
});

// Your existing virtual property for progress will now work correctly
// once 'milestones' is populated.
projectSchema.virtual("progress").get(function () {
  // The 'this.milestones' array will be available after you .populate('milestones')
  if (!this.milestones || this.milestones.length === 0) return 0;
  const completed = this.milestones.filter(
    (m) => m.status === "Done"
  ).length;
  return (completed / this.milestones.length) * 100;
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;