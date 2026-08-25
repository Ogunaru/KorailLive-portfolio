final class RevisionGate<T> {
  RevisionGate(this._value);

  int _revision = 0;
  T _value;

  int begin() => ++_revision;

  bool commit(T candidate, {required int revision}) {
    if (revision != _revision) return false;
    _value = candidate;
    return true;
  }

  T get value => _value;
}
