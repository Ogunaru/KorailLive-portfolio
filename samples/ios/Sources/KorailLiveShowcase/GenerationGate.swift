public actor GenerationGate<Value: Sendable> {
    private var generation = 0
    private var value: Value

    public init(initialValue: Value) {
        value = initialValue
    }

    public func begin() -> Int {
        generation += 1
        return generation
    }

    @discardableResult
    public func commit(_ candidate: Value, generation candidateGeneration: Int) -> Bool {
        guard candidateGeneration == generation else { return false }
        value = candidate
        return true
    }

    public func snapshot() -> Value {
        value
    }
}
