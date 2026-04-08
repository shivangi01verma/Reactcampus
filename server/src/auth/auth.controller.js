const authService = require('./auth.service');
const User = require('../models/User.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  ApiResponse.created(res, 'Registration successful', result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  ApiResponse.success(res, 'Login successful', result);
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  ApiResponse.success(res, 'Token refreshed', result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  ApiResponse.success(res, 'Logged out successfully');
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'roles',
    select: 'name displayName',
  });
  ApiResponse.success(res, 'Profile retrieved', { user, permissions: req.permissions });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(404, 'User not found');
  ApiResponse.success(res, 'Profile updated', user);
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  ApiResponse.success(res, 'Password changed successfully');
});

module.exports = { register, login, refreshToken, logout, me, updateProfile, changePassword };
