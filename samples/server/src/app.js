import { TTLCache } from './cache.js';
import { stations, trainLocation, trainSchedule, trainsAtStation } from './fixtures.js';

const stationCodePattern = /^\d{4}$/;
const trainNumberPattern = /^\d{1,5}$/;
const datePattern = /^\d{8}$/;

export function createApp({ now = () => 1_787_615_400 } = {}) {
  const trainCache = new TTLCache({ ttlMs: 60_000 });

  return async function app(request, response) {
    try {
      const url = new URL(request.url, 'http://localhost');

      if (request.method !== 'GET') {
        return sendJson(response, 405, { error: 'method not allowed' });
      }

      if (url.pathname === '/health') {
        return sendJson(response, 200, { status: 'ok' });
      }

      if (url.pathname === '/stations') {
        return sendJson(response, 200, { version: 1, stations });
      }

      if (url.pathname === '/trains') {
        const stationCode = requiredQuery(url, 'stationCode', stationCodePattern);
        const { value, source } = await trainCache.getOrLoad(
          stationCode,
          async () => trainsAtStation(stationCode, now()),
        );
        return sendJson(response, 200, {
          trains: value,
          fetchedAt: now(),
          cache: source,
        });
      }

      if (url.pathname === '/train-location') {
        const trainNumber = requiredQuery(url, 'trainNumber', trainNumberPattern);
        const location = trainLocation(trainNumber);
        return location
          ? sendJson(response, 200, location)
          : sendJson(response, 404, { error: 'sample train not found' });
      }

      if (url.pathname === '/train-schedule') {
        const trainNumber = requiredQuery(url, 'trainNumber', trainNumberPattern);
        const date = requiredQuery(url, 'date', datePattern);
        const company = requiredQuery(url, 'company', /^(K|S)$/);
        const schedule = trainSchedule(trainNumber, date, company);
        return schedule
          ? sendJson(response, 200, schedule)
          : sendJson(response, 404, { error: 'sample schedule not found' });
      }

      return sendJson(response, 404, { error: 'route not found' });
    } catch (error) {
      if (error instanceof RequestError) {
        return sendJson(response, 400, { error: error.message });
      }
      return sendJson(response, 500, { error: 'internal sample error' });
    }
  };
}

function requiredQuery(url, name, pattern) {
  const value = url.searchParams.get(name);
  if (!value || !pattern.test(value)) {
    throw new RequestError(`invalid ${name}`);
  }
  return value;
}

function sendJson(response, statusCode, body) {
  const payload = JSON.stringify(body);
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
  });
  response.end(payload);
}

class RequestError extends Error {}
