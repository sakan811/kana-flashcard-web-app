/**
 * Test utilities for TypeScript testing with Vitest
 */

/**
 * A properly typed mock function utility that avoids using 'any'
 */
export type MockedFunction<T extends (...args: unknown[]) => unknown> = T & {
  mockImplementation: (
    implementation: (...args: Parameters<T>) => ReturnType<T>,
  ) => MockedFunction<T>;
  mockImplementationOnce: (
    implementation: (...args: Parameters<T>) => ReturnType<T>,
  ) => MockedFunction<T>;
  mockResolvedValue: (value: Awaited<ReturnType<T>>) => MockedFunction<T>;
  mockResolvedValueOnce: (value: Awaited<ReturnType<T>>) => MockedFunction<T>;
  mockReset: () => MockedFunction<T>;
  mockClear: () => MockedFunction<T>;
};
