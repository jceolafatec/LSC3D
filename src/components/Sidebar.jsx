import React from 'react'
import '../styles/Sidebar.css'

export default function Sidebar({ project, activeTab, setActiveTab, open }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const statusLabel = {
    completed: 'Completed',
    in_progress: 'In Progress',
    pending: 'Pending',
    on_hold: 'On Hold'
  }

  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Project Details</h2>
      </div>

      <div className="sidebar-content">
        <div className="info-section">
          <div className="info-item">
            <label>Client</label>
            <p>{project.client}</p>
          </div>
          <div className="info-item">
            <label>Location</label>
            <p>{project.address}</p>
          </div>
          <div className="info-item">
            <label>Date</label>
            <p>{formatDate(project.date)}</p>
          </div>
          <div className="info-item">
            <label>Status</label>
            <p className={`status ${project.status}`}>
              {statusLabel[project.status] || project.status}
            </p>
          </div>
        </div>

        {project.description && (
          <div className="description-section">
            <h3>Description</h3>
            <p>{project.description}</p>
          </div>
        )}

        <div className="tab-navigation">
          <h3>View</h3>
          <div className="tab-buttons">
            {project.modelUrl && (
              <button
                className={`tab-btn ${activeTab === '3d' ? 'active' : ''}`}
                onClick={() => setActiveTab('3d')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
                3D Model
              </button>
            )}
            {project.pdfUrl && (
              <button
                className={`tab-btn ${activeTab === 'pdf' ? 'active' : ''}`}
                onClick={() => setActiveTab('pdf')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Drawings
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
