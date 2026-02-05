const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const { createTaskLimiter } = require('../middleware/rateLimiter');
const { 
  validate, 
  createTaskSchema, 
  updateTaskSchema,
  updateTaskStatusSchema 
} = require('../utils/validation');

/**
 * @route   POST /tasks
 * @desc    Create a new task
 * @access  Private (authenticated users only)
 */
router.post(
  '/',
  authenticate,
  createTaskLimiter,
  validate(createTaskSchema),
  taskController.createTask
);

/**
 * @route   GET /tasks
 * @desc    Get all tasks for logged-in user
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  taskController.getAllTasks
);

/**
 * @route   GET /tasks/:id
 * @desc    Get a specific task
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  taskController.getTaskById
);

/**
 * @route   PATCH /tasks/:id
 * @desc    Update task status
 * @access  Private (owner or admin)
 */
router.patch(
  '/:id',
  authenticate,
  validate(updateTaskStatusSchema),
  taskController.updateTaskStatus
);

/**
 * @route   PUT /tasks/:id
 * @desc    Update entire task
 * @access  Private (owner or admin)
 */
router.put(
  '/:id',
  authenticate,
  validate(updateTaskSchema),
  taskController.updateTask
);

/**
 * @route   DELETE /tasks/:id
 * @desc    Delete a task
 * @access  Private (owner or admin)
 */
router.delete(
  '/:id',
  authenticate,
  taskController.deleteTask
);

module.exports = router;
