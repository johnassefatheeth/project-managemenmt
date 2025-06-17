const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a milestone name'],
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date'],
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Done'],
    default: 'Not Started',
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Milestone = mongoose.model('Milestone', milestoneSchema);
module.exports = Milestone;