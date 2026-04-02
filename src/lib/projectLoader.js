/**
 * Load project data from JSON file
 */
export async function loadProjectFromUrl(projectId) {
  if (!projectId) {
    throw new Error('Project ID is required')
  }

  try {
    // Fetch the projects index
    const response = await fetch(`${import.meta.env.BASE_URL}data/projects.json`)
    if (!response.ok) {
      throw new Error('Failed to fetch projects index')
    }

    const projects = await response.json()

    // Find project by ID
    const project = projects.find(p => p.id === projectId || p.asset_key === projectId)

    if (!project) {
      throw new Error(`Project "${projectId}" not found in the index`)
    }

    // Validate project has required fields
    if (!project.title) {
      throw new Error('Project is missing required "title" field')
    }

    return {
      id: project.id,
      title: project.title || 'Untitled Project',
      client: project.client || 'Client Name',
      description: project.description || '',
      address: project.address || 'Location',
      date: project.date || new Date().toISOString().split('T')[0],
      status: project.status || 'completed',
      modelUrl: project.model_path ? `${import.meta.env.BASE_URL}${project.model_path}` : null,
      pdfUrl: project.pdf_path ? `${import.meta.env.BASE_URL}${project.pdf_path}` : null,
      thumbnail: project.image ? `${import.meta.env.BASE_URL}${project.image}` : null,
      galleryImages: project.gallery_images || [],
      // Keep original data for reference
      _raw: project
    }
  } catch (error) {
    console.error('Error loading project:', error)
    throw error
  }
}

/**
 * Get all available projects
 */
export async function loadAllProjects() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/projects.json`)
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
}
