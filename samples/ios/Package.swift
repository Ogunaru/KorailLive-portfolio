// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "KorailLiveShowcase",
    platforms: [
        .iOS(.v16),
        .macOS(.v13),
    ],
    products: [
        .library(name: "KorailLiveShowcase", targets: ["KorailLiveShowcase"]),
        .executable(
            name: "KorailLiveShowcaseCheck",
            targets: ["KorailLiveShowcaseCheck"]
        ),
    ],
    targets: [
        .target(name: "KorailLiveShowcase"),
        .executableTarget(
            name: "KorailLiveShowcaseCheck",
            dependencies: ["KorailLiveShowcase"]
        ),
        .testTarget(
            name: "KorailLiveShowcaseTests",
            dependencies: ["KorailLiveShowcase"]
        ),
    ]
)
