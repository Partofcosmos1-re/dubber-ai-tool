# AI Dubbing Tool

This is a free, open-source AI dubbing tool using Whisper and Coqui TTS.

## Structure
- `backend/` — Node.js Express API, calls Python AI scripts
- `backend/python/` — Python scripts for Whisper and TTS
- `frontend/` — React web app

## Quick Start
1. See `backend/python/setup_env.bat` to set up the Python environment (Windows/Anaconda Prompt).
2. Start the backend: `npm start` in `backend/`.
3. Start the frontend: `npm start` in `frontend/`.

## Deployment
- Backend: Deploy to Render (free tier) with `build.sh` for Node+Python setup.
- Frontend: Deploy to Vercel (free tier).

## Do Not Upload
- `node_modules/`, `.env`, `.venv/`, `.conda/`, `uploads/`, `__pycache__/`, and large test files.

---

For more, see the code and comments in each folder.
