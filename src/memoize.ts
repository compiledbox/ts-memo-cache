import { ICache } from "./cache";
import { MemoryCache } from "./caches/MemoryCache";

export interface MemoizeOptions {
  ttl?: number; // Time-To-Live in milliseconds
  cache?: ICache<string, any>; // Optional custom cache; defaults to in-memory cache
}

/**
 * Wraps a function with memoization capabilities.
 * @param fn The function to memoize.
 * @param options Memoization options including TTL and custom cache strategy.
 * @returns A memoized version of the function.
 */
export function memoize<F extends (...args: any[]) => any>(
  fn: F,
  options?: MemoizeOptions
): F {
  const cache: ICache<string, ReturnType<F>> =
    options?.cache || new MemoryCache<string, ReturnType<F>>();
  const ttl = options?.ttl;

  const memoizedFn = function (...args: any[]): any {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const result = fn(...args);
    cache.set(key, result, ttl);
    return result;
  };

  return memoizedFn as F;
}
