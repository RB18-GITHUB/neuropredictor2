# NeuroPredict AI — Parkinson's Disease Prediction System

A presentation-quality clinical intelligence platform that predicts Parkinson's disease risk using machine learning analysis of vocal biomarkers.

## Features

- **XGBoost ML Model** — 92.3% accuracy, trained on 22 vocal biomarker features from the Oxford Parkinson's Disease Detection Dataset
- **Modern React Frontend** — Built with React 18, Tailwind CSS, Framer Motion animations, and Recharts visualizations
- **Flask REST API** — JWT-authenticated endpoints with rate limiting, Swagger docs, and SQLite persistence
- **Dark/Light Mode** — Seamless theme switching with system preference detection
- **Multi-Step Prediction Form** — Guided 3-step input with validation, tooltips, and sample data loading
- **Result Visualization** — Gauge charts, radar plots, biomarker analysis, and risk stratification
- **Prediction History** — Dashboard with historical analysis records

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm 9+

### 1. Backend

```bash
# Install Python dependencies
pip3 install -r requirements.txt

# Train the ML model (creates trained_models/best_model.pkl)
python3 -c "from training.train import train_and_save_models; train_and_save_models()"

# Start Flask API server
PORT=5050 python3 app.py
```

### 2. Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Start development server (proxies API to Flask)
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
neuropredictor-main/
├── app.py                  # Flask application entry point
├── config.py               # App configuration
├── requirements.txt        # Python dependencies
├── controllers/            # Route handler logic
├── services/               # ML prediction + business logic
├── routes/                 # API route definitions (flask-restful)
├── trained_models/         # Trained XGBoost model + metadata
├── dataset/                # Oxford Parkinson's Disease dataset
├── database/               # SQLAlchemy models + init
├── middleware/              # JWT auth + error handling
├── training/               # Model training pipeline
├── tests/                  # API tests
├── web/                    # Legacy HTML frontend
├── frontend/               # React SPA (Vite + Tailwind)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── lib/            # API client + auth helpers
│   │   ├── App.jsx         # Root component with routing
│   │   └── main.jsx        # Entry point
│   ├── vercel.json         # Vercel deployment config
│   └── package.json
├── DEPLOYMENT.md           # Full deployment guide
└── README.md               # This file
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| ML Model | XGBoost (best of 5 classifiers), scikit-learn Pipeline |
| Backend | Flask, flask-restful, SQLAlchemy, PyJWT, Swagger |
| Frontend | React 18, Vite, Tailwind CSS 3, Framer Motion, Recharts |
| Database | SQLite (development), configurable via DATABASE_URL |

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/predict` | JWT | Run prediction |
| GET | `/api/model-info` | No | Model metadata |
| GET | `/api/prediction-history` | JWT | User's prediction history |

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions on deploying to:
- **Frontend** → Vercel
- **Backend** → Render / Railway

## License

For educational and demonstration purposes.
