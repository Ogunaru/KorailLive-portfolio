enum JourneyPhase { boarding, running }

JourneyPhase journeyPhase({
  required DateTime scheduledDeparture,
  required int delayMinutes,
  required DateTime now,
}) {
  final delayedDeparture = scheduledDeparture.add(
    Duration(minutes: delayMinutes),
  );
  return now.isBefore(delayedDeparture)
      ? JourneyPhase.boarding
      : JourneyPhase.running;
}
