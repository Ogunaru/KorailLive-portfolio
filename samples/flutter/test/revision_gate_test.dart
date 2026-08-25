import 'package:koraillive_showcase/koraillive_showcase.dart';
import 'package:test/test.dart';

void main() {
  test('stale revision cannot overwrite newer state', () {
    final gate = RevisionGate<String>('initial');
    final older = gate.begin();
    final newer = gate.begin();

    expect(gate.commit('new', revision: newer), isTrue);
    expect(gate.commit('old', revision: older), isFalse);
    expect(gate.value, 'new');
  });
}
