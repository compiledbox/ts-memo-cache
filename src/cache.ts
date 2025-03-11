export interface ICache<K, V> {
    /**
     * Retrieves a value from the cache.
     * @param key The cache key.
     * @returns The cached value or undefined if not found.
     */
    get(key: K): V | undefined;
  
    /**
     * Stores a value in the cache.
     * @param key The cache key.
     * @param value The value to cache.
     * @param ttl Optional Time-To-Live in milliseconds.
     */
    set(key: K, value: V, ttl?: number): void;
  
    /**
     * Removes a value from the cache.
     * @param key The cache key.
     */
    delete(key: K): void;
  
    /**
     * Clears the entire cache.
     */
    clear(): void;
  }
  