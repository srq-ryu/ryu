const memoryCache = new Map<string, string>();

export function setCache<T>(key: string, value: T): void {
  memoryCache.set(key, JSON.stringify(value));
}

export function getCache<T>(key: string): T | null {
  const item = memoryCache.get(key);
  if (!item) return null;
  return JSON.parse(item) as T;
}
