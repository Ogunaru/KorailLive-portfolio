import Foundation

public struct ScheduleStop: Equatable, Sendable {
    public let stationName: String
    public let arrival: Date?
    public let departure: Date?

    public init(stationName: String, arrival: Date?, departure: Date?) {
        self.stationName = stationName
        self.arrival = arrival
        self.departure = departure
    }
}

public enum ScheduleNormalizer {
    private static let day: TimeInterval = 86_400

    public static func monotonic(_ stops: [ScheduleStop]) -> [ScheduleStop] {
        var dayOffset: TimeInterval = 0
        var lastEpoch: TimeInterval?

        func normalize(_ date: Date?) -> Date? {
            guard let date else { return nil }
            var candidate = date.timeIntervalSince1970 + dayOffset
            if let lastEpoch, candidate < lastEpoch {
                dayOffset += day
                candidate += day
            }
            lastEpoch = candidate
            return Date(timeIntervalSince1970: candidate)
        }

        return stops.map { stop in
            ScheduleStop(
                stationName: stop.stationName,
                arrival: normalize(stop.arrival),
                departure: normalize(stop.departure)
            )
        }
    }
}
