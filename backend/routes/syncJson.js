'use strict'

const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

const MODEL_EXTS = new Set(['glb', 'gltf'])
const PDF_EXTS = new Set(['pdf'])
const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'webp'])

function getExt(filePath) {
  return (filePath.split('.').pop() || '').toLowerCase()
}

function titleFromSlug(slug) {
  if (!slug) return 'Untitled'
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

function collectFiles(dir, root) {
  const results = []
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'Icon') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...collectFiles(full, root))
    } else {
      results.push(path.relative(root, full).split(path.sep).join('/'))
    }
  }
  return results
}

function parseMetaXml(xmlText) {
  try {
    const attr = (tag, attrName) => {
      const re = new RegExp(`<${tag}[^>]*\\s${attrName}="([^"]*)"`, 'i')
      const m = xmlText.match(re)
      return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>') : ''
    }
    const textContent = (tag) => {
      const re = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i')
      const m = xmlText.match(re)
      return m ? m[1].trim() : ''
    }

    const clientName = textContent('clientName')
    const jobName = textContent('jobName')

    // Extract all <drawing .../> elements
    const drawingRe = /<drawing\s([^/]*)\/?>/gi
    const drawings = []
    let dm
    while ((dm = drawingRe.exec(xmlText)) !== null) {
      const attrsStr = dm[1]
      const getAttr = (name) => {
        const re = new RegExp(`\\s${name}="([^"]*)"`)
        const m = attrsStr.match(re)
        return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>') : ''
      }
      drawings.push({
        slug: getAttr('slug'),
        name: getAttr('name'),
        modelUrl: getAttr('modelUrl'),
        pdfUrl: getAttr('pdfUrl'),
        imageUrl: getAttr('imageUrl'),
      })
    }

    return { clientName, jobName, drawings }
  } catch {
    return null
  }
}

/**
 * POST /api/sync-json
 * Scans all client/job folders, merges project-meta.xml overrides,
 * and writes the result to projects/projects.json.
 */
router.post('/', (req, res) => {
  const projectsRoot = req.app.get('projectsRoot')
  const outputPath = path.join(projectsRoot, 'projects.json')

  let clientDirs
  try {
    clientDirs = fs.readdirSync(projectsRoot, { withFileTypes: true })
  } catch {
    return res.status(500).json({ error: 'Cannot read projects directory' })
  }

  const projects = []

  for (const clientEntry of clientDirs) {
    if (!clientEntry.isDirectory()) continue
    if (clientEntry.name.startsWith('.') || clientEntry.name === 'Icon') continue

    const clientSlug = clientEntry.name
    const clientDir = path.join(projectsRoot, clientSlug)

    let jobDirs
    try {
      jobDirs = fs.readdirSync(clientDir, { withFileTypes: true })
    } catch {
      continue
    }

    for (const jobEntry of jobDirs) {
      if (!jobEntry.isDirectory()) continue
      if (jobEntry.name.startsWith('.') || jobEntry.name === 'Icon') continue

      const jobSlug = jobEntry.name
      const jobDir = path.join(clientDir, jobSlug)

      // Collect all files in job folder
      const files = collectFiles(jobDir, jobDir)
      const modelFiles = []
      const drawingFiles = []
      const previewFiles = []

      for (const rel of files) {
        // Skip the meta xml itself
        if (rel === 'project-meta.xml' || rel === 'projects.json') continue
        const ext = getExt(rel)
        const url = `/projects/${clientSlug}/${jobSlug}/${rel}`
        if (MODEL_EXTS.has(ext)) modelFiles.push(url)
        else if (PDF_EXTS.has(ext)) drawingFiles.push(url)
        else if (IMAGE_EXTS.has(ext)) previewFiles.push(url)
      }

      modelFiles.sort()
      drawingFiles.sort()
      previewFiles.sort()

      // Try to load project-meta.xml for overrides
      let meta = null
      const metaPath = path.join(jobDir, 'project-meta.xml')
      try {
        const xmlText = fs.readFileSync(metaPath, 'utf8')
        meta = parseMetaXml(xmlText)
      } catch {
        // No metadata file — use folder-derived values only
      }

      const modelPreviewImage =
        previewFiles.find((f) => /\/model\.(png|jpg|jpeg|webp)$/i.test(f)) ||
        previewFiles[0] ||
        ''

      // Build drawing entries: prefer meta drawings, fall back to auto-detected files
      let drawings
      if (meta && meta.drawings && meta.drawings.length > 0) {
        drawings = meta.drawings.map((d) => ({
          slug: d.slug,
          name: d.name || titleFromSlug(d.slug),
          pdfUrl: d.pdfUrl || '',
          modelUrl: d.modelUrl || '',
          imageUrl: d.imageUrl || '',
        }))
      } else {
        // Auto-build one drawing entry per PDF / GLB pair found
        const pdfs = [...drawingFiles]
        const models = [...modelFiles]
        const count = Math.max(pdfs.length, models.length, 1)
        drawings = []
        for (let i = 0; i < count; i++) {
          const pdfUrl = pdfs[i] || ''
          const modelUrl = models[i] || ''
          const slug =
            pdfUrl
              ? path.basename(pdfUrl, path.extname(pdfUrl))
              : modelUrl
                ? path.basename(modelUrl, path.extname(modelUrl))
                : `drawing-${i + 1}`
          drawings.push({
            slug,
            name: titleFromSlug(slug),
            pdfUrl,
            modelUrl,
            imageUrl: '',
          })
        }
      }

      projects.push({
        clientSlug,
        clientName: (meta && meta.clientName) || titleFromSlug(clientSlug),
        jobSlug,
        jobName: (meta && meta.jobName) || titleFromSlug(jobSlug),
        projectFolder: `${clientSlug}/${jobSlug}`,
        modelFiles,
        drawingFiles,
        previewFiles,
        modelPreviewImage,
        hasModel: modelFiles.length > 0,
        hasPdf: drawingFiles.length > 0,
        drawings,
        updatedAt: new Date().toISOString(),
      })
    }
  }

  // Sort by clientSlug then jobSlug
  projects.sort((a, b) => {
    const c = a.clientSlug.localeCompare(b.clientSlug)
    return c !== 0 ? c : a.jobSlug.localeCompare(b.jobSlug)
  })

  try {
    fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2), 'utf8')
  } catch (err) {
    return res.status(500).json({ error: `Failed to write projects.json: ${err.message}` })
  }

  return res.status(200).json({
    success: true,
    count: projects.length,
    outputPath: 'projects/projects.json',
  })
})

module.exports = router
