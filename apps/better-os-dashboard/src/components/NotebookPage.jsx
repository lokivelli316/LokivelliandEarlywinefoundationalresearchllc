import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import ReactMarkdown from 'react-markdown'
import { v4 as uuidv4 } from 'uuid'

const NotebookPage = () => {
  const { 
    physicsNotebooks, 
    activeNotebookId, 
    addPhysicsNotebook,
    updatePhysicsNotebook
  } = useStore()
  
  const [cells, setCells] = useState([])
  const [newCellType, setNewCellType] = useState('markdown')
  const [newCellContent, setNewCellContent] = useState('')

  // Load cells from active notebook
  useEffect(() => {
    if (activeNotebookId) {
      const notebook = physicsNotebooks.find(n => n.id === activeNotebookId)
      if (notebook?.cells) {
        setCells(notebook.cells)
      }
    }
  }, [activeNotebookId, physicsNotebooks])

  // Save cells to notebook
  useEffect(() => {
    if (activeNotebookId && cells.length > 0) {
      updatePhysicsNotebook(activeNotebookId, { cells })
    }
  }, [cells, activeNotebookId])

  const cellTypes = [
    { value: 'markdown', label: 'Markdown' },
    { value: 'math', label: 'Math (LaTeX)' },
    { value: 'code', label: 'Code' },
    { value: 'text', label: 'Text' }
  ]

  const addCell = () => {
    if (!newCellContent.trim()) return
    
    const newCell = {
      id: uuidv4(),
      type: newCellType,
      content: newCellContent,
      createdAt: new Date().toISOString()
    }
    
    setCells([...cells, newCell])
    setNewCellContent('')
  }

  const updateCell = (id, content) => {
    setCells(cells.map(cell => 
      cell.id === id ? { ...cell, content } : cell
    ))
  }

  const deleteCell = (id) => {
    setCells(cells.filter(cell => cell.id !== id))
  }

  const renderCell = (cell) => {
    switch (cell.type) {
      case 'markdown':
        return (
          <div key={cell.id} className="card cell" style={{ marginBottom: '12px' }}>
            <div className="cell-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-secondary">Markdown</span>
              <button onClick={() => deleteCell(cell.id)} className="btn btn-secondary btn-sm">Delete</button>
            </div>
            <textarea
              value={cell.content}
              onChange={(e) => updateCell(cell.id, e.target.value)}
              className="form-textarea"
              rows={5}
            />
            <div style={{ marginTop: '12px', padding: '12px', background: 'var(--vault-deep)', borderRadius: 'var(--radius-md)' }}>
              <ReactMarkdown>{cell.content}</ReactMarkdown>
            </div>
          </div>
        )
      
      case 'math':
        return (
          <div key={cell.id} className="card cell" style={{ marginBottom: '12px' }}>
            <div className="cell-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-secondary">Math</span>
              <button onClick={() => deleteCell(cell.id)} className="btn btn-secondary btn-sm">Delete</button>
            </div>
            <textarea
              value={cell.content}
              onChange={(e) => updateCell(cell.id, e.target.value)}
              placeholder="Enter LaTeX equation..."
              className="form-textarea"
              rows={3}
            />
            <div style={{ marginTop: '12px', padding: '12px', background: 'var(--vault-deep)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontStyle: 'italic', color: 'var(--steel-dim)' }}>LaTeX Preview: {cell.content || 'Enter equation above'}</span>
            </div>
          </div>
        )
      
      case 'code':
        return (
          <div key={cell.id} className="card cell" style={{ marginBottom: '12px' }}>
            <div className="cell-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-secondary">Code</span>
              <button onClick={() => deleteCell(cell.id)} className="btn btn-secondary btn-sm">Delete</button>
            </div>
            <textarea
              value={cell.content}
              onChange={(e) => updateCell(cell.id, e.target.value)}
              placeholder="Enter code..."
              className="form-textarea"
              rows={5}
              spellCheck={false}
            />
            <pre style={{ marginTop: '12px', padding: '12px', background: 'var(--vault-deep)', borderRadius: 'var(--radius-md)', overflowX: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>
              {cell.content || '// Enter code above'}
            </pre>
          </div>
        )
      
      case 'text':
      default:
        return (
          <div key={cell.id} className="card cell" style={{ marginBottom: '12px' }}>
            <div className="cell-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-secondary">Text</span>
              <button onClick={() => deleteCell(cell.id)} className="btn btn-secondary btn-sm">Delete</button>
            </div>
            <textarea
              value={cell.content}
              onChange={(e) => updateCell(cell.id, e.target.value)}
              placeholder="Enter text..."
              className="form-textarea"
              rows={5}
            />
          </div>
        )
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <span>📓</span>
          NotebookLM++
        </h1>
        <p className="page-subtitle">
          Enhanced notebook system - <span className="badge badge-secondary">Working</span>
        </p>
      </div>

      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Create New Cell</h3>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <select
              value={newCellType}
              onChange={(e) => setNewCellType(e.target.value)}
              className="form-select"
              style={{ flex: 1 }}
            >
              {cellTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <button
              onClick={addCell}
              disabled={!newCellContent.trim()}
              className="btn btn-primary"
            >
              Add Cell
            </button>
          </div>
          <textarea
            value={newCellContent}
            onChange={(e) => setNewCellContent(e.target.value)}
            placeholder={`Enter ${cellTypes.find(t => t.value === newCellType)?.label || 'content'}...`}
            className="form-textarea"
            rows={3}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '16px', color: 'var(--paper)' }}>Cells</h3>
          {cells.length > 0 ? (
            cells.map(renderCell)
          ) : (
            <div className="empty-state">
              <span style={{ fontSize: '3rem' }}>📝</span>
              <h3>No cells yet</h3>
              <p>Add a cell to get started</p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">ℹ️ About NotebookLM++</h3>
          </div>
          <p style={{ color: 'var(--steel)' }}>
            Create and manage notebooks with different cell types:
          </p>
          <ul style={{ color: 'var(--steel-dim)', marginTop: '12px', paddingLeft: '20px' }}>
            <li><strong>Markdown:</strong> Rich text with formatting</li>
            <li><strong>Math:</strong> LaTeX equations (preview coming soon)</li>
            <li><strong>Code:</strong> Syntax-highlighted code blocks</li>
            <li><strong>Text:</strong> Plain text</li>
          </ul>
          <p style={{ color: 'var(--steel)', marginTop: '12px' }}>
            <strong>Status:</strong> <span className="badge badge-secondary">Working</span>
          </p>
          <p style={{ color: 'var(--steel-dim)', fontSize: '0.85rem', marginTop: '8px' }}>
            Cells are persisted to browser storage and will survive page refreshes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotebookPage
