const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .post(
    authController.restrictTo('project_manager'),
    taskController.createTask
  );

router
  .route('/:id/status')
  .patch(taskController.updateTaskStatus);

router
  .route('/my-tasks')
  .get(taskController.getUserTasks);

module.exports = router;