const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(
    authController.restrictTo('project_manager'),
    projectController.createProject
  );

router
  .route('/:id')
  .get(projectController.getProject);

module.exports = router;