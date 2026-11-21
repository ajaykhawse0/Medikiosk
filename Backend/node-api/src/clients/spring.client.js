const env = require('../config/env');
const { SpringServiceError } = require('../utils/errors');

class SpringClient {
  constructor(baseUrl = env.SPRING_SERVICE_URL, defaultTimeout = env.SPRING_SERVICE_TIMEOUT) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Universal HTTP Request method for Spring Boot service.
   *
   * @param {string} method - HTTP Verb (GET, POST, PUT, PATCH, DELETE)
   * @param {string} endpoint - API path (e.g. '/api/internal/health')
   * @param {any} body - Optional payload for POST/PUT/PATCH
   * @param {object} options - Optional configuration (timeout, correlationId, token, headers)
   */
  async request(method, endpoint, body = null, options = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;
    const timeoutMs = options.timeout || this.defaultTimeout;

    const headers = {
      'Accept': 'application/json',
      ...options.headers
    };

    // Forward correlation ID for distributed tracing
    if (options.correlationId) {
      headers['X-Correlation-ID'] = options.correlationId;
    }

    // Forward Bearer authorization token if provided
    if (options.token) {
      headers['Authorization'] = options.token.startsWith('Bearer ') ? options.token : `Bearer ${options.token}`;
    }

    // Forward internal service-to-service key if configured
    if (env.SERVICE_API_KEY && !headers['X-Service-API-Key']) {
      headers['X-Service-API-Key'] = env.SERVICE_API_KEY;
    }

    const fetchOptions = {
      method: method.toUpperCase(),
      headers,
      signal: AbortSignal.timeout(timeoutMs)
    };

    if (body !== null && body !== undefined && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method)) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    let response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (err) {
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        throw new SpringServiceError(
          `Spring Boot request timed out after ${timeoutMs}ms`,
          504,
          { endpoint: cleanEndpoint, method: fetchOptions.method, code: 'GATEWAY_TIMEOUT' },
          true
        );
      }

      // Handle connection refused or host unreachable
      const isConnRefused =
        err.cause && (err.cause.code === 'ECONNREFUSED' || err.cause.code === 'ENOTFOUND' || err.cause.code === 'EHOSTUNREACH');

      const message = isConnRefused
        ? 'Spring Boot service is unavailable (connection refused)'
        : 'Failed to connect to Spring Boot service';

      throw new SpringServiceError(
        message,
        503,
        { endpoint: cleanEndpoint, method: fetchOptions.method, code: err.cause?.code || 'SERVICE_UNREACHABLE' },
        true
      );
    }

    // Parse JSON or text response safely
    let data = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new SpringServiceError(
          'Invalid JSON response received from Spring Boot service',
          502,
          { endpoint: cleanEndpoint, method: fetchOptions.method, code: 'INVALID_JSON_RESPONSE' }
        );
      }
    } else {
      const text = await response.text();
      data = text ? { raw: text } : null;
    }

    // Handle Spring Boot HTTP errors (4xx / 5xx)
    if (!response.ok) {
      const errorMsg =
        (data && (data.message || data.error)) || `Spring Boot service responded with status ${response.status}`;
      
      throw new SpringServiceError(
        errorMsg,
        response.status,
        { endpoint: cleanEndpoint, method: fetchOptions.method, response: data }
      );
    }

    return data;
  }

  get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  post(endpoint, body, options = {}) {
    return this.request('POST', endpoint, body, options);
  }

  put(endpoint, body, options = {}) {
    return this.request('PUT', endpoint, body, options);
  }

  patch(endpoint, body, options = {}) {
    return this.request('PATCH', endpoint, body, options);
  }

  delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }
}

const springClient = new SpringClient();

module.exports = {
  SpringClient,
  springClient
};
