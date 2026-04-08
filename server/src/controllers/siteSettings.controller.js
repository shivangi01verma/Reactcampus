const asyncHandler = require('../middlewares/asyncHandler');
const siteSettingsService = require('../services/siteSettings.service');
const ApiResponse = require('../utils/ApiResponse');

const getSiteSettings = asyncHandler(async (req, res) => {
  const settings = await siteSettingsService.getSiteSettings();
  ApiResponse.success(res, 'Site settings retrieved successfully', settings);
});

const updateSiteSettings = asyncHandler(async (req, res) => {
  const settings = await siteSettingsService.updateSiteSettings(req.body, req.user._id);
  ApiResponse.success(res, 'Site settings updated successfully', settings);
});

module.exports = {
  getSiteSettings,
  updateSiteSettings,
};
