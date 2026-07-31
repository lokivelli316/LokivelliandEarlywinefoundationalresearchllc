import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export const useStore = create(
  persist(
    (set, get) => ({
      // User state
      user: {
        name: 'User',
        email: '',
        org: 'Lokivelli & Earlywine Foundational Research LLC',
        preferences: {
          theme: 'dark',
          fontSize: 'medium'
        }
      },
      
      // Update user
      updateUser: (updates) => set({
        user: { ...get().user, ...updates }
      }),
      
      // API Configuration
      apiConfig: {
        openai: { key: '', endpoint: 'https://api.openai.com/v1' },
        anthropic: { key: '', endpoint: 'https://api.anthropic.com/v1' },
        google: { key: '', endpoint: 'https://generativelanguage.googleapis.com/v1beta' },
        local: { endpoint: 'http://localhost:8000' }
      },
      
      // Update API config
      updateApiConfig: (provider, config) => set({
        apiConfig: { ...get().apiConfig, [provider]: { ...get().apiConfig[provider], ...config } }
      }),
      
      // Chat state
      chatSessions: [],
      activeChatId: null,
      
      addChatSession: (session) => set({
        chatSessions: [...get().chatSessions, session],
        activeChatId: session.id
      }),
      
      updateChatSession: (id, updates) => set({
        chatSessions: get().chatSessions.map(s => 
          s.id === id ? { ...s, ...updates } : s
        )
      }),
      
      setActiveChat: (id) => set({ activeChatId: id }),
      
      // Physics notebooks
      physicsNotebooks: [],
      activeNotebookId: null,
      
      addPhysicsNotebook: (notebook) => set({
        physicsNotebooks: [...get().physicsNotebooks, notebook],
        activeNotebookId: notebook.id
      }),
      
      updatePhysicsNotebook: (id, updates) => set({
        physicsNotebooks: get().physicsNotebooks.map(n => 
          n.id === id ? { ...n, ...updates } : n
        )
      }),
      
      // Media projects
      mediaProjects: [],
      
      addMediaProject: (project) => set({
        mediaProjects: [...get().mediaProjects, project]
      }),
      
      // CAD projects
      cadProjects: [],
      
      addCadProject: (project) => set({
        cadProjects: [...get().cadProjects, project]
      }),
      
      // Agents
      agents: [],
      runningAgents: [],
      
      addAgent: (agent) => set({
        agents: [...get().agents, agent]
      }),
      
      startAgent: (agentId) => set({
        runningAgents: [...get().runningAgents, agentId]
      }),
      
      stopAgent: (agentId) => set({
        runningAgents: get().runningAgents.filter(id => id !== agentId)
      }),
      
      // Financial data
      financialData: {
        balance: 0,
        transactions: [],
        investments: []
      },
      
      updateFinancialData: (updates) => set({
        financialData: { ...get().financialData, ...updates }
      }),
      
      // Reset
      reset: () => set({
        chatSessions: [],
        activeChatId: null,
        physicsNotebooks: [],
        activeNotebookId: null,
        mediaProjects: [],
        cadProjects: [],
        agents: [],
        runningAgents: [],
        financialData: { balance: 0, transactions: [], investments: [] }
      })
    }),
    {
      name: 'better-os-storage',
      partialize: (state) => ({
        // Don't persist sensitive data
        user: state.user,
        apiConfig: {},
        chatSessions: state.chatSessions,
        physicsNotebooks: state.physicsNotebooks,
        mediaProjects: state.mediaProjects,
        cadProjects: state.cadProjects,
        agents: state.agents,
        financialData: state.financialData
      })
    }
  )
)

export const StoreProvider = ({ children }) => {
  return children
}

export default useStore
