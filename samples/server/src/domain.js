const SECONDS_PER_DAY = 86_400;

export function journeyPhase({ scheduledDeparture, delayMinutes, now }) {
  assertEpochSeconds(scheduledDeparture, 'scheduledDeparture');
  assertEpochSeconds(now, 'now');
  if (!Number.isInteger(delayMinutes)) {
    throw new TypeError('delayMinutes must be an integer');
  }

  const delayedDeparture = scheduledDeparture + delayMinutes * 60;
  return now < delayedDeparture ? 'boarding' : 'running';
}

export function normalizeSchedule(stops) {
  let dayOffset = 0;
  let lastEpoch = null;

  const normalize = (value) => {
    if (value == null) return null;
    assertEpochSeconds(value, 'schedule timestamp');
    let candidate = value + dayOffset;
    if (lastEpoch != null && candidate < lastEpoch) {
      dayOffset += SECONDS_PER_DAY;
      candidate += SECONDS_PER_DAY;
    }
    lastEpoch = candidate;
    return candidate;
  };

  return stops.map((stop) => ({
    ...stop,
    arrival: normalize(stop.arrival),
    departure: normalize(stop.departure),
  }));
}

function assertEpochSeconds(value, label) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite epoch-second number`);
  }
}
