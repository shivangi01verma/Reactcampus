const asyncHandler = require('../middlewares/asyncHandler');
const permissionService = require('../services/permission.service');
const ApiResponse = require('../utils/ApiResponse');

const getPermissions = asyncHandler(async (req, res) => {
  const permissions = await permissionService.getPermissions(req.query);
  ApiResponse.success(res, 'Permissions retrieved successfully', permissions);
});

module.exports = {
  getPermissions,
};
