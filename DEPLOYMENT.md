# LSC Fitouts Dashboard – GitHub Pages Deployment Guide

## Project Structure

```
lsc-dashboard/
├── src/
│   ├── components/          # React components
│   ├── lib/                 # Utilities (projectLoader.js)
│   ├── styles/              # CSS files (LSC branded)
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/
│   ├── data/
│   │   └── projects.json    # Project index (static JSON)
│   └── projects/            # Client folders with models & PDFs
│       ├── JB-Hi-Fi/
│       ├── DDA-Dental-Parkview/
│       └── ...
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
└── dist/                    # Build output (generated)
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Local Development

```bash
npm run dev
```

Opens dev server at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

Generates optimized build in `/dist` folder.

### 4. Test Production Build

```bash
npm run preview
```

### 5. Deploy to GitHub Pages

#### Option A: Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Push the `/dist` folder to your `gh-pages` branch:
   ```bash
   git add dist/
   git commit -m "Deploy: Update dashboard"
   git push origin `git subtree split --prefix dist main`:gh-pages --force
   ```

3. Go to your GitHub repository **Settings** → **Pages** and ensure:
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/ (root)`

#### Option B: Automated Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Then commit and push:
```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push
```

## Base URL Configuration

The `vite.config.js` is set to deploy to:
```
https://yourusername.github.io/lsc-dashboard/
```

To change the base URL, edit `vite.config.js`:
```javascript
base: '/your-custom-path/'
```

## Publishing Projects

### Project Data Structure

All projects are defined in `/public/data/projects.json`:

```json
{
  "id": "project-id",
  "title": "Project Title",
  "client": "Client Name",
  "address": "Location",
  "date": "2026-02-15",
  "status": "completed|in_progress|pending|on_hold",
  "description": "Project description",
  "model_path": "projects/ClientName/models/model.glb",
  "pdf_path": "projects/ClientName/drawings/plan.pdf",
  "image": "projects/ClientName/thumbnail.jpg",
  "gallery_images": ["projects/ClientName/gallery/img1.jpg"]
}
```

### Share Links

Share links use the project `id`:
```
https://yourusername.github.io/lsc-dashboard/?p=project-id
```

Example:
```
https://yourusername.github.io/lsc-dashboard/?p=jbhifi-sydney
```

### Adding a New Project

1. Create a client folder in `public/projects/`:
   ```
   public/projects/Client-Name/
   ├── models/
   │   └── main-model.glb
   ├── drawings/
   │   └── plan-set.pdf
   ├── gallery/
   │   └── render-1.jpg
   └── thumbnail.jpg
   ```

2. Add entry to `/public/data/projects.json`:
   ```json
   {
     "id": "client-project-id",
     "title": "Project Title",
     "client": "Client Name",
     "address": "Location",
     "date": "2026-XX-XX",
     "status": "completed",
     "description": "Description",
     "model_path": "projects/Client-Name/models/main-model.glb",
     "pdf_path": "projects/Client-Name/drawings/plan-set.pdf",
     "image": "projects/Client-Name/thumbnail.jpg",
     "gallery_images": []
   }
   ```

3. Rebuild and deploy:
   ```bash
   npm run build
   git add dist/
   git commit -m "Add new project: Client Name"
   git push
   ```

## File Size Optimization

### GLB Models
- Target: < 10MB per model
- Tools: Blender export with compression, Draco compression
- Fallback: Placeholder geometry if texture decode fails

### PDFs
- Target: < 5MB per document
- Tools: PDF compression software, check for embedded fonts

### Images
- Target: < 500KB per image
- Tools: ImageOptim, TinyPNG, or similar

## Troubleshooting

### "Project not found" error
- Check project `id` matches the URL parameter `?p=id`
- Verify `projects.json` is correctly formatted (valid JSON)
- Check file paths in project entry use correct case (Linux is case-sensitive)

### 3D Model won't load
- Verify GLB file path is correct and file exists
- Check file size (> 100MB may timeout)
- Try reducing model complexity or applying Draco compression
- Check browser console for specific error

### PDF won't display
- Verify PDF file path is correct
- Check CORS headers (GitHub Pages serves with correct CORS)
- Ensure PDF is not corrupted (test locally)

### Styling looks broken
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Check that base URL is correct in vite.config.js

## Environment Variables

For custom deployments, you can set:
```bash
VITE_BASE_URL=/custom-path/ npm run build
```

## Performance Tips

1. **Lazy load models**: Models only load when 3D tab is active
2. **Compress PDF**: Use PDFCompress.com or similar
3. **Optimize images**: Use WebP format where possible
4. **Cache busting**: Vite automatically handles hash-based cache busting

## Support

For issues:
1. Check browser console for errors (F12 → Console)
2. Verify all file paths and URLs
3. Test locally with `npm run dev` first
4. Check GitHub Actions logs if automated deployment fails

---

**Ready to deploy?** Run:
```bash
npm run build
```

Then follow Option A or Option B above to deploy to GitHub Pages.
