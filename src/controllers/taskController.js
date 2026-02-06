const Task = require('../models/Task');
const { 
  sendSuccess, 
  sendCreated, 
  sendNotFound,
  sendForbidden,
  sendBadRequest
} = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.validatedBody;
  const userId = req.user._id;

  const task = await Task.create({
    title,
    description,
    status,
    userId
  });

  sendCreated(res, { task }, 'Task created successfully');
});

const getAllTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status } = req.query;

  const filters = {};
  if (status) {
    filters.status = status;
  }

  const tasks = await Task.findAll(userId, filters);

  sendSuccess(res, 200, { 
    tasks,
    count: tasks.length 
  }, 'Tasks retrieved successfully');
});

const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    return sendNotFound(res, 'Task not found');
  }

  // Check if user is owner or admin
  const isOwner = task.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return sendForbidden(res, 'You do not have permission to view this task');
  }

  sendSuccess(res, 200, { task }, 'Task retrieved successfully');
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.validatedBody;

  const task = await Task.findById(id);

  if (!task) {
    return sendNotFound(res, 'Task not found');
  }

  // Check ownership or admin
  const isOwner = task.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return sendForbidden(res, 'You do not have permission to update this task');
  }

  const updatedTask = await Task.updateStatus(id, status);

  sendSuccess(res, 200, { task: updatedTask }, 'Task status updated successfully');
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.validatedBody;

  const task = await Task.findById(id);

  if (!task) {
    return sendNotFound(res, 'Task not found');
  }

  // Check ownership or admin
  const isOwner = task.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return sendForbidden(res, 'You do not have permission to update this task');
  }

  const updatedTask = await Task.update(id, updateData);

  sendSuccess(res, 200, { task: updatedTask }, 'Task updated successfully');
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    return sendNotFound(res, 'Task not found');
  }

  // Check ownership or admin
  const isOwner = task.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return sendForbidden(res, 'You do not have permission to delete this task');
  }

  await Task.delete(id);

  sendSuccess(res, 200, null, 'Task deleted successfully');
});

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  updateTask,
  deleteTask
};
