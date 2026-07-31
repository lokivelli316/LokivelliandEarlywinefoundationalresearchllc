/**
 * Basic smoke test for App component
 * Note: This is a minimal test that verifies the app can be imported
 */

import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('can be imported without errors', () => {
    expect(App).toBeDefined()
    expect(typeof App).toBe('function')
  })
})
