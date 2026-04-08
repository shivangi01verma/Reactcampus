const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const User = require('../models/User.model');
const RefreshToken = require('../models/RefreshToken.model');
const ApiError = require('../utils/ApiError');
const permissionCache = require('../permissions/permissionCache');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateAccessToken = (userId) =>
  jwt.sign({ sub: userId }, config.jwt.secret, { expiresIn: config.jwt.accessExpiry });

const generateRefreshToken = async (userId, family = null) => {
  const raw = uuidv4();
  const tokenFamily = family || uuidv4();

  await RefreshToken.create({
    tokenHash: hashToken(raw),
    user: userId,
    family: tokenFamily,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { token: raw, family: tokenFamily };
};

const register = async ({ firstName, lastName, email, password }) => {
  const exists = await User.exists({ email });
  if (exists) throw new ApiError(409, 'Email already registered');

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash: password,
  });

  const accessToken = generateAccessToken(user._id);
  const refresh = await generateRefreshToken(user._id);

  return {
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    accessToken,
    refreshToken: refresh.token,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (!user.isActive) throw new ApiError(403, 'Account deactivated');

  const valid = await user.comparePassword(password);
  if (!valid) throw new ApiError(401, 'Invalid credentials');

  const accessToken = generateAccessToken(user._id);
  const refresh = await generateRefreshToken(user._id);

  return {
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    accessToken,
    refreshToken: refresh.token,
  };
};

const refresh = async (refreshTokenRaw) => {
  const hash = hashToken(refreshTokenRaw);
  const stored = await RefreshToken.findOne({ tokenHash: hash });

  if (!stored || stored.isRevoked) {
    // Possible token reuse attack — revoke entire family
    if (stored) {
      await RefreshToken.updateMany({ family: stored.family }, { isRevoked: true });
    }
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (stored.expiresAt < new Date()) {
    throw new ApiError(401, 'Refresh token expired');
  }

  // Rotate: revoke old, issue new
  stored.isRevoked = true;
  await stored.save();

  const user = await User.findById(stored.user);
  if (!user || !user.isActive) throw new ApiError(401, 'User not found or deactivated');

  const accessToken = generateAccessToken(user._id);
  const newRefresh = await generateRefreshToken(user._id, stored.family);

  return { accessToken, refreshToken: newRefresh.token };
};

const logout = async (refreshTokenRaw) => {
  if (!refreshTokenRaw) return;
  const hash = hashToken(refreshTokenRaw);
  const stored = await RefreshToken.findOne({ tokenHash: hash });
  if (stored) {
    await RefreshToken.updateMany({ family: stored.family }, { isRevoked: true });
  }
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) throw new ApiError(404, 'User not found');

  const valid = await user.comparePassword(currentPassword);
  if (!valid) throw new ApiError(400, 'Current password is incorrect');

  user.passwordHash = newPassword;
  await user.save();

  // Revoke all refresh tokens
  await RefreshToken.updateMany({ user: userId }, { isRevoked: true });
  permissionCache.invalidate(userId);

  return true;
};

module.exports = { register, login, refresh, logout, changePassword };
