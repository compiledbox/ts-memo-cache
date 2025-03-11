import { memoize } from "../src/memoize";

describe("ts-memo-cache: Memoization Utility", () => {
  it("should cache result for same arguments", () => {
    let callCount = 0;
    const add = (a: number, b: number): number => {
      callCount++;
      return a + b;
    };

    const memoizedAdd = memoize(add);

    // First call calculates and caches the result.
    expect(memoizedAdd(1, 2)).toBe(3);
    // Second call with the same arguments returns the cached result.
    expect(memoizedAdd(1, 2)).toBe(3);
    expect(callCount).toBe(1);
  });

  it("should call function again for different arguments", () => {
    let callCount = 0;
    const multiply = (a: number, b: number): number => {
      callCount++;
      return a * b;
    };

    const memoizedMultiply = memoize(multiply);

    expect(memoizedMultiply(2, 3)).toBe(6);
    expect(memoizedMultiply(3, 3)).toBe(9);
    // Each unique argument pair triggers a new call.
    expect(callCount).toBe(2);
  });

  it("should respect TTL expiration", () => {
    // Use fake timers to simulate time passing.
    jest.useFakeTimers();

    let callCount = 0;
    const subtract = (a: number, b: number): number => {
      callCount++;
      return a - b;
    };

    // Set TTL to 1000ms (1 second)
    const memoizedSubtract = memoize(subtract, { ttl: 1000 });

    // First call computes and caches the result.
    expect(memoizedSubtract(5, 3)).toBe(2);
    expect(callCount).toBe(1);

    // Advance time by 500ms (still within TTL)
    jest.advanceTimersByTime(500);
    expect(memoizedSubtract(5, 3)).toBe(2);
    expect(callCount).toBe(1);

    // Advance time by an additional 600ms (total 1100ms, beyond TTL)
    jest.advanceTimersByTime(600);
    expect(memoizedSubtract(5, 3)).toBe(2);
    // Cache expired, so the function is called again.
    expect(callCount).toBe(2);

    // Restore real timers after the test.
    jest.useRealTimers();
  });
});
