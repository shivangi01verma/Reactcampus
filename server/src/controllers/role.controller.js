const asyncHandler = require('../middlewares/asyncHandler');
const roleService = require('../services/role.service');
const ApiResponse = require('../utils/ApiResponse');

const createRole = asyncHandler(async (req, res) => {
  const role = await roleService.createRole(req.body);
  ApiResponse.created(res, 'Role created successfully', role);
});

const getRoles = asyncHandler(async (req, res) => {
  const result = await roleService.getRoles(req.query, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  });
  ApiResponse.paginated(res, 'Roles retrieved successfully', result);
});

const getRoleById = asyncHandler(async (req, res) => {
  const role = await roleService.getRoleById(req.params.id);
  ApiResponse.success(res, 'Role retrieved successfully', role);
});

const updateRole = asyncHandler(async (req, res) => {
  const role = await roleService.updateRole(req.params.id, req.body);
  ApiResponse.success(res, 'Role updated successfully', role);
});

const deleteRole = asyncHandler(async (req, res) => {
  await roleService.deleteRole(req.params.id);
  ApiResponse.success(res, 'Role deleted successfully');
});

const assignPermissions = asyncHandler(async (req, res) => {
  const role = await roleService.assignPermissions(
    req.params.id,
    req.body.permissions,
    req.permissions
  );
  ApiResponse.success(res, 'Permissions assigned successfully', role);
});

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissions,
};
