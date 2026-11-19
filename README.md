# EduMetrics

**Smart Academic Evaluation & Predictive Analytics Platform**

EduMetrics is a generalised, multi-institution web platform for schools, colleges, universities, and coaching institutions. It combines academic management and student evaluation with machine-learning-based performance analysis and prediction.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, JavaScript, React Router, Axios, Recharts |
| Backend | Python, FastAPI, Pydantic, SQLAlchemy, Alembic |
| Database | PostgreSQL (Neon managed cloud) |
| ML | Scikit-learn, Pandas, NumPy, Joblib |
| File Processing | OpenPyXL (Excel + CSV) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Object Storage | Cloudflare R2 (future) |

---

## Repository Structure

```
edumetrics/
├── frontend/          # React 19 + Vite frontend
├── backend/           # Python FastAPI backend
├── shared/            # Shared resources (future)
├── docs/              # Project documentation (future)
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18 and pnpm
- Python ≥ 3.11
- PostgreSQL (or a Neon account)

### Frontend

```bash
cd frontend
pnpm install
cp .env.example .env     # then set VITE_API_BASE_URL
pnpm run dev
```

Frontend runs at: http://localhost:5173

### Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env     # then fill in DATABASE_URL and SECRET_KEY
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/api/v1/docs

### Database Migrations

```bash
cd backend
alembic upgrade head
```

---

## User Roles

| Role | Description |
|---|---|
| Administrator | Institution-level management, user administration |
| Teacher | Class management, assessments, grading |
| Student | View grades, performance insights |

---

## Architecture Principles

- **Multi-institution**: Every record is scoped to its institution.
- **Data isolation**: Institution-level isolation is enforced at the database layer.
- **Configurable academics**: No hardcoded university names, degree types, or grading schemes.
- **ML pipeline**: Pre-trained inference + custom dataset upload + training + evaluation + versioning.
- **Interchangeable storage**: Local development and cloud (Cloudflare R2) through a storage abstraction layer.

---

## Development Status

> **Phase 1 — Foundation** ✅  
> Basic project structure, entry points, health check endpoint.

> **Phase 2 — Authentication** ⬜  
> JWT-based auth, role management, institution scoping.

> **Phase 3 — Academic Management** ⬜  
> Students, courses, assessments, grading.

> **Phase 4 — ML Engine** ⬜  
> Pre-trained models, custom dataset upload, training pipeline.

---

## Environment Variables

See `frontend/.env.example` and `backend/.env.example` for required variables. Never commit `.env` files.

---

## Licence

TBD — private repository.
