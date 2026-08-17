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

// For plain (non-JSON) string values -- avoids loadJSON's JSON.parse, which
// would throw on an unquoted raw string like "dark" or "3".
export function loadString(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (err) {
    console.error(`Failed to load "${key}" from storage:`, err);
    return fallback;
  }
}

export function saveString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error(`Failed to save "${key}" to storage:`, err);
  }
}
