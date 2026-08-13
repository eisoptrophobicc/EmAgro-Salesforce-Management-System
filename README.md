# EmAgro Salesforce Management

EmAgro is a role-based workforce and field-activity management app. It has a FastAPI backend and a React/Vite frontend for managing admin accounts, sub-admin operations, employees, attendance, tasks, daily activity, dashboards, reports, and exports.

## Features

### Authentication & Setup

- JWT login with bcrypt password hashing.
- Sliding 60-minute sessions: authenticated API responses refresh the token through `X-Access-Token`, so active users are not interrupted.
- First-admin setup from the login page when no admin exists.
- First-admin setup is protected by `ADMIN_SETUP_KEY`.
- First setup auto-creates the `Admin` and `Sub Admin` roles if they are missing.
- Inactive accounts cannot log in or use authenticated endpoints.
- Role-based routing in the frontend and role dependencies in the backend.

### Admin

- Admin dashboard with account and operational overview.
- Cross-sub-admin overview:
  - employees
  - active employees
  - tasks
  - attendance records
  - daily activities
  - last activity date
- Create and manage `Admin` and `Sub Admin` accounts.
- Search, filter, sort, and paginate users.
- Activate/deactivate accounts.
- Reset account passwords.

### Sub Admin

- Employee creation, listing, editing, and activation status management.
- Bulk attendance marking.
- Attendance lookup by date and attendance status updates.
- Task definition management.
- Employee-task assignment and unassignment.
- Daily activity creation, lookup, and update.
- Sub-admin dashboard with attendance and productivity trends.
- Attendance, productivity, and employee reports.
- Excel and PDF exports.

### Tasks & Daily Activity

- Task input types:
  - `Integer`
  - `Boolean`
  - `Text`
- Daily activity values are recorded against assigned tasks.
- Daily activity entry is driven by the employee's assigned tasks.
- Existing daily activity records can be updated.
- Historical activity remains reportable even if a task is later unassigned.
- Task assignment is unique per employee/task pair.

### Reports

- Default report date range is the last 7 days through today.
- Productivity reports split task data into:
  - overall activity item counts
  - numeric output totals
  - boolean yes/no/other outcomes
  - text entry counts
- Employee reports combine attendance totals with task summaries per employee.
- Attendance status colors:
  - Present: green
  - Absent: red
  - Half Day: amber/yellow
  - Leave: blue

## Tech Stack

### Backend

- Python 3.14
- FastAPI
- SQLAlchemy
- Alembic
- SQLite
- Pydantic
- Uvicorn
- python-jose JWT
- Passlib/bcrypt
- OpenPyXL
- ReportLab

### Frontend

- React
- Vite
- JavaScript
- TanStack Query
- React Hook Form
- Zod
- Recharts
- lucide-react

## Project Structure

```text
EmAgro
├── backend
│   ├── app
│   │   ├── api
│   │   ├── constants
│   │   ├── core
│   │   ├── exceptions
│   │   ├── mappers
│   │   ├── models
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── seeds
│   │   ├── services
│   │   └── main.py
│   ├── alembic
│   ├── .env.example
│   └── requirements.txt
├── frontend
│   ├── public
│   ├── src
│   └── package.json
└── docs
    ├── API.md
    ├── DATABASE.md
    ├── RBAC.md
    └── SETUP.md
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Vite may choose another `517x` port if `5173` is busy.

## First Admin Setup

Set a private `ADMIN_SETUP_KEY` in `backend/.env` before deployment. Generate one with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

When no admin exists, the login page shows a first-admin setup option. The setup form requires the deployment setup key. Once an admin exists, public setup is disabled.

## Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [RBAC](docs/RBAC.md)
- [Database Design](docs/DATABASE.md)
