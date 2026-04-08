const Category = require('../models/Category.model');
const { generateSlug } = require('../utils/slugify');
const logger = require('../config/logger');

const INITIAL_CATEGORIES = [
  { name: 'Engineering', icon: 'Wrench', order: 1 },
  { name: 'Medical', icon: 'Heart', order: 2 },
  { name: 'Management', icon: 'Briefcase', order: 3 },
  { name: 'Law', icon: 'Scale', order: 4 },
  { name: 'Arts', icon: 'Palette', order: 5 },
  { name: 'Science', icon: 'FlaskConical', order: 6 },
  { name: 'Commerce', icon: 'TrendingUp', order: 7 },
  { name: 'Pharmacy', icon: 'Pill', order: 8 },
  { name: 'Architecture', icon: 'Building', order: 9 },
  { name: 'Education', icon: 'GraduationCap', order: 10 },
];

const seedCategories = async () => {
  for (const cat of INITIAL_CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: generateSlug(cat.name) },
      { $setOnInsert: { name: cat.name, slug: generateSlug(cat.name), icon: cat.icon, order: cat.order, isActive: true } },
      { upsert: true, new: true }
    );
  }
  logger.info(`Seeded ${INITIAL_CATEGORIES.length} categories`);
};

module.exports = seedCategories;
