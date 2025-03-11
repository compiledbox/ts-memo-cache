# ts-memo-cache

## Purpose

**ts-memo-cache** is an open-source TypeScript library designed to simplify caching in your projects by providing smart memoization capabilities. It allows you to wrap any function with memoization, supports configurable TTL (Time-To-Live), cache invalidation, and offers multiple caching strategies such as in-memory and LRU caches. This utility is especially useful for improving application performance by avoiding redundant computations.

## Features

- **Memoization:** Wrap any function to cache its result based on its arguments.
- **Configurable TTL:** Set cache expiration to ensure data freshness.
- **Cache Invalidation:** Easily remove outdated entries.
- **Multiple Caching Strategies:** Use a simple in-memory cache or an advanced LRU cache.
- **Type Safety:** Fully typed to ensure input/output types are maintained.

## Installation

```bash
npm install ts-memo-cache
```

## Usages

### In-Memory Cache

```typescript
import { memoize } from 'ts-memo-cache';
import { MemoryCache } from 'ts-memo-cache/caches/MemoryCache';

function expensiveCalculation(n: number): number {
  // Simulate a heavy computation
  return n * n;
}

// Wrap the function with memoization
const memoizedCalculation = memoize(expensiveCalculation, { ttl: 5000, cache: new MemoryCache<string, number>() });

console.log(memoizedCalculation(10)); // Computes and caches the result.
console.log(memoizedCalculation(10)); // Returns cached result.
```

### LRU Cache Strategy

```typescript
import { memoize } from 'ts-memo-cache';
import { LRUCache } from 'ts-memo-cache/caches/LRUCache';

function computeResult(n: number): number {
  console.log("Computing result...");
  return n * 2;
}

// Create a memoized function with an LRU cache that holds a maximum of 50 entries
const memoizedCompute = memoize(computeResult, { ttl: 3000, cache: new LRUCache<string, number>(50) });

console.log(memoizedCompute(5)); // Computes and caches the result
console.log(memoizedCompute(5)); // Returns the cached result
```

## Contributing

Contributions are welcome! Please:

- Fork the repository.
- Create a branch for your changes.
- Write tests for any new features.
- Submit a pull request with detailed changes.

## License

This project is licensed under the MIT License