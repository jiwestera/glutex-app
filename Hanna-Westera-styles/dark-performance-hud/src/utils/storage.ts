// Shared localStorage read/write helpers. A future app update that changes a
// data shape (or any storage corruption) must never crash the whole app on
// load -- every read falls back to the caller's default instead, so the
// user's other data (still sitting in localStorage) stays reachable.

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch (err) {
    console.error(`Failed to load "${key}" from storage:`, err);
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save "${key}" to storage:`, err);
  }
}
