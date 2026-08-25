final class ScheduleStop {
  const ScheduleStop({required this.stationName, this.arrival, this.departure});

  final String stationName;
  final DateTime? arrival;
  final DateTime? departure;
}

List<ScheduleStop> normalizeSchedule(List<ScheduleStop> stops) {
  var dayOffset = 0;
  DateTime? last;

  DateTime? normalize(DateTime? value) {
    if (value == null) return null;
    var candidate = value.add(Duration(days: dayOffset));
    final previous = last;
    if (previous != null && candidate.isBefore(previous)) {
      dayOffset += 1;
      candidate = value.add(Duration(days: dayOffset));
    }
    last = candidate;
    return candidate;
  }

  return [
    for (final stop in stops)
      ScheduleStop(
        stationName: stop.stationName,
        arrival: normalize(stop.arrival),
        departure: normalize(stop.departure),
      ),
  ];
}
