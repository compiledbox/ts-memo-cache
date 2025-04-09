import { memoize } from "../src/memoize";

describe("Async Memoization Support", () => {
  it("should cache the result of an async function", async () => {
    let callCount = 0;
    async function asyncDouble(x: number): Promise<number> {
      callCount++;
      return new Promise<number>((resolve) => {
        setTimeout(() => resolve(x * 2), 100);
      });
    }

    const memoizedAsyncDouble = memoize(asyncDouble, { ttl: 3000 });

    const start1 = Date.now();
    const result1 = await memoizedAsyncDouble(5);
    const duration1 = Date.now() - start1;
    
    const start2 = Date.now();
    const result2 = await memoizedAsyncDouble(5);
    const duration2 = Date.now() - start2;

    expect(result1).toEqual(10);
    expect(result2).toEqual(10);
    expect(callCount).toBe(1); // Ensure the function was executed only once.
    // The second call should be nearly instant because the result is cached.
    expect(duration2).toBeLessThan(10);
  });

  it("should not cache rejected Promises", async () => {
    let callCount = 0;
    async function asyncFailure(): Promise<string> {
      callCount++;
      return new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error("Failure occurred")), 100);
      });
    }

    const memoizedAsyncFailure = memoize(asyncFailure, { ttl: 3000 });

    // First call should reject.
    await expect(memoizedAsyncFailure()).rejects.toThrow("Failure occurred");
    // Second call: since the error isn't cached, the function will be invoked again.
    await expect(memoizedAsyncFailure()).rejects.toThrow("Failure occurred");
    expect(callCount).toBe(2);
  });
});
