import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import ThreeDViewer from './ThreeDViewer'
import PdfViewer from './PdfViewer'
import '../styles/Dashboard.css'

export default function Dashboard({ project }) {
  const [activeTab, setActiveTab] = useState('3d') // 'model' or 'pdf'
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="dashboard">
      <Header project={project} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="dashboard-content">
        <Sidebar project={project} activeTab={activeTab} setActiveTab={setActiveTab} open={sidebarOpen} />

        <div className="viewer-container">
          {activeTab === '3d' && project.modelUrl ? (
            <ThreeDViewer modelUrl={project.modelUrl} project={project} />
          ) : activeTab === 'pdf' && project.pdfUrl ? (
            <PdfViewer pdfUrl={project.pdfUrl} />
          ) : (
            <div className="viewer-placeholder">
              <p>No {activeTab === '3d' ? '3D model' : 'PDF'} available for this project.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
