import Foundation
import XCTest
@testable import KorailLiveShowcase

final class ScheduleNormalizerTests: XCTestCase {
    func testScheduleAdvancesAcrossMidnight() {
        let input = [
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
        ]

        let output = ScheduleNormalizer.monotonic(input)
        XCTAssertEqual(output[1].arrival?.timeIntervalSince1970, 86_520)
        XCTAssertEqual(output[1].departure?.timeIntervalSince1970, 86_580)
    }
}
