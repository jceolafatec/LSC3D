# LSC Fitouts Client Viewer

React + Vite frontend served by a Node.js / Express backend.

## Architecture

```
Browser → Express (port 3100) → /api/* routes → projects/ filesystem
                              → /projects/*   → static GLB / PDF files
                              → /*            → React SPA (frontend/dist)
```

## Run Commands

```bash
# Install all dependencies
npm run install:all

# Development — start backend
npm run dev:backend

# Development — start frontend (Vite dev server)
npm run dev:frontend

# Production build (outputs to frontend/dist/)
npm run build

# Deploy to Raspberry Pi via SMB share
npm run deploy
```

## Local Development

Start the backend (serves API + static files on port 3100):

```bash
cd backend
npm install
node server.js
```

Open: http://localhost:3100

## Production (Raspberry Pi)

The backend runs as a systemd service on the Pi.  
Nginx reverse-proxies port 80 → port 3100 and exposes the app via Tailscale Funnel.

See `lscfitouts-pi-setup.md` and `pi-setup.sh` for full Pi setup instructions.

Deploy the latest build to the Pi:

```bash
npm run deploy   # build + rsync via SMB mount
```

## Project Files

Project assets live under `projects/`:

```
projects/<client>/<job>/glb/        ← 3D model files (.glb)
projects/<client>/<job>/pdf/        ← drawing PDFs
projects/<client>/<job>/glb/project-meta.xml
projects/<client>/<job>/comments.xml
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET/PUT/DELETE | `/api/comments` | Read/write comments XML |
| GET/PUT/DELETE | `/api/project-meta` | Read/write project metadata XML |
| GET | `/api/health` | Health check |

## Git LFS

GLB files are tracked with Git LFS via `.gitattributes`:

```bash
git lfs install   # run once per machine
```
