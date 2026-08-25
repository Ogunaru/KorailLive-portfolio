import Foundation
import XCTest
@testable import KorailLiveShowcase

final class JourneyPhaseTests: XCTestCase {
    func testBoardingBeforeDelayedDeparture() {
        let departure = Date(timeIntervalSince1970: 1_000)
        let result = JourneyPhasePolicy().phase(
            scheduledDeparture: departure,
            delayMinutes: 5,
            now: Date(timeIntervalSince1970: 1_299)
        )
        XCTAssertEqual(result, .boarding)
    }

    func testRunningAtDelayedDepartureBoundary() {
        let departure = Date(timeIntervalSince1970: 1_000)
        let result = JourneyPhasePolicy().phase(
            scheduledDeparture: departure,
            delayMinutes: 5,
            now: Date(timeIntervalSince1970: 1_300)
        )
        XCTAssertEqual(result, .running)
    }
}
