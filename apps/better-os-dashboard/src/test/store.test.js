/**
 * Store tests - Testing Zustand store functionality
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from '../store'

// Helper to access store state
const getStoreState = () => {
  return useStore.getState()
}

describe('Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = getStoreState()
    store.reset()
  })

  it('initializes with default values', () => {
    const state = getStoreState()
    
    expect(state.user.name).toBe('User')
    expect(state.user.org).toBe('Lokivelli & Earlywine Foundational Research LLC')
    expect(state.chatSessions).toEqual([])
    expect(state.physicsNotebooks).toEqual([])
    expect(state.mediaProjects).toEqual([])
    expect(state.cadProjects).toEqual([])
    expect(state.agents).toEqual([])
    expect(state.financialData.balance).toBe(0)
  })

  it('adds chat sessions', () => {
    const store = getStoreState()
    const initialCount = store.chatSessions.length
    
    store.addChatSession({
      id: 'test-1',
      name: 'Test Chat',
      model: 'gpt-4',
      messages: [],
      createdAt: new Date().toISOString()
    })
    
    const newState = getStoreState()
    expect(newState.chatSessions.length).toBe(initialCount + 1)
    expect(newState.activeChatId).toBe('test-1')
  })

  it('updates user profile', () => {
    const store = getStoreState()
    
    store.updateUser({ name: 'Test User', email: 'test@example.com' })
    
    const newState = getStoreState()
    expect(newState.user.name).toBe('Test User')
    expect(newState.user.email).toBe('test@example.com')
  })

  it('updates API configuration', () => {
    const store = getStoreState()
    
    store.updateApiConfig('openai', { key: 'test-key' })
    
    const newState = getStoreState()
    expect(newState.apiConfig.openai.key).toBe('test-key')
  })

  it('adds physics notebooks', () => {
    const store = getStoreState()
    const initialCount = store.physicsNotebooks.length
    
    store.addPhysicsNotebook({
      id: 'notebook-1',
      name: 'Test Notebook',
      content: 'Test content',
      createdAt: new Date().toISOString()
    })
    
    const newState = getStoreState()
    expect(newState.physicsNotebooks.length).toBe(initialCount + 1)
    expect(newState.activeNotebookId).toBe('notebook-1')
  })

  it('updates financial data', () => {
    const store = getStoreState()
    
    store.updateFinancialData({ balance: 1000 })
    
    const newState = getStoreState()
    expect(newState.financialData.balance).toBe(1000)
  })

  it('adds agents', () => {
    const store = getStoreState()
    const initialCount = store.agents.length
    
    store.addAgent({
      id: 'agent-1',
      name: 'Test Agent',
      type: 'research',
      description: 'Test description',
      prompt: 'Test prompt',
      status: 'idle',
      createdAt: new Date().toISOString()
    })
    
    const newState = getStoreState()
    expect(newState.agents.length).toBe(initialCount + 1)
  })

  it('adds media projects', () => {
    const store = getStoreState()
    const initialCount = store.mediaProjects.length
    
    store.addMediaProject({
      id: 'media-1',
      name: 'Test Media',
      type: 'image',
      prompt: 'Test prompt',
      url: 'http://example.com/image.jpg',
      createdAt: new Date().toISOString()
    })
    
    const newState = getStoreState()
    expect(newState.mediaProjects.length).toBe(initialCount + 1)
  })

  it('adds CAD projects', () => {
    const store = getStoreState()
    const initialCount = store.cadProjects.length
    
    store.addCadProject({
      id: 'cad-1',
      name: 'Test CAD',
      type: '2d',
      shapes: [],
      createdAt: new Date().toISOString()
    })
    
    const newState = getStoreState()
    expect(newState.cadProjects.length).toBe(initialCount + 1)
  })

  it('resets store', () => {
    const store = getStoreState()
    
    // Add some data
    store.addChatSession({
      id: 'test-1',
      name: 'Test Chat',
      model: 'gpt-4',
      messages: [],
      createdAt: new Date().toISOString()
    })
    store.updateFinancialData({ balance: 1000 })
    
    // Reset
    store.reset()
    
    const newState = getStoreState()
    expect(newState.chatSessions.length).toBe(0)
    expect(newState.financialData.balance).toBe(0)
  })
})
