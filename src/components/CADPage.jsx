import React, { useState } from 'react'
import { motion } from 'framer-motion'

const CADPage = () => {
  const [activeTab, setActiveTab] = useState('2d')
  const [shapes, setShapes] = useState([])
  const [selectedTool, setSelectedTool] = useState(null)

  const tools2d = [
    { name: 'Rectangle', icon: '⬛', action: () => addShape('rect') },
    { name: 'Circle', icon: '⭕', action: () => addShape('circle') },
    { name: 'Line', icon: '➖', action: () => addShape('line') },
    { name: 'Text', icon: '🔤', action: () => addShape('text') }
  ]

  const tools3d = [
    { name: 'Cube', icon: '🟨', action: () => addShape('cube') },
    { name: 'Sphere', icon: '⚪', action: () => addShape('sphere') },
    { name: 'Cylinder', icon: '🟫', action: () => addShape('cylinder') }
  ]

  const addShape = (type) => {
    const newShape = {
      id: Date.now().toString(),
      type,
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
      width: 100,
      height: 100,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }
    setShapes([...shapes, newShape])
    setSelectedTool(null)
  }

  const deleteShape = (id) => {
    setShapes(shapes.filter(s => s.id !== id))
  }

  const renderShape = (shape) => {
    const commonStyle = {
      position: 'absolute' as const,
      left: shape.x,
      top: shape.y,
      cursor: 'move'
    }

    switch (shape.type) {
      case 'rect':
        return (
          <motion.div
            key={shape.id}
            style={{
              ...commonStyle,
              width: shape.width,
              height: shape.height,
              background: shape.color,
              border: '2px solid var(--steel)',
              borderRadius: '4px'
            }}
            drag
            onDragEnd={(e, info) => {
              setShapes(shapes.map(s => 
                s.id === shape.id ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y } : s
              ))
            }}
            onClick={(e) => { e.stopPropagation(); deleteShape(shape.id) }}
          />
        )
      case 'circle':
        return (
          <motion.div
            key={shape.id}
            style={{
              ...commonStyle,
              width: shape.width,
              height: shape.width,
              background: shape.color,
              border: '2px solid var(--steel)',
              borderRadius: '50%'
            }}
            drag
            onDragEnd={(e, info) => {
              setShapes(shapes.map(s => 
                s.id === shape.id ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y } : s
              ))
            }}
            onClick={(e) => { e.stopPropagation(); deleteShape(shape.id) }}
          />
        )
      case 'line':
        return (
          <motion.div
            key={shape.id}
            style={{
              ...commonStyle,
              width: shape.width,
              height: '2px',
              background: shape.color,
              transform: `rotate(${Math.random() * 90}deg)`,
              transformOrigin: 'left center'
            }}
            drag
            onDragEnd={(e, info) => {
              setShapes(shapes.map(s => 
                s.id === shape.id ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y } : s
              ))
            }}
            onClick={(e) => { e.stopPropagation(); deleteShape(shape.id) }}
          />
        )
      case 'text':
        return (
          <motion.div
            key={shape.id}
            style={{
              ...commonStyle,
              color: shape.color,
              fontFamily: 'Inter, sans-serif'
            }}
            drag
            onDragEnd={(e, info) => {
              setShapes(shapes.map(s => 
                s.id === shape.id ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y } : s
              ))
            }}
            onClick={(e) => { e.stopPropagation(); deleteShape(shape.id) }}
          >
            Text
          </motion.div>
        )
      case 'cube':
      case 'sphere':
      case 'cylinder':
        return (
          <motion.div
            key={shape.id}
            style={{
              ...commonStyle,
              width: shape.width,
              height: shape.height,
              background: shape.color,
              border: '2px solid var(--steel)',
              borderRadius: shape.type === 'sphere' ? '50%' : '4px'
            }}
            drag
            onDragEnd={(e, info) => {
              setShapes(shapes.map(s => 
                s.id === shape.id ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y } : s
              ))
            }}
            onClick={(e) => { e.stopPropagation(); deleteShape(shape.id) }}
          >
            <span style={{ fontSize: '0.8rem', color: 'white' }}>{shape.type}</span>
          </motion.div>
        )
      default:
        return null
    }
  }

  const currentTools = activeTab === '2d' ? tools2d : tools3d

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <span>📐</span>
          CAD & Design
        </h1>
        <p className="page-subtitle">
          Create 2D/3D designs and schematics
        </p>
      </div>

      <div className="page-content">
        <div className="tabs" style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--vault-light)', marginBottom: '20px' }}>
          <button 
            className={`tab ${activeTab === '2d' ? 'active' : ''}`}
            onClick={() => setActiveTab('2d')}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === '2d' ? 'var(--gold)' : 'var(--steel)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === '2d' ? '2px solid var(--gold)' : 'none'
            }}
          >
            2D Design
          </button>
          <button 
            className={`tab ${activeTab === '3d' ? 'active' : ''}`}
            onClick={() => setActiveTab('3d')}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === '3d' ? 'var(--gold)' : 'var(--steel)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === '3d' ? '2px solid var(--gold)' : 'none'
            }}
          >
            3D Design
          </button>
        </div>

        <div className="grid grid-2" style={{ gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Design Tools</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={tool.action}
                  className={`btn ${selectedTool === tool.name ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <span>{tool.icon}</span>
                  <span>{tool.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShapes([])}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '12px' }}
            >
              Clear All
            </button>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Design Canvas</h3>
              <button className="btn btn-secondary btn-sm">
                Export SVG
              </button>
            </div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '400px',
                background: 'var(--vault-deep)',
                border: '1px solid var(--vault-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}
              onClick={() => setSelectedTool(null)}
            >
              {shapes.map(renderShape)}
              
              {/* Grid */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(203, 161, 78, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(203, 161, 78, 0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                pointerEvents: 'none'
              }} />
              
              {/* Axes */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none'
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  height: '1px',
                  background: 'var(--steel-dim)',
                  transform: 'translateY(200px)'
                }} />
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  background: 'var(--steel-dim)',
                  transform: 'translateX(200px)'
                }} />
              </div>
            </div>
            <p style={{ marginTop: '12px', color: 'var(--steel-dim)', fontSize: '0.85rem' }}>
              Click a tool to add shapes. Click shapes to delete them.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📚 About CAD & Design</h3>
          </div>
          <p style={{ color: 'var(--steel)' }}>
            This is a prototype 2D/3D design interface. In a full implementation, this would include:
          </p>
          <ul style={{ color: 'var(--steel-dim)', marginTop: '12px', paddingLeft: '20px' }}>
            <li>Parametric design with code</li>
            <li>Circuit schematics</li>
            <li>3D modeling with Three.js</li>
            <li>Animation tools</li>
            <li>PDF/SVG export</li>
          </ul>
          <p style={{ color: 'var(--steel)', marginTop: '12px' }}>
            Current implementation uses 2D canvas with mock shapes for demonstration.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CADPage
