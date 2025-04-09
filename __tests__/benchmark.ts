import { memoize } from "../src/memoize";


function expensiveOperation(n: number): number {
  let sum = 0;
  // Simulate heavy computation
  for (let i = 0; i < n * 1e7; i++) {
    sum += i;
  }
  return sum;
}

// Measure execution time without memoization.
console.time("Without Memoization");
const resultWithout = expensiveOperation(10);
console.timeEnd("Without Memoization");

// Create a memoized version of the function with a TTL of 10000ms.
const memoizedExpensiveOperation = memoize(expensiveOperation, { ttl: 10000 });

// First call: compute and cache the result.
console.time("First call with Memoization");
const firstMemoizedResult = memoizedExpensiveOperation(10);
console.timeEnd("First call with Memoization");

// Second call: retrieve the result from the cache.
console.time("Second call with Memoization");
const secondMemoizedResult = memoizedExpensiveOperation(10);
console.timeEnd("Second call with Memoization");

console.log({ resultWithout, firstMemoizedResult, secondMemoizedResult });
