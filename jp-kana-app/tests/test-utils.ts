/**
 * Test utilities for TypeScript testing with Vitest
 */

/**
 * A properly typed mock function utility that avoids using 'any'
 */
export type MockedFunction<T> = T & {
  mockImplementation: (implementation: (...args: unknown[]) => unknown) => MockedFunction<T>;
  mockImplementationOnce: (implementation: (...args: unknown[]) => unknown) => MockedFunction<T>;
  mockResolvedValue: (value: unknown) => MockedFunction<T>;
  mockResolvedValueOnce: (value: unknown) => MockedFunction<T>;
  mockReset: () => MockedFunction<T>;
  mockClear: () => MockedFunction<T>;
};
