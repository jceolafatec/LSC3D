# LSC Fitouts – 3D + PDF Client Dashboard

A static, shareable client viewer for LSC Fitouts projects featuring interactive 3D models and digital drawing sets.

**Live Demo:** https://yourusername.github.io/lsc-dashboard/?p=jbhifi-sydney

## Features

✨ **Interactive 3D Viewing**
- Full orbit controls (rotate, zoom, pan)
- Lighting and material rendering
- Automatic model centering and camera fit
- WebGL rendering via Three.js

📄 **PDF Drawing Viewer**
- Page navigation
- Zoom controls
- Print support
- High-quality rendering

🎨 **Professional Branding**
- LSC Fitouts branding (navy, gold, white)
- Responsive design
- Clean, modern interface
- Mobile-friendly layout

🔗 **Unique Share Links**
- Each project gets a unique URL
- No authentication required
- Static hosting (GitHub Pages compatible)
- Send directly to clients

## Quick Start

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

### Build & Deploy

```bash
npm run build
# Push dist/ folder to GitHub Pages
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx    # Main layout
│   ├── Header.jsx       # Top navigation
│   ├── Sidebar.jsx      # Project info & navigation
│   ├── ThreeDViewer.jsx # 3D model viewer
│   ├── PdfViewer.jsx    # PDF drawing viewer
│   └── ErrorPage.jsx    # Error display
├── lib/
│   └── projectLoader.js # Data loading utilities
└── styles/              # Component CSS with LSC colors

public/
├── data/
│   └── projects.json    # Project catalog
├── models/              # 3D model files (.glb)
└── pdf/                 # Drawing PDFs
```

## Adding Projects

1. **Edit `public/data/projects.json`**

```json
{
  "id": "project-id",
  "title": "Project Name",
  "client": "Client Name",
  "address": "Location",
  "date": "2026-04-02",
  "status": "completed",
  "model_path": "models/project/model.glb",
  "pdf_path": "pdf/project-drawings.pdf"
}
```

2. **Add 3D Model**
   - Export as `.glb` from your CAD/design software
   - Place in `public/models/{project-name}/model.glb`

3. **Add PDF**
   - Place in `public/pdf/{project-name}.pdf`

4. **Deploy**
   ```bash
   npm run build
   git add . && git commit -m "Add new project"
   git push
   ```

## Sharing Links

Send clients project-specific URLs:

```
https://yourusername.github.io/lsc-dashboard/?p=project-id
```

Example:
```
https://yourusername.github.io/lsc-dashboard/?p=jbhifi-sydney
```

## Technologies

- **React 18** – UI framework
- **Vite** – Build tool & dev server
- **Three.js** – 3D rendering
- **PDF.js** – PDF viewer
- **CSS3** – Styling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

### Colors

Edit `/src/styles/globals.css`:

```css
--color-dark: #0A0A0A;       /* Navy/Black */
--color-gold: #C8A45D;       /* Gold accent */
--color-light-grey: #F5F5F5; /* Light grey */
```

### Fonts

```css
--font-sans: 'Inter', -apple-system, ...;
```

## Performance

- Fully static (no server required)
- Automatic code splitting
- Optimized 3D rendering
- Progressive PDF loading
- ~100KB base JS (with gzip)

## Troubleshooting

**Q: 3D model won't load?**
- Ensure `.glb` file is valid and under 50MB
- Check browser console for errors
- Test locally with `npm run dev`

**Q: PDF shows blank?**
- Verify PDF path in projects.json
- Ensure PDF is under 10MB
- Check file permissions

**Q: Assets 404 on GitHub Pages?**
- Verify `base` URL in `vite.config.js`
- Ensure files are in `/public/`
- Hard refresh browser cache

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more troubleshooting.

## License

© 2026 LSC Fitouts. All rights reserved.

## Support

For setup help or issues, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

**Built with ❤️ for LSC Fitouts**
