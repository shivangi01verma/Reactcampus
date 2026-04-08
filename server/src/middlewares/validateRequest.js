const ApiError = require('../utils/ApiError');

const validateRequest = (schema) => (req, _res, next) => {
  const toValidate = {};
  if (schema.body) toValidate.body = req.body;
  if (schema.params) toValidate.params = req.params;
  if (schema.query) toValidate.query = req.query;

  const combined = {};
  const errors = [];

  for (const [key, joiSchema] of Object.entries(schema)) {
    const { error, value } = joiSchema.validate(toValidate[key], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      errors.push(...error.details.map((d) => d.message));
    } else {
      combined[key] = value;
    }
  }

  if (errors.length) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  // Merge validated values back
  if (combined.body) req.body = combined.body;
  if (combined.params) req.params = combined.params;
  if (combined.query) req.query = combined.query;

  next();
};

module.exports = validateRequest;
