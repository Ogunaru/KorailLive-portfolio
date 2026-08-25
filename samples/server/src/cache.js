export class TTLCache {
  #entries = new Map();
  #pending = new Map();

  constructor({ ttlMs, now = Date.now }) {
    if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
      throw new TypeError('ttlMs must be a positive number');
    }
    this.ttlMs = ttlMs;
    this.now = now;
  }

  async getOrLoad(key, loader) {
    const cached = this.#entries.get(key);
    if (cached && cached.expiresAt > this.now()) {
      return { value: cached.value, source: 'cache' };
    }

    const inFlight = this.#pending.get(key);
    if (inFlight) return inFlight;

    const task = Promise.resolve()
      .then(loader)
      .then((value) => {
        this.#entries.set(key, {
          value,
          expiresAt: this.now() + this.ttlMs,
        });
        return { value, source: 'loader' };
      })
      .finally(() => {
        this.#pending.delete(key);
      });

    this.#pending.set(key, task);
    return task;
  }

  clear() {
    this.#entries.clear();
  }
}
