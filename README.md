# EmAgro CRM

A role-based Customer Relationship Management (CRM) platform for managing field employees, attendance, daily activities, and productivity analytics.

The project is built as a monorepo consisting of a FastAPI backend and a React frontend.

---

## Features

### Authentication
- JWT Authentication
- Secure Password Hashing
- Role-Based Access Control (RBAC)

### User Management
- Admin Management
- Sub Admin Management
- User Activation / Deactivation

### Employee Management
- Employee Creation
- Employee Code Generation

### Attendance
- Bulk Attendance Marking
- Attendance Status
  - `Present`
  - `Absent`
  - `Half Day`
  - `Leave`
- Duplicate Attendance Prevention

### Task Management
- Create Tasks
- Task Types
  - `Integer`
  - `Boolean`
  - `Text`
- Task Ownership per Sub Admin

### Daily Activity
- Daily Activity Submission
- Multiple Task Entries
- Employee Remarks
- One Activity per Attendance Record

### Dashboard
#### Admin Dashboard
- User Statistics
- Active Users
- Employee Statistics

#### Sub Admin Dashboard
- Employee Summary
- Attendance Summary
- Productivity Summary
- Historical Dashboard with `target_date` Filter

### Reports & Exports
- Productivity Reports
- Attendance Reports
- Employee Reports
- Excel Export
  - Bold titles and table headers
  - Auto-sized columns
  - Frozen report headers
  - Status colors for Present, Absent, Half Day, and Leave
- PDF Export
  - Styled tables
  - Header backgrounds
  - Status colors for Present, Absent, Half Day, and Leave

### Error Handling
- Meaningful API errors for missing users, employees, attendance records, tasks, roles, and daily activities
- Conflict responses for duplicate resources
  - Duplicate email
  - Duplicate employee
  - Duplicate task
  - Attendance already marked
  - Daily activity already submitted
- Foreign-key validation before create operations where user input references another resource

### Database
- Alembic Migrations
- SQLAlchemy ORM
- Repository-Service Architecture

---

## Tech Stack

### Backend

- Python 3.14
- FastAPI
- SQLAlchemy
- Alembic
- SQLite
- Pydantic
- Uvicorn
- JWT
- Passlib
- OpenPyXL
- ReportLab

### Frontend

- React
- Vite
- JavaScript
- Context API

---

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
│   │   ├── middleware
│   │   ├── models
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── seeds
│   │   ├── services
│   │   ├── utils
│   │   └── main.py
│   ├── .env.example
│   ├── alembic
│   ├── alembic.ini
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── local SQLite database (*.db, generated from DATABASE_URL)
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── constants
│   │   ├── context
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── routes
│   │   └── utils
│   └── package.json
│
└── docs
    ├── API.md
    ├── DATABASE.md
    ├── RBAC.md
    └── SETUP.md
```

---

## Architecture

```text
                 React Frontend
                        │
                        ▼
                 FastAPI REST API
                        │
                        ▼
                   Service Layer
                        │
                        ▼
                 Repository Layer
                        │
                        ▼
                 SQLAlchemy ORM
                        │
                        ▼
                  SQLite Database
```

---

## Running the Project

### Clone the repository

```bash
git clone <repository-url>
cd EmAgro
```

---

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

Backend runs on

```
http://127.0.0.1:8000
```

Swagger documentation

```
http://127.0.0.1:8000/docs
```

### Configure Environment Variables

Create a `.env` file inside the `backend` directory using the provided example. The default example uses `sqlite:///./emagro.db`.

Then update the values as needed before starting the server.

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

## Documentation

Additional documentation is available in the `docs` directory.

- [API.md](docs/API.md) - API documentation
- [DATABASE.md](docs/DATABASE.md) - Database design
- [RBAC.md](docs/RBAC.md) - Role-based access control
- [SETUP.md](docs/SETUP.md) - Setup guide

---

## Current Modules

- Authentication
- User Management
- Employee Management
- Attendance Management
- Task Management
- Daily Activity Tracking
- Admin Dashboard
- Sub Admin Dashboard
- Productivity Analytics
- Reports
- Excel Export
- PDF Export

---

## Roadmap

- Weekly & Monthly Analytics
- Report Filtering Enhancements
- Dashboard Charts
- Search & Pagination
- Docker Support
- PostgreSQL Support
- CI/CD

---

## License

This project is currently under development.
