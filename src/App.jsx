import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import ErrorPage from './components/ErrorPage'
import { loadProjectFromUrl } from './lib/projectLoader'
import './styles/App.css'

export default function App() {
  const [project, setProject] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      try {
        const params = new URLSearchParams(window.location.search)
        const projectId = params.get('p')

        if (!projectId) {
          setError('No project ID provided. Use ?p=projectId to load a project.')
          setLoading(false)
          return
        }

        const projectData = await loadProjectFromUrl(projectId)
        setProject(projectData)
      } catch (err) {
        setError(err.message || 'Failed to load project. Please check the project ID.')
        console.error('Project load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [])

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Loading project...</p>
      </div>
    )
  }

  if (error) {
    return <ErrorPage message={error} />
  }

  if (!project) {
    return <ErrorPage message="Project not found." />
  }

  return <Dashboard project={project} />
}
