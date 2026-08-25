import 'package:koraillive_showcase/koraillive_showcase.dart';
import 'package:test/test.dart';

void main() {
  final departure = DateTime.fromMillisecondsSinceEpoch(1000 * 1000);

  test('journey is boarding before delayed departure', () {
    expect(
      journeyPhase(
        scheduledDeparture: departure,
        delayMinutes: 5,
        now: DateTime.fromMillisecondsSinceEpoch(1299 * 1000),
      ),
      JourneyPhase.boarding,
    );
  });

  test('journey is running at delayed departure boundary', () {
    expect(
      journeyPhase(
        scheduledDeparture: departure,
        delayMinutes: 5,
        now: DateTime.fromMillisecondsSinceEpoch(1300 * 1000),
      ),
      JourneyPhase.running,
    );
  });
}
