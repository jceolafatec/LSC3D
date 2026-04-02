import React, { useState, useEffect } from 'react'
import '../styles/PdfViewer.css'

export default function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(100)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const iframeRef = React.useRef(null)

  useEffect(() => {
    if (!pdfUrl) {
      setError('No PDF URL provided')
      setLoading(false)
      return
    }

    // Use PDF.js viewer or iframe
    setLoading(false)
  }, [pdfUrl])

  const handleZoomIn = () => setScale(prev => Math.min(prev + 10, 200))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 10, 50))
  const handleNextPage = () => setCurrentPage(prev => (numPages ? Math.min(prev + 1, numPages) : prev))
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

  if (error) {
    return <div className="pdf-error"><p>{error}</p></div>
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar">
        <button onClick={handlePrevPage} disabled={currentPage === 1} title="Previous page">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span className="page-indicator">Page {currentPage}</span>
        <button onClick={handleNextPage} title="Next page">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div className="toolbar-divider"></div>

        <button onClick={handleZoomOut} title="Zoom out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        <span className="zoom-indicator">{scale}%</span>
        <button onClick={handleZoomIn} title="Zoom in">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
      </div>

      <div className="pdf-container" style={{ transform: `scale(${scale / 100})` }}>
        <iframe
          ref={iframeRef}
          src={`${pdfUrl}#page=${currentPage}`}
          title="PDF Viewer"
          className="pdf-frame"
        />
      </div>

      {loading && <div className="pdf-loading">Loading PDF...</div>}
    </div>
  )
}
