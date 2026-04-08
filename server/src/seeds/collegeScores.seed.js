const fs = require('fs');
const path = require('path');
const College = require('../models/College.model');
const logger = require('../config/logger');

const seedCollegeScores = async () => {
  const scoresPath = path.join(__dirname, '../../../data-analysis/outputs/college_scores.json');

  if (!fs.existsSync(scoresPath)) {
    logger.info('No college_scores.json found — skipping score seeding');
    return;
  }

  const scores = JSON.parse(fs.readFileSync(scoresPath, 'utf8'));
  let updated = 0;

  for (const entry of scores) {
    const result = await College.updateOne(
      { slug: entry.slug, deletedAt: null },
      {
        $set: {
          score: entry.score,
          tier: entry.tier,
          scoreBreakdown: entry.breakdown,
        },
      }
    );
    if (result.modifiedCount > 0) updated++;
  }

  logger.info(`Seeded college scores: ${updated} updated out of ${scores.length} entries`);
};

module.exports = seedCollegeScores;
