/**
 * Consistent JSON response utilities
 */

const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = 'Internal server error', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendSuccess(res, 201, data, message);
};

const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, 404, message);
};

const sendBadRequest = (res, message = 'Bad request', errors = null) => {
  return sendError(res, 400, message, errors);
};

const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, 401, message);
};

const sendForbidden = (res, message = 'Access forbidden') => {
  return sendError(res, 403, message);
};

module.exports = {
  sendSuccess,
  sendError,
  sendCreated,
  sendNotFound,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden
};
