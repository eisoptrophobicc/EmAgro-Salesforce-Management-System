# Setup Guide

## Requirements

- Python 3.14+
- Node.js
- npm
- SQLite
- OpenPyXL for Excel exports
- ReportLab for PDF exports

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

alembic upgrade head

uvicorn app.main:app --reload
```

The backend runs at:

```text
http://127.0.0.1:8000
```

Swagger documentation is available at:

```text
http://127.0.0.1:8000/docs
```

Export support is installed from `backend/requirements.txt`:

- `openpyxl` generates `.xlsx` reports.
- `reportlab` generates `.pdf` reports.

## Frontend

```bash
cd frontend

npm install

npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Migrations

Run migrations whenever the schema changes:

```bash
cd backend
alembic upgrade head
```

## Seed Data

Seed scripts live in:

```text
backend/app/seeds
```

Use them after migrations when you need initial roles or an admin user.
