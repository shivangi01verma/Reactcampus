const asyncHandler = require('../middlewares/asyncHandler');
const discussionService = require('../services/discussion.service');
const ApiResponse = require('../utils/ApiResponse');

const submitDiscussion = asyncHandler(async (req, res) => {
  const discussion = await discussionService.submitDiscussion(req.body, req.user?._id);
  ApiResponse.created(res, 'Discussion submitted successfully', discussion);
});

const getDiscussions = asyncHandler(async (req, res) => {
  const result = await discussionService.getDiscussions(req.query, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  });
  ApiResponse.paginated(res, 'Discussions retrieved successfully', result);
});

const getDiscussionById = asyncHandler(async (req, res) => {
  const discussion = await discussionService.getDiscussionById(req.params.id);
  ApiResponse.success(res, 'Discussion retrieved successfully', discussion);
});

const moderateDiscussion = asyncHandler(async (req, res) => {
  const discussion = await discussionService.moderateDiscussion(req.params.id, req.body, req.user._id);
  ApiResponse.success(res, 'Discussion moderated successfully', discussion);
});

const deleteDiscussion = asyncHandler(async (req, res) => {
  await discussionService.deleteDiscussion(req.params.id, req.user._id);
  ApiResponse.success(res, 'Discussion deleted successfully');
});

module.exports = {
  submitDiscussion,
  getDiscussions,
  getDiscussionById,
  moderateDiscussion,
  deleteDiscussion,
};
