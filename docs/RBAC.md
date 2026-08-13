# Role-Based Access Control (RBAC)

EmAgro uses JWT authentication with role-based route dependencies.

## Roles

- Admin
- Sub Admin

## Admin Access

Admin users can manage platform-level users and view admin dashboard metrics.

Admin-only areas:

- User creation and management
- User search, filtering, sorting, and pagination
- User activation and deactivation
- Password resets for users
- Admin dashboard
- Role listing for account creation and editing

## Sub Admin Access

Sub Admin users manage their own operational data.

Sub Admin areas:

- Employee creation, listing, and editing
- Bulk attendance marking
- Attendance lookup by date and status updates
- Task creation and management
- Employee-task assignment and unassignment
- Daily activity submission
- Daily activity lookup and updates
- Sub Admin dashboard
- Reports and exports

## Ownership Rules

Sub Admin resources are scoped by the authenticated Sub Admin user.

Important ownership behavior:

- A Sub Admin can mark attendance only for employees they own.
- A Sub Admin can update attendance only for attendance records they marked.
- A Sub Admin can access only their own tasks.
- A Sub Admin can assign only their own tasks to employees they own.
- A Sub Admin can unassign only their own task assignments.
- A Sub Admin can submit daily activity only for attendance they marked.
- A Sub Admin can submit or update daily activity values only for tasks assigned to the selected employee.
- Report data is generated only for the authenticated Sub Admin's employees, attendance, tasks, and daily activities.

## Report Access

The following report endpoints require Sub Admin access:

- `/reports/productivity`
- `/reports/productivity/excel`
- `/reports/productivity/pdf`
- `/reports/attendance`
- `/reports/attendance/excel`
- `/reports/attendance/pdf`
- `/reports/employees`
- `/reports/employees/excel`
- `/reports/employees/pdf`

## Authorization Errors

Common authorization responses:

- `401` for unauthenticated or invalid-token requests
- `403` for authenticated users without the required role
- `404` for owned resources that are missing or do not belong to the current user

Returning `404` for inaccessible owned resources avoids exposing whether another Sub Admin's resource exists.
