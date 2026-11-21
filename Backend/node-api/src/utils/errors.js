class HttpError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class SpringServiceError extends HttpError {
  constructor(message, statusCode = 503, details = null, isConnectionFailure = false) {
    super(message, statusCode, details);
    this.name = 'SpringServiceError';
    this.isConnectionFailure = isConnectionFailure;
  }
}

module.exports = {
  HttpError,
  SpringServiceError
};
