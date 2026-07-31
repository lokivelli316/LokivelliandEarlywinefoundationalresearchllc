import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { v4 as uuidv4 } from 'uuid'

const AgentsPage = () => {
  const { agents, addAgent, startAgent, stopAgent } = useStore()
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: 'research',
    description: '',
    prompt: ''
  })
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [task, setTask] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')

  const agentTypes = [
    { value: 'research', label: 'Research Assistant' },
    { value: 'development', label: 'Development Agent' },
    { value: 'analysis', label: 'Data Analyst' },
    { value: 'automation', label: 'Automation Agent' },
    { value: 'creative', label: 'Creative Assistant' },
    { value: 'business', label: 'Business Agent' }
  ]

  const typeDescriptions = {
    research: 'Assists with scientific research, literature review, and hypothesis generation',
    development: 'Assists with software development, debugging, and code generation',
    analysis: 'Performs data analysis, visualization, and interpretation',
    automation: 'Automates repetitive tasks and workflows',
    creative: 'Assists with creative writing, design, and content generation',
    business: 'Assists with business planning, financial analysis, and strategy'
  }

  const createAgent = () => {
    if (!newAgent.name.trim()) return
    
    const agent = {
      id: uuidv4(),
      ...newAgent,
      status: 'idle',
      createdAt: new Date().toISOString()
    }
    
    addAgent(agent)
    setNewAgent({
      name: '',
      type: 'research',
      description: '',
      prompt: ''
    })
  }

  const runAgent = async () => {
    if (!selectedAgent || !task.trim() || isRunning) return
    
    setIsRunning(true)
    setOutput('Agent is processing your request...')
    startAgent(selectedAgent.id)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setOutput(`Agent ${selectedAgent.name} completed task: ${task}\n\nThis is a simulated response. In a real implementation, this would execute the actual agent logic.`)
    } catch (error) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
      stopAgent(selectedAgent.id)
    }
  }

  const deleteAgent = (id) => {
    // In a real implementation, this would remove from store
    // For now, we'll just filter locally
    // This is a known limitation
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <span>🤖</span>
          AI Agent Harness
        </h1>
        <p className="page-subtitle">
          Build and deploy AI agents for automation
        </p>
      </div>

      <div className="page-content">
        <div className="grid grid-2" style={{ gap: '20px' }}>
          {/* Agent List */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">My Agents</h3>
              <span className="badge badge-secondary">{agents.length} agents</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent)
                    setTask('')
                    setOutput('')
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: selectedAgent?.id === agent.id ? 'var(--vault-light)' : 'transparent',
                    border: selectedAgent?.id === agent.id ? '1px solid var(--gold)' : '1px solid var(--vault-light)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--paper)' }}>{agent.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--steel-dim)' }}>
                        {agent.type}
                      </div>
                    </div>
                    <span className="status status-offline">
                      <span className="status-dot" />
                      {agent.status}
                    </span>
                  </div>
                </div>
              ))}
              {agents.length === 0 && (
                <div className="empty-state" style={{ padding: '20px' }}>
                  <p>No agents yet. Create your first agent!</p>
                </div>
              )}
            </div>
          </div>

          {/* Create Agent */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Create New Agent</h3>
            </div>
            <div className="form-group">
              <label className="form-label">Agent Name</label>
              <input
                type="text"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                placeholder="Enter agent name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Agent Type</label>
              <select
                value={newAgent.type}
                onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value, description: typeDescriptions[e.target.value] })}
                className="form-select"
              >
                {agentTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={newAgent.description}
                onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                placeholder="Describe what this agent does"
                className="form-textarea"
                rows={2}
              />
            </div>
            <div className="form-group">
              <label className="form-label">System Prompt</label>
              <textarea
                value={newAgent.prompt}
                onChange={(e) => setNewAgent({ ...newAgent, prompt: e.target.value })}
                placeholder="Define the agent's behavior"
                className="form-textarea"
                rows={3}
              />
            </div>
            <button
              onClick={createAgent}
              disabled={!newAgent.name.trim()}
              className="btn btn-primary"
            >
              Create Agent
            </button>
          </div>
        </div>

        {/* Agent Details & Task */}
        {selectedAgent && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Agent: {selectedAgent.name}</h3>
            </div>
            <div className="grid grid-2" style={{ gap: '20px' }}>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--paper)' }}>Details</h4>
                <p style={{ color: 'var(--steel)' }}>{selectedAgent.description}</p>
                <div style={{ marginTop: '12px' }}>
                  <span className="badge badge-secondary">
                    {agentTypes.find(t => t.value === selectedAgent.type)?.label}
                  </span>
                </div>
              </div>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--paper)' }}>Assign Task</h4>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Describe the task..."
                  className="form-textarea"
                  rows={3}
                  disabled={isRunning}
                />
                <button
                  onClick={runAgent}
                  disabled={!task.trim() || isRunning}
                  className="btn btn-primary"
                  style={{ marginTop: '8px' }}
                >
                  {isRunning ? (
                    <>
                      <span className="spinner" />
                      Running...
                    </>
                  ) : (
                    'Run Agent'
                  )}
                </button>
              </div>
            </div>
            {output && (
              <div style={{ marginTop: '16px', padding: '16px', background: 'var(--vault-deep)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--paper)' }}>Output</h4>
                <pre style={{ color: 'var(--steel)', whiteSpace: 'pre-wrap' }}>{output}</pre>
              </div>
            )}
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📚 About AI Agents</h3>
          </div>
          <p style={{ color: 'var(--steel)' }}>
            This is a prototype AI agent management interface. In a full implementation, agents would:
          </p>
          <ul style={{ color: 'var(--steel-dim)', marginTop: '12px', paddingLeft: '20px' }}>
            <li>Execute tasks autonomously</li>
            <li>Connect to various AI models</li>
            <li>Maintain conversation context</li>
            <li>Generate reports and outputs</li>
            <li>Integrate with external tools</li>
          </ul>
          <p style={{ color: 'var(--steel)', marginTop: '12px' }}>
            Current implementation uses simulated responses for demonstration.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AgentsPage
