class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) this.data = data;
  }

  static success(res, message, data, statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
  }

  static created(res, message, data) {
    return ApiResponse.success(res, message, data, 201);
  }

  static paginated(res, message, { docs, pagination }) {
    return res.status(200).json({
      success: true,
      message,
      data: docs,
      pagination,
    });
  }
}

module.exports = ApiResponse;
