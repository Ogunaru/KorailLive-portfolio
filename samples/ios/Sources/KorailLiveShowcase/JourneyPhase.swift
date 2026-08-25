import Foundation

public enum JourneyPhase: String, Codable, Sendable {
    case boarding
    case running
}

public struct JourneyPhasePolicy: Sendable {
    public init() {}

    public func phase(
        scheduledDeparture: Date,
        delayMinutes: Int,
        now: Date
    ) -> JourneyPhase {
        let delayedDeparture = scheduledDeparture.addingTimeInterval(
            TimeInterval(delayMinutes * 60)
        )
        return now < delayedDeparture ? .boarding : .running
    }
}
