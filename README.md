# ts-memo-cache

## Purpose

**ts-memo-cache** is an open-source TypeScript library designed to simplify caching in your projects by providing smart memoization capabilities. It allows you to wrap any function with memoization, supports configurable TTL (Time-To-Live), cache invalidation, and offers multiple caching strategies such as in-memory and LRU caches. This utility is especially useful for improving application performance by avoiding redundant computations.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Asynchronous Function Support](#asynchronous-function-support)
- [Usages](#usages)
  - [In-Memory Cache](#in-memory-cache)
  - [LRU Cache Strategy](#lru-cache-strategy)
  - [Asynchronous Usages](#asynchronous-usages)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Memoization:** Wrap any function to cache its result based on its arguments.
- **Configurable TTL:** Set cache expiration to ensure data freshness.
- **Cache Invalidation:** Easily remove outdated entries.
- **Multiple Caching Strategies:** Use a simple in-memory cache or an advanced LRU cache.
- **Type Safety:** Fully typed to ensure input/output types are maintained.
- **Asynchronous Function** Supports asynchronous (Promise‑returning) functions.

## Installation

```bash
npm install ts-memo-cache
```

## Asynchronous Function Support

ts-memo-cache now supports asynchronous (Promise‑returning) functions. This means you can cache results of network calls, file I/O, or any async operations while still benefiting from memoization.

 - Uses a key resolver (by default, JSON.stringify) to generate a unique key based on the function's arguments.
 - Checks if the key exists in the cache:
    - If found, the cached Promise is returned immediately.
    - If not, the function is executed, and the resulting Promise is cached.
 - Attaches a .catch() handler to the Promise so that if the Promise rejects (indicating an error), the cache entry is cleared.

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

### Asynchronous Usages

```typescript
import { memoize } from 'ts-memo-cache';
import { MemoryCache } from 'ts-memo-cache/caches/MemoryCache';

// Simulate a delayed API call that returns data asynchronously.
async function fetchData(apiUrl: string): Promise<string> {
  console.log(`Fetching data from ${apiUrl}`);
  // Simulate a delay (e.g., network latency)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Data from ${apiUrl}`);
    }, 1000);
  });
}

// Wrap the asynchronous function with memoization.
// Here, the result of fetchData is cached so that identical calls return the cached Promise.
const memoizedFetchData = memoize(fetchData, {
  ttl: 30000, // Cache result for 30 seconds
  cache: new MemoryCache<string, Promise<string>>()
});

async function runDemo() {
  // First call: the API is fetched, and the result is cached.
  console.time("First call");
  const result1 = await memoizedFetchData("https://api.example.com/data");
  console.timeEnd("First call");
  console.log(result1);

  // Second call: returns the cached result immediately.
  console.time("Second call");
  const result2 = await memoizedFetchData("https://api.example.com/data");
  console.timeEnd("Second call");
  console.log(result2);
}

runDemo();
```

In this demo:
  - First call: fetchData is executed, simulating an API call with a delay of 1 second.
  - Second call: The same API URL is used, so the memoized function returns the cached Promise, resulting in an immediate response.

## Contributing

Contributions are welcome! Please:

- Fork the repository.
- Create a branch for your changes.
- Write tests for any new features.
- Submit a pull request with detailed changes.

## License

This project is licensed under the MIT License