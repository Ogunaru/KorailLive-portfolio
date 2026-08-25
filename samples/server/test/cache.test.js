import test from 'node:test';
import assert from 'node:assert/strict';
import { TTLCache } from '../src/cache.js';

test('fresh values are served from cache', async () => {
  let clock = 1_000;
  let loads = 0;
  const cache = new TTLCache({ ttlMs: 100, now: () => clock });

  const first = await cache.getOrLoad('train', async () => ++loads);
  clock += 50;
  const second = await cache.getOrLoad('train', async () => ++loads);

  assert.deepEqual(first, { value: 1, source: 'loader' });
  assert.deepEqual(second, { value: 1, source: 'cache' });
  assert.equal(loads, 1);
});

test('concurrent misses share one loader', async () => {
  let release;
  let loads = 0;
  const blocker = new Promise((resolve) => { release = resolve; });
  const cache = new TTLCache({ ttlMs: 100 });
  const loader = async () => {
    loads += 1;
    await blocker;
    return 'value';
  };

  const first = cache.getOrLoad('train', loader);
  const second = cache.getOrLoad('train', loader);
  release();

  const [a, b] = await Promise.all([first, second]);
  assert.equal(loads, 1);
  assert.deepEqual(a, b);
});
