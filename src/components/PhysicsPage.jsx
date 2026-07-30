import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import * as math from 'mathjs'
import katex from 'katex'
import { v4 as uuidv4 } from 'uuid'

const PhysicsPage = () => {
  const { physicsNotebooks, addPhysicsNotebook } = useStore()
  const [equation, setEquation] = useState('')
  const [expected, setExpected] = useState('')
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('verify')

  const PHYSICS_CONSTANTS = {
    c: 299792458,
    h: 6.62607015e-34,
    G: 6.67430e-11,
    e: 1.602176634e-19,
    me: 9.1093837015e-31
  }

  const handleVerify = () => {
    if (!equation || !expected) return
    
    try {
      const parsedEq = math.parse(equation)
      const parsedExpected = math.parse(expected)
      
      const simplifiedEq = parsedEq.toString()
      const simplifiedExpected = parsedExpected.toString()
      
      const isEqual = math.simplify(equation).toString() === math.simplify(expected).toString()
      
      setResult({
        valid: isEqual,
        simplifiedEq,
        simplifiedExpected,
        error: isEqual ? null : 'Equations do not match'
      })
    } catch (error) {
      setResult({
        valid: false,
        simplifiedEq: null,
        simplifiedExpected: null,
        error: error.message
      })
    }
  }

  const renderMath = (expr) => {
    try {
      return katex.renderToString(expr, { throwOnError: false, displayMode: true })
    } catch {
      return expr
    }
  }

  const templates = [
    { name: 'Einstein E=mc²', equation: 'E = m * c^2' },
    { name: 'Newton F=ma', equation: 'F = m * a' },
    { name: 'Kinetic Energy', equation: 'KE = 0.5 * m * v^2' },
    { name: 'Coulomb Law', equation: 'F = k * q1 * q2 / r^2' }
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <span>⚛️</span>
          Physics Lab
        </h1>
        <p className="page-subtitle">
          Equation verification and physics computation
        </p>
      </div>

      <div className="page-content">
        <div className="tabs" style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--vault-light)', marginBottom: '20px' }}>
          <button 
            className={`tab ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => setActiveTab('verify')}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'verify' ? 'var(--gold)' : 'var(--steel)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 'verify' ? '2px solid var(--gold)' : 'none'
            }}
          >
            Verify Equations
          </button>
          <button 
            className={`tab ${activeTab === 'constants' ? 'active' : ''}`}
            onClick={() => setActiveTab('constants')}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'constants' ? 'var(--gold)' : 'var(--steel)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 'constants' ? '2px solid var(--gold)' : 'none'
            }}
          >
            Constants
          </button>
        </div>

        {activeTab === 'verify' && (
          <div>
            <div className="grid grid-2" style={{ gap: '20px' }}>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">🔍 Equation Verifier</h3>
                </div>
                <div className="form-group">
                  <label className="form-label">Equation to Verify</label>
                  <textarea
                    value={equation}
                    onChange={(e) => setEquation(e.target.value)}
                    placeholder="Enter equation (e.g., E = m*c^2)"
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Result</label>
                  <textarea
                    value={expected}
                    onChange={(e) => setExpected(e.target.value)}
                    placeholder="Enter expected simplified form"
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                <button 
                  onClick={handleVerify}
                  className="btn btn-primary"
                  disabled={!equation || !expected}
                >
                  Verify
                </button>
                
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`alert ${result.valid ? 'alert-success' : 'alert-error'}`}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      marginTop: '16px',
                      background: result.valid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: result.valid ? 'var(--success)' : 'var(--error)'
                    }}
                  >
                    {result.valid ? (
                      <span>✅ Equations match!</span>
                    ) : (
                      <span>❌ {result.error}</span>
                    )}
                    {result.simplifiedEq && (
                      <div style={{ marginTop: '8px' }}>
                        <strong>Your equation:</strong> {result.simplifiedEq}
                      </div>
                    )}
                    {result.simplifiedExpected && (
                      <div>
                        <strong>Expected:</strong> {result.simplifiedExpected}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">⚡ Quick Templates</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {templates.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => setEquation(template.equation)}
                      className="btn btn-secondary btn-sm"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📚 Physics Constants</h3>
              </div>
              <div className="grid grid-3" style={{ gap: '12px' }}>
                {Object.entries(PHYSICS_CONSTANTS).map(([key, value]) => (
                  <div
                    key={key}
                    className="constant-card"
                    style={{
                      padding: '12px',
                      background: 'var(--vault-light)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.25rem', color: 'var(--gold)' }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--steel)' }}>
                      {value.toExponential(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'constants' && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">🔢 All Physics Constants</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--vault-light)' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: 'var(--steel)' }}>Symbol</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: 'var(--steel)' }}>Name</th>
                  <th style={{ textAlign: 'right', padding: '12px', color: 'var(--steel)' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(PHYSICS_CONSTANTS).map(([key, value]) => (
                  <tr key={key} style={{ borderBottom: '1px solid var(--vault-deep)' }}>
                    <td style={{ padding: '12px', color: 'var(--paper)' }}>{key}</td>
                    <td style={{ padding: '12px', color: 'var(--steel)' }}>
                      {{
                        c: 'Speed of Light',
                        h: 'Planck Constant',
                        G: 'Gravitational Constant',
                        e: 'Elementary Charge',
                        me: 'Electron Mass'
                      }[key] || key}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: 'var(--steel)' }}>
                      {value.toExponential(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhysicsPage
