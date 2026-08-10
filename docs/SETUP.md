# Setup Guide

## Requirements

- Python 3.14+
- Node.js
- npm
- SQLite

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

## Frontend

```bash
cd frontend

npm install

npm run dev
```

> Additional setup instructions will be added as the project evolves.