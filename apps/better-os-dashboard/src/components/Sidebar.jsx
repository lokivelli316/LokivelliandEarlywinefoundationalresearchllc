import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: '🏠', label: 'Main Hub' },
    { path: '/chat', icon: '💬', label: 'Chat' },
    { path: '/physics', icon: '⚛️', label: 'Physics' },
    { path: '/notebook', icon: '📓', label: 'Notebook' },
    { path: '/media', icon: '🎨', label: 'Media' },
    { path: '/cad', icon: '📐', label: 'CAD' },
    { path: '/agents', icon: '🤖', label: 'Agents' },
    { path: '/finance', icon: '💰', label: 'Finance' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Better OS</h1>
        <p>Infinite Brain</p>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="status status-offline">
          <span className="status-dot" />
          Offline Mode
        </span>
      </div>
    </aside>
  )
}

export default Sidebar
