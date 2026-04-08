const College = require('../models/College.model');
const Review = require('../models/Review.model');

const getCollegeTypeDistribution = async () => {
  const result = await College.aggregate([
    { $match: { status: 'published', deletedAt: null } },
    { $group: { _id: '$type', value: { $sum: 1 } } },
    { $sort: { value: -1 } },
  ]);
  return result.map((r) => ({ name: r._id, value: r.value }));
};

const getCollegesByState = async () => {
  const result = await College.aggregate([
    { $match: { status: 'published', deletedAt: null } },
    { $group: { _id: '$location.state', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 15 },
  ]);
  return result.map((r) => ({ state: r._id, count: r.count }));
};

const getFeeAnalysisByType = async () => {
  const result = await College.aggregate([
    { $match: { status: 'published', deletedAt: null, 'fees.max': { $gt: 0 } } },
    {
      $group: {
        _id: '$type',
        avgMin: { $avg: '$fees.min' },
        avgMax: { $avg: '$fees.max' },
        count: { $sum: 1 },
      },
    },
    { $sort: { avgMax: -1 } },
  ]);
  return result.map((r) => ({
    type: r._id,
    avgMin: Math.round(r.avgMin),
    avgMax: Math.round(r.avgMax),
    count: r.count,
  }));
};

const getScoreDistribution = async () => {
  const result = await College.aggregate([
    { $match: { status: 'published', deletedAt: null, score: { $ne: null } } },
    {
      $bucket: {
        groupBy: '$score',
        boundaries: [0, 20, 40, 60, 80, 101],
        default: 'Other',
        output: { count: { $sum: 1 } },
      },
    },
  ]);
  const labels = ['0-20', '20-40', '40-60', '60-80', '80-100'];
  return result.map((r, i) => ({
    range: labels[i] || `${r._id}`,
    count: r.count,
  }));
};

const getTierBreakdown = async () => {
  const result = await College.aggregate([
    { $match: { status: 'published', deletedAt: null, tier: { $ne: null } } },
    { $group: { _id: '$tier', value: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return result.map((r) => ({ name: r._id, value: r.value }));
};

const getTopFacilities = async () => {
  const result = await College.aggregate([
    { $match: { status: 'published', deletedAt: null } },
    { $unwind: '$facilities' },
    { $group: { _id: '$facilities', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  return result.map((r) => ({ facility: r._id, count: r.count }));
};

const getPublicInsights = async () => {
  const [typeDistribution, byState, feeAnalysis, tierBreakdown, topFacilities] =
    await Promise.all([
      getCollegeTypeDistribution(),
      getCollegesByState(),
      getFeeAnalysisByType(),
      getTierBreakdown(),
      getTopFacilities(),
    ]);

  const totalColleges = await College.countDocuments({ status: 'published', deletedAt: null });

  return {
    totalColleges,
    typeDistribution,
    byState,
    feeAnalysis,
    tierBreakdown,
    topFacilities,
  };
};

const getFullAnalytics = async () => {
  const [typeDistribution, byState, feeAnalysis, scoreDistribution, tierBreakdown, topFacilities] =
    await Promise.all([
      getCollegeTypeDistribution(),
      getCollegesByState(),
      getFeeAnalysisByType(),
      getScoreDistribution(),
      getTierBreakdown(),
      getTopFacilities(),
    ]);

  const totalColleges = await College.countDocuments({ status: 'published', deletedAt: null });
  const statesCovered = await College.distinct('location.state', { status: 'published', deletedAt: null });

  return {
    totalColleges,
    statesCovered: statesCovered.length,
    typeDistribution,
    byState,
    feeAnalysis,
    scoreDistribution,
    tierBreakdown,
    topFacilities,
  };
};

module.exports = {
  getCollegeTypeDistribution,
  getCollegesByState,
  getFeeAnalysisByType,
  getScoreDistribution,
  getTierBreakdown,
  getTopFacilities,
  getPublicInsights,
  getFullAnalytics,
};
