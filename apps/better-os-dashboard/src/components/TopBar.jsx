import React from 'react'
import { useLocation, Link } from 'react-router-dom'

const TopBar = () => {
  const location = useLocation()

  const getBreadcrumb = () => {
    const path = location.pathname.split('/').filter(Boolean)
    if (path.length === 0) return [{ label: 'Main Hub', path: '/' }]
    
    const labels = {
      'chat': 'Chat',
      'physics': 'Physics',
      'notebook': 'Notebook',
      'media': 'Media',
      'cad': 'CAD',
      'agents': 'Agents',
      'finance': 'Finance',
      'settings': 'Settings'
    }
    
    return [
      { label: 'Main Hub', path: '/' },
      ...path.map(p => ({ label: labels[p] || p, path: `/${p}` }))
    ]
  }

  const breadcrumbs = getBreadcrumb()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <span className="breadcrumb-separator">›</span>}
              {index < breadcrumbs.length - 1 ? (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="topbar-right">
        <span className="time">
          {new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </header>
  )
}

export default TopBar
