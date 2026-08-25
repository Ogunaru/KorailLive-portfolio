import XCTest
@testable import KorailLiveShowcase

final class GenerationGateTests: XCTestCase {
    func testStaleGenerationCannotOverwriteNewerState() async {
        let gate = GenerationGate(initialValue: "initial")
        let older = await gate.begin()
        let newer = await gate.begin()

        let acceptedNewer = await gate.commit("new", generation: newer)
        let acceptedOlder = await gate.commit("old", generation: older)
        let snapshot = await gate.snapshot()

        XCTAssertTrue(acceptedNewer)
        XCTAssertFalse(acceptedOlder)
        XCTAssertEqual(snapshot, "new")
    }
}
