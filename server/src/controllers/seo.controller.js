const asyncHandler = require('../middlewares/asyncHandler');
const seoService = require('../services/seo.service');
const ApiResponse = require('../utils/ApiResponse');

const createSEO = asyncHandler(async (req, res) => {
  const seo = await seoService.createSEO(req.body);
  ApiResponse.created(res, 'SEO entry created successfully', seo);
});

const getSEOEntries = asyncHandler(async (req, res) => {
  const result = await seoService.getSEOEntries(req.query, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  });
  ApiResponse.paginated(res, 'SEO entries retrieved successfully', result);
});

const getSEOById = asyncHandler(async (req, res) => {
  const seo = await seoService.getSEOById(req.params.id);
  ApiResponse.success(res, 'SEO entry retrieved successfully', seo);
});

const updateSEO = asyncHandler(async (req, res) => {
  const seo = await seoService.updateSEO(req.params.id, req.body);
  ApiResponse.success(res, 'SEO entry updated successfully', seo);
});

const deleteSEO = asyncHandler(async (req, res) => {
  await seoService.deleteSEO(req.params.id);
  ApiResponse.success(res, 'SEO entry deleted successfully');
});

module.exports = {
  createSEO,
  getSEOEntries,
  getSEOById,
  updateSEO,
  deleteSEO,
};
