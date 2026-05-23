class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static created(res, data, message = 'Created') {
    return ApiResponse.success(res, data, message, 201);
  }

  static paginated(res, { data, total, page, limit }, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      timestamp: new Date().toISOString(),
    });
  }

  static error(res, message, statusCode = 500, details = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    });
  }
}

export default ApiResponse;
