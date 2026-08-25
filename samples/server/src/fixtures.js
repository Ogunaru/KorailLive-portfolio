import { journeyPhase, normalizeSchedule } from './domain.js';

const BASE_TIME = 1_787_615_400;

export const stations = Object.freeze([
  { code: '0001', name: '서울', line: '고속선', sortOrder: 1 },
  { code: '0002', name: '대전', line: '고속선', sortOrder: 2 },
  { code: '0003', name: '부산', line: '고속선', sortOrder: 3 },
]);

export function trainsAtStation(stationCode, now = BASE_TIME) {
  if (!stations.some((station) => station.code === stationCode)) return [];

  const scheduledDeparture = BASE_TIME + 900;
  const delayMinutes = 5;
  return [
    {
      trainId: 'sample-123',
      trainNumber: '123',
      stationCode,
      stationName: stations.find((station) => station.code === stationCode).name,
      destination: '부산',
      directionCode: 'D',
      scheduledDeparture,
      scheduledArrival: scheduledDeparture - 120,
      delayMinutes,
      platform: '7',
      status: journeyPhase({ scheduledDeparture, delayMinutes, now }),
    },
  ];
}

export function trainLocation(trainNumber) {
  if (trainNumber !== '123') return null;
  return {
    trainNumber,
    delayMinutes: 5,
    currentStation: '대전',
    nextStation: '부산',
    departureStation: '서울',
    arrivalStation: '부산',
    trainClassName: '고속열차',
    scheduledDeparture: BASE_TIME,
    scheduledArrival: BASE_TIME + 9_600,
    coordinates: { latitude: 36.3504, longitude: 127.3845 },
    nearestStation: '대전',
    nearestStationDistanceKm: 0.4,
  };
}

export function trainSchedule(trainNumber, date, company) {
  if (trainNumber !== '123') return null;
  const rawStops = [
    { stationName: '서울', arrival: null, departure: BASE_TIME, stopType: 'origin' },
    { stationName: '대전', arrival: BASE_TIME + 3_000, departure: BASE_TIME + 3_120, stopType: 'stop' },
    { stationName: '부산', arrival: BASE_TIME + 9_600, departure: null, stopType: 'terminal' },
  ];
  return {
    trainNumber,
    trainType: company === 'S' ? '고속열차 S' : '고속열차 K',
    operatingDate: date,
    scheduleDelaySeconds: 300,
    origin: '서울',
    destination: '부산',
    stops: normalizeSchedule(rawStops),
  };
}
