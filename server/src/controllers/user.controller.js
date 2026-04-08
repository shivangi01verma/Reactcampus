const asyncHandler = require('../middlewares/asyncHandler');
const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  ApiResponse.created(res, 'User created successfully', user);
});

const getUsers = asyncHandler(async (req, res) => {
  const { search, isActive, role, page, limit, sort } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (role) {
    filter.roles = role;
  }

  const result = await userService.getUsers(filter, {
    page,
    limit,
    sort,
    populate: 'roles',
  });

  ApiResponse.paginated(res, 'Users retrieved successfully', result);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  ApiResponse.success(res, 'User retrieved successfully', user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  ApiResponse.success(res, 'User updated successfully', user);
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  ApiResponse.success(res, 'User deleted successfully');
});

const activateUser = asyncHandler(async (req, res) => {
  const user = await userService.activateUser(req.params.id, req.body.isActive);
  ApiResponse.success(res, 'User activation status updated', user);
});

const assignRoles = asyncHandler(async (req, res) => {
  const user = await userService.assignRoles(req.params.id, req.body.roles, req.permissions);
  ApiResponse.success(res, 'Roles assigned successfully', user);
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  assignRoles,
};
