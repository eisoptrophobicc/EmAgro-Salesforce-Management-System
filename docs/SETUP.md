# Setup Guide

## Requirements

- Python 3.14+
- Node.js
- npm
- SQLite

Backend report exports use:

- `openpyxl` for `.xlsx`
- `reportlab` for `.pdf`

These are installed from `backend/requirements.txt`.

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## Environment Variables

`backend/.env.example` contains the required backend variables:

```env
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ADMIN_SETUP_KEY=admin-setup-key-here
```

### Generate Secrets

Generate a JWT secret:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Generate an admin setup key:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Use different values for `SECRET_KEY` and `ADMIN_SETUP_KEY`.

## First Admin Setup

The app does not require a seeded admin.

After migrations and server startup:

1. Open the frontend.
2. If no admin exists, the login page shows `Set up first admin`.
3. Enter the private `ADMIN_SETUP_KEY`.
4. Create the first admin account.

The setup flow auto-creates the `Admin` and `Sub Admin` roles if they do not exist. After one admin exists, `/auth/setup-admin` is disabled.

## Optional Seed Scripts

Seed scripts live in:

```text
backend/app/seeds
```

They are optional for normal setup because first-admin setup can bootstrap roles and an admin account. They remain useful for local demo data or manual reset workflows.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

If port `5173` is busy, Vite may choose another `517x` port. Backend CORS allows common local Vite ports.

The frontend API base URL is configured in:

```text
frontend/src/api/axios.js
```

By default it points to:

```text
http://localhost:8000
```

## Local App Flow

After the backend and frontend are running:

1. Open the frontend at `http://localhost:5173`.
2. Create the first Admin if setup is required.
3. Admin users land on the admin dashboard and can manage users.
4. Sub Admin users land on the operations dashboard and can manage employees, attendance, tasks, daily activities, task assignments, reports, and exports.

## Migrations

Run migrations whenever schema changes:

```bash
cd backend
alembic upgrade head
```

## Verification

Useful local checks:

```bash
cd backend
venv/bin/python -m py_compile app/main.py
```

```bash
cd frontend
npm run build
```

```bash
cd frontend
npm run lint
```
