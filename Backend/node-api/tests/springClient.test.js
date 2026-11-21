const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { SpringClient } = require('../src/clients/spring.client');

test('SpringClient performs GET request and parses JSON response', async () => {
  const mockServer = http.createServer((req, res) => {
    assert.equal(req.method, 'GET');
    assert.equal(req.url, '/api/internal/health');
    assert.equal(req.headers['accept'], 'application/json');
    assert.equal(req.headers['x-correlation-id'], 'test-corr-123');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      service: 'spring-service',
      message: 'Spring Boot service is reachable'
    }));
  });

  await new Promise((resolve) => mockServer.listen(0, '127.0.0.1', resolve));
  const port = mockServer.address().port;

  try {
    const client = new SpringClient(`http://127.0.0.1:${port}`);
    const data = await client.get('/api/internal/health', {
      correlationId: 'test-corr-123'
    });

    assert.equal(data.success, true);
    assert.equal(data.service, 'spring-service');
    assert.equal(data.message, 'Spring Boot service is reachable');
  } finally {
    mockServer.close();
  }
});

test('SpringClient forwards POST body and Authorization token', async () => {
  const mockServer = http.createServer((req, res) => {
    assert.equal(req.method, 'POST');
    assert.equal(req.url, '/api/v1/auth/test');
    assert.equal(req.headers['authorization'], 'Bearer sample-token-xyz');
    assert.equal(req.headers['content-type'], 'application/json');

    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      const payload = JSON.parse(raw);
      assert.equal(payload.sample, 'data');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, received: payload }));
    });
  });

  await new Promise((resolve) => mockServer.listen(0, '127.0.0.1', resolve));
  const port = mockServer.address().port;

  try {
    const client = new SpringClient(`http://127.0.0.1:${port}`);
    const result = await client.post('/api/v1/auth/test', { sample: 'data' }, {
      token: 'sample-token-xyz'
    });

    assert.equal(result.success, true);
    assert.equal(result.received.sample, 'data');
  } finally {
    mockServer.close();
  }
});

test('SpringClient properly handles timeout with SpringServiceError (HTTP 504)', async () => {
  const mockServer = http.createServer((req, res) => {
    // Deliberately do not respond, causing timeout
  });

  await new Promise((resolve) => mockServer.listen(0, '127.0.0.1', resolve));
  const port = mockServer.address().port;

  try {
    const client = new SpringClient(`http://127.0.0.1:${port}`, 100);
    await assert.rejects(
      async () => {
        await client.get('/slow-endpoint', { timeout: 100 });
      },
      (err) => {
        assert.equal(err.name, 'SpringServiceError');
        assert.equal(err.statusCode, 504);
        assert.match(err.message, /timed out/);
        return true;
      }
    );
  } finally {
    mockServer.close();
  }
});

test('SpringClient properly handles connection refused (HTTP 503)', async () => {
  // Using an unassigned port that immediately refuses connection
  const client = new SpringClient('http://127.0.0.1:59999');

  await assert.rejects(
    async () => {
      await client.get('/nonexistent');
    },
    (err) => {
      assert.equal(err.name, 'SpringServiceError');
      assert.equal(err.statusCode, 503);
      assert.match(err.message, /unavailable/);
      return true;
    }
  );
});

test('SpringClient properly handles downstream HTTP 400/500 errors', async () => {
  const mockServer = http.createServer((req, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      message: 'Requested clinical resource not found'
    }));
  });

  await new Promise((resolve) => mockServer.listen(0, '127.0.0.1', resolve));
  const port = mockServer.address().port;

  try {
    const client = new SpringClient(`http://127.0.0.1:${port}`);
    await assert.rejects(
      async () => {
        await client.get('/api/missing');
      },
      (err) => {
        assert.equal(err.name, 'SpringServiceError');
        assert.equal(err.statusCode, 404);
        assert.equal(err.message, 'Requested clinical resource not found');
        return true;
      }
    );
  } finally {
    mockServer.close();
  }
});
