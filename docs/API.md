# API Documentation

Base URL:

```text
http://127.0.0.1:8000
```

Interactive Swagger documentation is available at:

```text
http://127.0.0.1:8000/docs
```

Authenticated endpoints expect a bearer token:

```http
Authorization: Bearer <access_token>
```

## Response Format

Most successful JSON endpoints return either a resource object or a list of resource objects.

Application errors use this shape:

```json
{
  "success": false,
  "message": "Task not found."
}
```

Common status codes:

- `400` - Generic application error
- `401` - Missing or invalid authentication
- `403` - Authenticated user does not have access
- `404` - Requested resource was not found
- `409` - Duplicate or conflicting resource
- `422` - Request validation error

## Error Handling

Service methods validate referenced resources before using them. Missing resources return meaningful `404` responses instead of causing null-reference or database errors.

Handled missing-resource cases:

- `UserNotFoundError`
- `EmployeeNotFoundError`
- `AttendanceNotFoundError`
- `TaskNotFoundError`
- `DailyActivityNotFoundError`
- `RoleNotFoundError`

Duplicate/conflict cases return `409 Conflict`:

- Duplicate email
- Duplicate employee
- Duplicate task name for the same Sub Admin
- Attendance already marked for an employee/date
- Daily activity already submitted for an attendance record

Invalid foreign keys from request payloads are checked before insert where they are user-controlled. For example, a daily activity with an unknown `task_id` returns `Task not found.` instead of a SQLite integrity error.

## Authentication

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Public | Login and receive a JWT token |
| `GET` | `/me` | Authenticated | Get the current authenticated user |

## Users

Admin-only user management.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/users` | Create a user |
| `GET` | `/users` | List users with pagination, search, role, status, and sorting filters |
| `GET` | `/users/{user_id}` | Get a user by ID |
| `PATCH` | `/users/{user_id}` | Update a user |
| `PATCH` | `/users/{user_id}/status` | Activate or deactivate a user |
| `PATCH` | `/users/{user_id}/reset-password` | Reset a user's password |

Relevant errors:

- `404 User not found.`
- `404 Role not found.`
- `409 Email already exists.`

## Employees

Sub Admin employee management.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/employees` | Create an employee owned by the current Sub Admin |

Relevant errors:

- `409 Employee already exists.`

## Attendance

Sub Admin attendance management.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/attendance/bulk` | Mark attendance for multiple employees on one date |

Request body:

```json
{
  "date": "2026-08-10",
  "attendance": [
    {
      "employee_id": 1,
      "status": "PRESENT"
    }
  ]
}
```

Relevant errors:

- `404 Employee not found.`
- `409 Attendance already marked.`

Duplicate employee IDs inside the same bulk request are also treated as attendance conflicts.

## Tasks

Sub Admin task management.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks` | List tasks owned by the current Sub Admin |
| `GET` | `/tasks/{task_id}` | Get a task |
| `PATCH` | `/tasks/{task_id}` | Update a task |
| `PATCH` | `/tasks/{task_id}/status` | Activate or deactivate a task |

Relevant errors:

- `404 Task not found.`
- `409 Task already exists.`

Task names must be unique per Sub Admin.

## Daily Activities

Sub Admin daily activity submission.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/daily-activities` | Submit a daily activity for an attendance record |

Request body:

```json
{
  "attendance_id": 1,
  "remarks": "Completed assigned field work.",
  "items": [
    {
      "task_id": 1,
      "value": "25"
    }
  ]
}
```

Relevant errors:

- `404 Attendance not found.`
- `404 Task not found.`
- `409 Daily activity already exists.`

Only the Sub Admin who marked the attendance can submit the related daily activity.

## Dashboards

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/dashboard` | Admin | Admin dashboard metrics |
| `GET` | `/sub-admin-dashboard` | Sub Admin | Sub Admin dashboard metrics |

## Reports

Report endpoints are available to Sub Admin users and accept:

- `from_date` as `YYYY-MM-DD`
- `to_date` as `YYYY-MM-DD`

### JSON Reports

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/reports/productivity` | Attendance totals, task totals, and timeline totals |
| `GET` | `/reports/attendance` | Attendance summary and employee-wise attendance totals |
| `GET` | `/reports/employees` | Employee-wise attendance totals and task summaries |

Example:

```text
GET /reports/productivity?from_date=2026-08-01&to_date=2026-08-10
```

### Excel Exports

| Method | Path | Filename |
| --- | --- | --- |
| `GET` | `/reports/productivity/excel` | `productivity_report.xlsx` |
| `GET` | `/reports/attendance/excel` | `attendance_report.xlsx` |
| `GET` | `/reports/employees/excel` | `employee_report.xlsx` |

Excel exports include:

- Bold report titles
- Bold table headers
- Auto-sized columns
- Frozen header panes
- Status colors:
  - Present: green
  - Absent: red
  - Half Day: yellow
  - Leave: blue

### PDF Exports

| Method | Path | Filename |
| --- | --- | --- |
| `GET` | `/reports/productivity/pdf` | `productivity_report.pdf` |
| `GET` | `/reports/attendance/pdf` | `attendance_report.pdf` |
| `GET` | `/reports/employees/pdf` | `employee_report.pdf` |

PDF exports include styled tables with borders, bold grey header rows, centered cells, and the same status colors used by Excel exports.
