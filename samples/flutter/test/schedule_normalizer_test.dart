import 'package:koraillive_showcase/koraillive_showcase.dart';
import 'package:test/test.dart';

void main() {
  test('schedule advances across midnight', () {
    final day = DateTime.utc(1970, 1, 1);
    final result = normalizeSchedule([
      ScheduleStop(
        stationName: 'A',
        arrival: day.add(const Duration(seconds: 86300)),
        departure: day.add(const Duration(seconds: 86340)),
      ),
      ScheduleStop(
        stationName: 'B',
        arrival: day.add(const Duration(seconds: 120)),
        departure: day.add(const Duration(seconds: 180)),
      ),
    ]);

    expect(result[1].arrival, day.add(const Duration(seconds: 86520)));
    expect(result[1].departure, day.add(const Duration(seconds: 86580)));
  });
}
