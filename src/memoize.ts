import { ICache } from "./cache";
import { MemoryCache } from "./caches/MemoryCache";

export interface MemoizeOptions {
  /**
   * Time-To-Live (TTL) in milliseconds for a cache entry.
   */
  ttl?: number;
  /**
   * Custom cache instance that implements ICache.
   * Defaults to an in-memory cache if not provided.
   */
  cache?: ICache<string, unknown>;
  /**
   * Custom key resolver function to generate cache keys from arguments.
   * Defaults to using JSON.stringify(...args).
   */
  keyResolver?: (...args: unknown[]) => string;
}

/**
 * Wraps a function with memoization capabilities.
 * Supports both synchronous and asynchronous (Promise‑returning) functions.
 *
 * @param fn The function to memoize.
 * @param options Optional configuration for TTL, cache instance, and key resolver.
 * @returns A memoized version of the function.
 */
export function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
  options?: MemoizeOptions
): (...args: A) => R {
  // Use the provided cache instance or fallback to a default MemoryCache.
  const cache: ICache<string, R> =
    (options?.cache as ICache<string, R>) || new MemoryCache<string, R>();
  const ttl = options?.ttl;
  const keyResolver = options?.keyResolver || ((...args: unknown[]) => JSON.stringify(args));

  const memoizedFn = function (...args: A): R {
    const key = keyResolver(...args);
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = fn(...args);

    // If the result is a Promise, clear the cached value if it rejects.
    if (result instanceof Promise) {
      result.catch(() => {
        cache.delete(key);
      });
    }

    cache.set(key, result, ttl);
    return result;
  };

  return memoizedFn;
}
