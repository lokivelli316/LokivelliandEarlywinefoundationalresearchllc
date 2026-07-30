import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store'

const MainHub = () => {
  const { 
    chatSessions, 
    physicsNotebooks, 
    mediaProjects, 
    cadProjects, 
    agents,
    financialData 
  } = useStore()

  const stats = [
    { label: 'Active Chats', value: chatSessions.length, icon: '💬', path: '/chat' },
    { label: 'Physics Notebooks', value: physicsNotebooks.length, icon: '⚛️', path: '/physics' },
    { label: 'Media Projects', value: mediaProjects.length, icon: '🎨', path: '/media' },
    { label: 'CAD Projects', value: cadProjects.length, icon: '📐', path: '/cad' },
    { label: 'AI Agents', value: agents.length, icon: '🤖', path: '/agents' },
    { label: 'Balance', value: `$${financialData.balance.toLocaleString()}`, icon: '💰', path: '/finance' }
  ]

  const features = [
    {
      title: 'Multi-API Chat',
      description: 'Connect to multiple AI models simultaneously',
      icon: '💬',
      path: '/chat',
      tags: ['OpenAI', 'Anthropic', 'Google', 'Local']
    },
    {
      title: 'Physics Lab',
      description: 'Advanced physics computation and visualization',
      icon: '⚛️',
      path: '/physics',
      tags: ['Derivations', 'Visualization', 'Constants']
    },
    {
      title: 'NotebookLM++',
      description: 'Enhanced notebooks with AI assistance',
      icon: '📓',
      path: '/notebook',
      tags: ['Markdown', 'LaTeX', 'Code', 'AI']
    },
    {
      title: 'Media Studio',
      description: 'Generate images, videos, audio, and music',
      icon: '🎨',
      path: '/media',
      tags: ['Image', 'Video', 'Audio', 'Music']
    },
    {
      title: 'CAD & Design',
      description: 'Create 2D/3D designs and schematics',
      icon: '📐',
      path: '/cad',
      tags: ['2D', '3D', 'Parametric', 'PDF']
    },
    {
      title: 'AI Agents',
      description: 'Build and deploy AI agents for automation',
      icon: '🤖',
      path: '/agents',
      tags: ['Research', 'Development', 'Analysis', 'Automation']
    },
    {
      title: 'Financial Hub',
      description: 'Manage finances and investments',
      icon: '💰',
      path: '/finance',
      tags: ['Transactions', 'Investments', 'Reports']
    }
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <span>🚀</span>
          Main Hub
        </h1>
        <p className="page-subtitle">
          Welcome to Better OS Dashboard - Infinite Brain System
        </p>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div className="grid grid-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link to={stat.path} className="card stat-card">
                <div className="stat-icon" style={{ fontSize: '2rem' }}>{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="card feature-card">
                <div className="card-header">
                  <div className="feature-icon" style={{ fontSize: '2.5rem' }}>
                    {feature.icon}
                  </div>
                  <Link to={feature.path} className="btn btn-primary btn-sm">
                    Open
                  </Link>
                </div>
                <h3>{feature.title}</h3>
                <p className="text-secondary">{feature.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {feature.tags.map((tag, i) => (
                    <span key={i} className="badge badge-secondary">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* System Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🔧 System Status</h3>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span className="status status-offline">
              <span className="status-dot" />
              Cloud APIs: Not Configured
            </span>
            <span className="status status-offline">
              <span className="status-dot" />
              Local Models: Not Available
            </span>
            <span className="status status-offline">
              <span className="status-dot" />
              Termux: Not Connected
            </span>
            <span className="status status-offline">
              <span className="status-dot" />
              GitHub: Not Connected
            </span>
          </div>
          <p style={{ marginTop: '16px', color: 'var(--steel-dim)', fontSize: '0.85rem' }}>
            Configure these in Settings to enable full functionality.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MainHub
