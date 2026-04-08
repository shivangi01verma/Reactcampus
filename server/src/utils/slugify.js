const slugifyLib = require('slugify');

const generateSlug = (text) =>
  slugifyLib(text, { lower: true, strict: true, trim: true });

const ensureUniqueSlug = async (model, text, existingId = null) => {
  let slug = generateSlug(text);
  let counter = 0;
  let candidate = slug;

  while (true) {
    const query = { slug: candidate };
    if (existingId) query._id = { $ne: existingId };
    const exists = await model.exists(query);
    if (!exists) return candidate;
    counter++;
    candidate = `${slug}-${counter}`;
  }
};

module.exports = { generateSlug, ensureUniqueSlug };
