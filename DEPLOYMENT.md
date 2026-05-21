# Deployment Guide

## Architecture

```
┌─────────────────────┐     API Calls     ┌─────────────────────┐
│   Frontend (React)  │ ───────────────── │   Backend (Flask)   │
│   Deployed: Vercel  │                   │  Deployed: Render   │
│   Port: 5173        │                   │  Port: 5050 (local) │
└─────────────────────┘                   └─────────────────────┘
```

---

## Local Development

### 1. Start the Backend

```bash
cd /path/to/neuropredictor-main

# Install Python dependencies (first time)
pip3 install -r requirements.txt

# Train the model (first time or if best_model.pkl is missing)
python3 -c "from training.train import train_and_save_models; train_and_save_models()"

# Start Flask API
PORT=5050 python3 app.py
```

The backend will be available at `http://localhost:5050`.

### 2. Start the Frontend

```bash
cd /path/to/neuropredictor-main/frontend

# Install Node dependencies (first time)
npm install

# Start Vite dev server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or next available port).
API requests to `/api/*` are automatically proxied to the Flask backend via `vite.config.js`.

---

## Production Deployment

### Frontend → Vercel

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```
   This creates a `dist/` directory with the static build.

2. **Deploy to Vercel:**
   ```bash
   npx -y vercel --prod
   ```
   Or connect the GitHub repo and set:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Set environment variable on Vercel:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

### Backend → Render (Recommended)

1. Create a new **Web Service** on [render.com](https://render.com).
2. Connect your GitHub repository.
3. Configure:
   - **Root Directory:** `.` (project root)
   - **Build Command:** `pip install -r requirements.txt && python3 -c "from training.train import train_and_save_models; train_and_save_models()"`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`
4. Set environment variables:
   ```
   SECRET_KEY=<your-secret-key>
   JWT_SECRET_KEY=<your-jwt-secret>
   CORS_ORIGINS=https://your-frontend.vercel.app
   PORT=10000
   ```

### Connecting Frontend to Backend

When deployed, update `frontend/src/lib/api.js` to use the deployed backend URL:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});
```

Set `VITE_API_URL` as an environment variable on Vercel pointing to your Render backend URL.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | `change-me` | Flask secret key |
| `JWT_SECRET_KEY` | same as SECRET_KEY | JWT signing key |
| `JWT_EXPIRES_MINUTES` | `60` | Token expiration |
| `DATABASE_URL` | `sqlite:///parkinsons.db` | Database URI |
| `CORS_ORIGINS` | `*` | Allowed CORS origins (comma-separated) |
| `PORT` | `5000` | Backend port |
| `VITE_API_URL` | `/api` | Frontend API base URL |

---

## Folder Structure

```
neuropredictor-main/
├── app.py                    # Flask entry point
├── config.py                 # Backend configuration
├── requirements.txt          # Python dependencies
├── controllers/              # Route handlers
├── services/                 # Business logic (ML prediction)
├── routes/                   # API route definitions
├── trained_models/           # Trained ML model + metadata
├── dataset/                  # Training dataset
├── database/                 # SQLAlchemy models
├── middleware/               # Auth + error handlers
├── training/                 # Model training scripts
├── web/                      # Legacy HTML frontend (preserved)
├── frontend/                 # React SPA
│   ├── src/
│   ├── public/
│   ├── vercel.json
│   └── package.json
└── DEPLOYMENT.md             # This file
```
