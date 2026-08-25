import { createServer } from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

async function withServer(run) {
  const server = createServer(createApp());
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const { port } = server.address();
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

test('stations endpoint returns the versioned synthetic contract', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/stations`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.version, 1);
    assert.equal(body.stations.length, 3);
  });
});

test('train endpoint rejects malformed station codes', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/trains?stationCode=oops`);
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.error, 'invalid stationCode');
  });
});

test('location keeps confirmed and inferred fields separate', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/train-location?trainNumber=123`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.currentStation, '대전');
    assert.equal(body.nearestStation, '대전');
    assert.equal(typeof body.nearestStationDistanceKm, 'number');
  });
});
