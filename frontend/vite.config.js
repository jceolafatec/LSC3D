import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * During build, copy the standalone static assets (CSS, JS, img) into the dist
 * output so that home.html and viewer.html can reference them correctly.
 */
function createStaticViewerAssetPlugin() {
  const workspaceRoot = process.cwd()
  const assetsSource = path.resolve(workspaceRoot, 'assets')
  const assetsTarget = path.resolve(workspaceRoot, 'dist/assets')

  async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true })
    const entries = await fs.readdir(src, { withFileTypes: true })
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath)
      } else {
        await fs.copyFile(srcPath, destPath)
      }
    }
  }

  return {
    name: 'static-viewer-asset-plugin',
    async closeBundle() {
      await copyDir(assetsSource, assetsTarget)
    },
  }
}

export default defineConfig({
  plugins: [react(), createStaticViewerAssetPlugin()],

  // Always serve from root — no GitHub Pages subpath needed.
  base: '/',

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        client: path.resolve(import.meta.dirname, 'client.html'),
        viewer: path.resolve(import.meta.dirname, 'viewer.html'),
        home: path.resolve(import.meta.dirname, 'home.html'),
      },
    },
  },

  server: {
    // During local dev, forward API and project asset requests to the backend.
    proxy: {
      '/api': 'http://localhost:3100',
      '/projects': 'http://localhost:3100',
    },
  },
})
