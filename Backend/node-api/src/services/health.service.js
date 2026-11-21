const { springClient } = require('../clients/spring.client');

class HealthService {
  /**
   * Probes the Spring Boot service internal health endpoint.
   * Gracefully catches any connection errors or timeouts.
   *
   * @param {string} correlationId
   * @returns {Promise<{ status: 'up' | 'down', message: string }>}
   */
  async checkSpringHealth(correlationId) {
    try {
      const response = await springClient.get('/api/internal/health', { correlationId });
      
      if (response && response.success) {
        return {
          status: 'up',
          message: response.message || 'Spring Boot service is reachable'
        };
      }

      return {
        status: 'down',
        message: response?.message || 'Spring Boot service is unavailable'
      };
    } catch (err) {
      return {
        status: 'down',
        message: 'Spring Boot service is unavailable'
      };
    }
  }

  /**
   * Aggregates dependency health status.
   *
   * @param {string} correlationId
   * @returns {Promise<{ springService: { status: string, message: string } }>}
   */
  async checkDependencies(correlationId) {
    const springHealth = await this.checkSpringHealth(correlationId);
    return {
      springService: springHealth
    };
  }
}

const healthService = new HealthService();
module.exports = healthService;
