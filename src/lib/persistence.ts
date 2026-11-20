const STORAGE_PREFIX = "rising-giants:v1:";

export function readPersistedState<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch (error) {
    console.warn(`Could not load ${key} from local storage.`, error);
    return fallback;
  }
}

export function writePersistedState<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify(value)
    );
  } catch (error) {
    console.warn(`Could not save ${key} to local storage.`, error);
  }
}
