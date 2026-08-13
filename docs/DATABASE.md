# Database Design

EmAgro uses SQLAlchemy ORM models with Alembic migrations and SQLite as the current database engine. The local database file is generated from `DATABASE_URL` in `backend/.env`; the example configuration uses `sqlite:///./app.db`.

## Main Tables

### `users`

Stores Admin and Sub Admin accounts.

Important fields:

- `id`
- `email`
- `full_name`
- `hashed_password`
- `role_id`
- `is_active`
- `last_login`

Constraints:

- `email` is unique.
- `role_id` references `roles.id`.

### `roles`

Stores available application roles.

Common roles:

- Admin
- Sub Admin

### `employees`

Stores employees managed by Sub Admin users.

Important fields:

- `id`
- `employee_code`
- `full_name`
- `email`
- `phone`
- `designation`
- `is_active`
- `sub_admin_id`

Constraints:

- `employee_code` is unique.
- `email` is unique.
- `sub_admin_id` references `users.id`.

### `attendance`

Stores employee attendance records.

Important fields:

- `id`
- `employee_id`
- `marked_by`
- `date`
- `status`

Supported statuses:

- `Present`
- `Absent`
- `Half Day`
- `Leave`

Constraints:

- `employee_id` references `employees.id`.
- `marked_by` references `users.id`.
- Each employee can have only one attendance record per date through `uq_attendance_employee_date`.

### `tasks`

Stores Sub Admin owned activity/task definitions.

Important fields:

- `id`
- `sub_admin_id`
- `name`
- `description`
- `input_type`
- `is_active`

Supported input types:

- `Boolean`
- `Integer`
- `Text`

Constraints:

- `sub_admin_id` references `users.id`.
- Task names are unique per Sub Admin through `uq_task_sub_admin_name`.

### `daily_activities`

Stores one daily activity submission for an attendance record.

Important fields:

- `id`
- `attendance_id`
- `remarks`

Constraints:

- `attendance_id` references `attendance.id`.
- Each attendance record can have only one daily activity through `uq_daily_activity_attendance`.

### `daily_activity_items`

Stores task values submitted inside a daily activity.

Important fields:

- `id`
- `daily_activity_id`
- `task_id`
- `value`

Constraints:

- `daily_activity_id` references `daily_activities.id`.
- `task_id` references `tasks.id`.
- Each task can appear only once per activity through `uq_activity_task`.

### `employee_tasks`

Stores task assignments for employees.

Important fields:

- `id`
- `employee_id`
- `task_id`

Constraints:

- `employee_id` references `employees.id`.
- `task_id` references `tasks.id`.
- Each employee/task assignment is unique through `uq_employee_task`.

## Relationships

- A `Role` has many `User` records.
- A Sub Admin `User` has many `Employee` records.
- A Sub Admin `User` has many `Task` records.
- An `Employee` has many `Attendance` records.
- An `Employee` has many `EmployeeTask` assignment records.
- A `Task` has many `EmployeeTask` assignment records.
- An `Attendance` record has one optional `DailyActivity`.
- A `DailyActivity` has many `DailyActivityItem` records.
- A `Task` has many `DailyActivityItem` records.

## Service-Level Validation

The service layer validates missing resources before committing database changes. This keeps API responses meaningful and prevents raw SQLite integrity errors from leaking to clients.

Examples:

- Unknown employee during attendance marking returns `Employee not found.`
- Unknown attendance during daily activity creation returns `Attendance not found.`
- Unknown task during daily activity creation returns `Task not found.`
- Duplicate attendance returns `Attendance already marked.`
- Duplicate daily activity returns `Daily activity already exists.`
- Duplicate task name returns `Task already exists.`
- Duplicate email returns `Email already exists.`
- Duplicate employee-task assignment returns `Task is already assigned to this employee.`
- Missing employee-task assignment during unassign returns `Task is not assigned to this employee.`

## Migrations

Alembic migration files live in:

```text
backend/alembic/versions
```

Apply migrations with:

```bash
cd backend
alembic upgrade head
```
