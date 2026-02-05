const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { 
  sendSuccess, 
  sendCreated, 
  sendBadRequest, 
  sendUnauthorized 
} = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Register a new user
 * POST /auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.validatedBody;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return sendBadRequest(res, 'Email already registered');
  }

  const existingUsername = await User.findByUsername(username);
  if (existingUsername) {
    return sendBadRequest(res, 'Username already taken');
  }

  // Create user
  const user = await User.create({ username, email, password, role });

  // Generate token
  const token = generateToken(user._id, user.role);

  sendCreated(res, {
    user: User.sanitizeUser(user),
    token
  }, 'User registered successfully');
});

/**
 * Login user
 * POST /auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedBody;

  // Find user
  const user = await User.findByEmail(email);
  
  if (!user) {
    return sendUnauthorized(res, 'Invalid credentials');
  }

  // Check password
  const isPasswordValid = await User.comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    return sendUnauthorized(res, 'Invalid credentials');
  }

  // Update last login
  await User.updateLastLogin(user._id);

  // Generate token
  const token = generateToken(user._id, user.role);

  sendSuccess(res, 200, {
    user: User.sanitizeUser(user),
    token
  }, 'Login successful');
});

/**
 * Logout user
 * POST /auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  // Here we just send a success response
  // For session-based auth, you would destroy the session here
  
  sendSuccess(res, 200, null, 'Logout successful');
});

/**
 * Get current user profile
 * GET /me
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return sendUnauthorized(res, 'User not found');
  }

  sendSuccess(res, 200, {
    user: User.sanitizeUser(user)
  }, 'User profile retrieved successfully');
});

module.exports = {
  register,
  login,
  logout,
  getMe
};
