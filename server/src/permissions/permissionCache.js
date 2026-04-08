const { LRUCache } = require('lru-cache');

const cache = new LRUCache({
  max: 10000,
  ttl: 5 * 60 * 1000, // 5 minutes
});

const getPermissions = (userId) => cache.get(String(userId));

const setPermissions = (userId, permissions) =>
  cache.set(String(userId), permissions);

const invalidate = (userId) => cache.delete(String(userId));

const invalidateAll = () => cache.clear();

module.exports = { getPermissions, setPermissions, invalidate, invalidateAll };
