import React from 'react'
import '../styles/Header.css'

export default function Header({ project, sidebarOpen, onToggleSidebar }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar} title="Toggle sidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="logo">
          <span className="logo-text">LSC</span>
        </div>
      </div>

      <div className="header-center">
        <h1 className="project-title">{project.title}</h1>
        <p className="project-client">{project.client}</p>
      </div>

      <div className="header-right">
        <span className={`status-badge status-${project.status}`}>
          {project.status || 'completed'}
        </span>
      </div>
    </header>
  )
}
