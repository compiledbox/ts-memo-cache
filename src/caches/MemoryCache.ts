import { ICache } from "../cache";

interface CacheEntry<V> {
  value: V;
  expiry: number | null;
}

/**
 * An in-memory cache implementation.
 */
export class MemoryCache<K, V> implements ICache<K, V> {
  private cache = new Map<K, CacheEntry<V>>();

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (entry) {
      if (entry.expiry !== null && Date.now() > entry.expiry) {
        this.cache.delete(key);
        return undefined;
      }
      return entry.value;
    }
    return undefined;
  }

  set(key: K, value: V, ttl?: number): void {
    const expiry = ttl ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiry });
  }

  delete(key: K): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
