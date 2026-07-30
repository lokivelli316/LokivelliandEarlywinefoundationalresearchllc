import React, { useState } from 'react'
import { useStore } from '../store'

const SettingsPage = () => {
  const { user, apiConfig, updateUser, updateApiConfig } = useStore()
  const [activeTab, setActiveTab] = useState('profile')

  const handleUpdateAPIKey = (provider, key) => {
    updateApiConfig(provider, { key })
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <span>⚙️</span>
          Settings
        </h1>
        <p className="page-subtitle">
          Configure your Better OS Dashboard
        </p>
      </div>

      <div className="page-content">
        <div className="tabs" style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--vault-light)', marginBottom: '20px' }}>
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'profile' ? 'var(--gold)' : 'var(--steel)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 'profile' ? '2px solid var(--gold)' : 'none'
            }}
          >
            Profile
          </button>
          <button 
            className={`tab ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'api' ? 'var(--gold)' : 'var(--steel)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 'api' ? '2px solid var(--gold)' : 'none'
            }}
          >
            API Configuration
          </button>
          <button 
            className={`tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'about' ? 'var(--gold)' : 'var(--steel)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 'about' ? '2px solid var(--gold)' : 'none'
            }}
          >
            About
          </button>
        </div>

        {activeTab === 'profile' && (
          <div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">User Profile</h3>
              </div>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => updateUser({ name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={user.email || ''}
                  onChange={(e) => updateUser({ email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Organization</label>
                <input
                  type="text"
                  value={user.org}
                  onChange={(e) => updateUser({ org: e.target.value })}
                  className="form-input"
                />
              </div>
              <button onClick={() => alert('Profile saved!')} className="btn btn-primary">
                Save Profile
              </button>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Preferences</h3>
              </div>
              <div className="form-group">
                <label className="form-label">Theme</label>
                <select
                  value={user.preferences?.theme || 'dark'}
                  onChange={(e) => updateUser({ 
                    preferences: { ...user.preferences, theme: e.target.value } 
                  })}
                  className="form-select"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">API Configuration</h3>
              </div>
              <p style={{ color: 'var(--steel-dim)', marginBottom: '16px' }}>
                Configure your AI provider API keys. These are stored locally in your browser.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="api-provider">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.25rem' }}>🤖</span>
                    <span style={{ fontWeight: 500, color: 'var(--paper)' }}>OpenAI</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">API Key</label>
                    <input
                      type="password"
                      value={apiConfig.openai?.key || ''}
                      onChange={(e) => handleUpdateAPIKey('openai', e.target.value)}
                      placeholder="sk-..."
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Endpoint</label>
                    <input
                      type="text"
                      value={apiConfig.openai?.endpoint || 'https://api.openai.com/v1'}
                      onChange={(e) => updateApiConfig('openai', { endpoint: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="api-provider">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.25rem' }}>🦜</span>
                    <span style={{ fontWeight: 500, color: 'var(--paper)' }}>Anthropic</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">API Key</label>
                    <input
                      type="password"
                      value={apiConfig.anthropic?.key || ''}
                      onChange={(e) => handleUpdateAPIKey('anthropic', e.target.value)}
                      placeholder="sk-ant-..."
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Endpoint</label>
                    <input
                      type="text"
                      value={apiConfig.anthropic?.endpoint || 'https://api.anthropic.com/v1'}
                      onChange={(e) => updateApiConfig('anthropic', { endpoint: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="api-provider">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.25rem' }}>🔍</span>
                    <span style={{ fontWeight: 500, color: 'var(--paper)' }}>Google</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">API Key</label>
                    <input
                      type="password"
                      value={apiConfig.google?.key || ''}
                      onChange={(e) => handleUpdateAPIKey('google', e.target.value)}
                      placeholder="AIza..."
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Endpoint</label>
                    <input
                      type="text"
                      value={apiConfig.google?.endpoint || 'https://generativelanguage.googleapis.com/v1beta'}
                      onChange={(e) => updateApiConfig('google', { endpoint: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="api-provider">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    <span style={{ fontWeight: 500, color: 'var(--paper)' }}>Local Models</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Endpoint</label>
                    <input
                      type="text"
                      value={apiConfig.local?.endpoint || 'http://localhost:8000'}
                      onChange={(e) => updateApiConfig('local', { endpoint: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
              
              <p style={{ marginTop: '16px', color: 'var(--warning)', fontSize: '0.85rem' }}>
                ⚠️ API keys are stored in your browser's localStorage. Do not enter production keys on shared computers.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">About Better OS Dashboard</h3>
              </div>
              <p style={{ color: 'var(--steel)', marginBottom: '16px' }}>
                Better OS Dashboard is a modular AI workspace designed for researchers, developers, and creators.
              </p>
              <p style={{ color: 'var(--steel)', marginBottom: '16px' }}>
                This is a <strong>prototype</strong> implementation. Features are being developed incrementally.
              </p>
              <h4 style={{ color: 'var(--paper)', margin: '16px 0' }}>Current Status</h4>
              <ul style={{ color: 'var(--steel-dim)', paddingLeft: '20px' }}>
                <li>✅ Core architecture and navigation</li>
                <li>✅ State management with Zustand</li>
                <li>✅ Basic chat interface</li>
                <li>✅ Physics equation verification</li>
                <li>✅ Notebook system</li>
                <li>✅ Media generation interface</li>
                <li>✅ CAD design interface</li>
                <li>✅ AI agent management</li>
                <li>✅ Financial tracking</li>
                <li>⚠️ API integrations (in development)</li>
                <li>⚠️ Local model support (in development)</li>
                <li>⚠️ Termux integration (planned)</li>
                <li>⚠️ GitHub integration (planned)</li>
              </ul>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Technologies</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge badge-secondary">React 18</span>
                <span className="badge badge-secondary">Vite</span>
                <span className="badge badge-secondary">Zustand</span>
                <span className="badge badge-secondary">Framer Motion</span>
                <span className="badge badge-secondary">Math.js</span>
                <span className="badge badge-secondary">KaTeX</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsPage
