import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import '@vitest/expect'

// Vitest 5 exports its generic assertion interface from @vitest/expect.
// Extend that source interface until jest-dom supports the new type signature.
declare module '@vitest/expect' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging needs an interface
  interface Assertion<R, T> extends TestingLibraryMatchers<R, T> {}
}
