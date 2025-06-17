const express = require('express');
const milestoneController = require('../controllers/milestoneController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .post(milestoneController.createMilestone)
  .patch(milestoneController.reorderMilestones);

router
  .route('/:id')
  .patch(milestoneController.updateMilestone);

module.exports = router;