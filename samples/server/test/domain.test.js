import test from 'node:test';
import assert from 'node:assert/strict';
import { journeyPhase, normalizeSchedule } from '../src/domain.js';

test('journey is boarding before delayed departure', () => {
  assert.equal(
    journeyPhase({ scheduledDeparture: 1_000, delayMinutes: 5, now: 1_299 }),
    'boarding',
  );
});

test('journey becomes running exactly at delayed departure', () => {
  assert.equal(
    journeyPhase({ scheduledDeparture: 1_000, delayMinutes: 5, now: 1_300 }),
    'running',
  );
});

test('schedule normalization advances timestamps across midnight', () => {
  const result = normalizeSchedule([
    { stationName: 'A', arrival: 86_300, departure: 86_340 },
    { stationName: 'B', arrival: 120, departure: 180 },
  ]);
  assert.deepEqual(result.map((stop) => [stop.arrival, stop.departure]), [
    [86_300, 86_340],
    [86_520, 86_580],
  ]);
});
