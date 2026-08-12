import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  // The fake session lives in localStorage — a test must never inherit the
  // sign-in state of the one before it.
  window.localStorage.clear()
})
