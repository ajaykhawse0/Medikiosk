const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

test('Node API liveness endpoint /api/v1/health returns HTTP 200', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/v1/health`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.service, 'node-api');
    assert.equal(body.status, 'up');
  } finally {
    server.close();
  }
});

test('Dependency health returns valid structure when Spring Boot is offline', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/v1/health/dependencies`);
    // When Spring Boot is not reachable, HTTP 503 is returned with success: false
    assert.ok(res.status === 200 || res.status === 503);

    const body = await res.json();
    assert.ok('dependencies' in body);
    assert.ok('springService' in body.dependencies);
    assert.ok(['up', 'down'].includes(body.dependencies.springService.status));
  } finally {
    server.close();
  }
});
