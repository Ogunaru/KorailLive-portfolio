import Foundation
import KorailLiveShowcase

@main
struct KorailLiveShowcaseCheck {
    static func main() async {
        let departure = Date(timeIntervalSince1970: 1_000)
        let phase = JourneyPhasePolicy().phase(
            scheduledDeparture: departure,
            delayMinutes: 5,
            now: Date(timeIntervalSince1970: 1_300)
        )
        precondition(phase == .running)

        let schedule = ScheduleNormalizer.monotonic([
            ScheduleStop(
                stationName: "A",
                arrival: Date(timeIntervalSince1970: 86_300),
                departure: Date(timeIntervalSince1970: 86_340)
            ),
            ScheduleStop(
                stationName: "B",
                arrival: Date(timeIntervalSince1970: 120),
                departure: Date(timeIntervalSince1970: 180)
            ),
        ])
        precondition(schedule[1].arrival?.timeIntervalSince1970 == 86_520)

        let gate = GenerationGate(initialValue: "initial")
        let older = await gate.begin()
        let newer = await gate.begin()
        let acceptedNewer = await gate.commit("new", generation: newer)
        let acceptedOlder = await gate.commit("old", generation: older)
        precondition(acceptedNewer)
        precondition(!acceptedOlder)

        print("Swift showcase checks passed.")
    }
}
