const paginate = async (model, query = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };

  const [docs, total] = await Promise.all([
    model.find(query).sort(sort).skip(skip).limit(limit).select(options.select || '').populate(options.populate || ''),
    model.countDocuments(query),
  ]);

  return {
    docs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const cursorPaginate = async (model, query = {}, options = {}) => {
  const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 20));
  const sort = options.sort || { _id: -1 };

  if (options.cursor) {
    const sortField = Object.keys(sort)[0];
    const direction = Object.values(sort)[0] === -1 ? '$lt' : '$gt';
    query[sortField] = { [direction]: options.cursor };
  }

  const docs = await model
    .find(query)
    .sort(sort)
    .limit(limit + 1)
    .select(options.select || '')
    .populate(options.populate || '');

  const hasMore = docs.length > limit;
  if (hasMore) docs.pop();

  const nextCursor = hasMore && docs.length > 0 ? docs[docs.length - 1]._id : null;

  return {
    docs,
    pagination: { limit, hasMore, nextCursor },
  };
};

module.exports = { paginate, cursorPaginate };
