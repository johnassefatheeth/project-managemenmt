const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date'],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  teamMembers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  status: {
    type: String,
    enum: ['active', 'completed', 'on_hold'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

projectSchema.virtual('progress').get(function () {
  if (!this.milestones || this.milestones.length === 0) return 0;
  const completed = this.milestones.filter(m => m.status === 'Done').length;
  return (completed / this.milestones.length) * 100;
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;