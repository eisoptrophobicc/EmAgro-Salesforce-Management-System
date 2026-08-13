# EmAgro Frontend

React/Vite frontend for the EmAgro Salesforce Management app.

## Finished Features

- Login with JWT persistence in `localStorage`.
- Automatic token refresh from the backend `X-Access-Token` response header.
- First-admin setup flow when no Admin account exists.
- Role-aware protected routing for Admin and Sub Admin users.
- Shared dashboard layout with role-filtered sidebar navigation.
- Admin dashboard with user statistics, operational totals, and Sub Admin overview.
- Admin user management:
  - Create Admin and Sub Admin accounts.
  - Search, filter, sort, and paginate users.
  - Edit user details and role.
  - Activate/deactivate accounts.
  - Reset passwords with validation.
- Sub Admin dashboard with employee, attendance, productivity, trend, and employee productivity views.
- Employee management with create, list, edit, and active/inactive state support.
- Attendance workflow with date-based lookup, bulk marking, and status edits.
- Task management with create, list, edit, and active/inactive state support.
- Employee-task assignment and unassignment.
- Daily activity workflow with date/employee attendance lookup, assigned task entry, create, and update support.
- Reports page for productivity, attendance, and employee reports.
- Excel and PDF downloads for all report types.

## Tech Stack

- React 19
- Vite
- React Router
- TanStack Query
- Axios
- React Hook Form
- Zod
- Recharts
- Tailwind CSS
- shadcn-style UI components
- lucide-react icons

## Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

The backend API base URL is currently configured in `src/api/axios.js`:

```text
http://localhost:8000
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Main Routes

| Path | Access | Screen |
| --- | --- | --- |
| `/` | Public | Login and first-admin setup |
| `/dashboard` | Admin/Sub Admin | Role-specific dashboard |
| `/users` | Admin | User management |
| `/users/create` | Admin | User creation |
| `/employees` | Sub Admin | Employee management |
| `/attendance` | Sub Admin | Attendance marking and edits |
| `/tasks` | Sub Admin | Task management |
| `/employee-tasks` | Sub Admin | Employee-task assignments |
| `/daily-activity` | Sub Admin | Daily activity submission and updates |
| `/reports` | Sub Admin | Reports and exports |

## Verification

Build the production bundle:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```
