import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getEmployees } from "@/api/employees";
import { getTasks } from "@/api/tasks";
import {
  getEmployeeTasks,
  assignTask,
  unassignTask,
} from "@/api/employeeTasks";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Activity,
  BriefcaseBusiness,
  Check,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Hash,
  Link2,
  Plus,
  ToggleLeft,
  Type,
  Unlink,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";


const TASK_TYPE_CONFIG = {
  Boolean: {
    icon: ToggleLeft,
    label: "Boolean",
    description: "Yes / No",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },

  Integer: {
    icon: Hash,
    label: "Integer",
    description: "Number",
    className:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },

  Text: {
    icon: Type,
    label: "Text",
    description: "Free text",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};


const getTaskTypeConfig = (inputType) => {
  return (
    TASK_TYPE_CONFIG[inputType] ?? {
      icon: Activity,
      label: inputType || "Task",
      description: "",
      className:
        "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    }
  );
};


const getInitials = (name) => {
  if (!name) {
    return "?";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};


function EmployeeTasks() {
  const queryClient = useQueryClient();

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState("");

  const [selectedTaskId, setSelectedTaskId] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [success, setSuccess] =
    useState(null);


  const {
    data: employees,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });


  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });


  const {
    data: employeeTasks,
    isLoading: employeeTasksLoading,
    isError: employeeTasksError,
  } = useQuery({
    queryKey: [
      "employee-tasks",
      selectedEmployeeId,
    ],

    queryFn: () =>
      getEmployeeTasks(
        Number(selectedEmployeeId)
      ),

    enabled: Boolean(selectedEmployeeId),
  });


  const assignedTasks =
    employeeTasks ?? [];


  const activeEmployees = (
    employees ?? []
  ).filter(
    (employee) =>
      employee.is_active
  );


  const activeTasks = (
    tasks ?? []
  ).filter(
    (task) =>
      task.is_active
  );


  const availableTasks =
    activeTasks.filter(
      (task) =>
        !assignedTasks.some(
          (assignedTask) =>
            assignedTask.task_id ===
            task.id
        )
    );


  const selectedEmployee = (
    employees ?? []
  ).find(
    (employee) =>
      String(employee.id) ===
      selectedEmployeeId
  );


  const handleEmployeeChange = (
    value
  ) => {
    setSelectedEmployeeId(value);
    setSelectedTaskId("");
    setError(null);
    setSuccess(null);
  };


  const handleAssign = async () => {
    setError(null);
    setSuccess(null);

    if (!selectedEmployeeId) {
      setError(
        "Please select an employee."
      );
      return;
    }

    if (!selectedTaskId) {
      setError(
        "Please select a task."
      );
      return;
    }

    setSubmitting(true);

    try {
      await assignTask({
        employee_id:
          Number(selectedEmployeeId),
        task_id:
          Number(selectedTaskId),
      });

      await queryClient.invalidateQueries({
        queryKey: [
          "employee-tasks",
          selectedEmployeeId,
        ],
      });

      setSelectedTaskId("");

      setSuccess(
        "Task assigned successfully."
      );

    } catch (err) {
      console.error(
        "Failed to assign task:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to assign task."
      );

    } finally {
      setSubmitting(false);
    }
  };


  const handleUnassign = async (
    taskId
  ) => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await unassignTask(
        Number(selectedEmployeeId),
        taskId
      );

      await queryClient.invalidateQueries({
        queryKey: [
          "employee-tasks",
          selectedEmployeeId,
        ],
      });

      setSuccess(
        "Task unassigned successfully."
      );

    } catch (err) {
      console.error(
        "Failed to unassign task:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to unassign task."
      );

    } finally {
      setSubmitting(false);
    }
  };


  const loading =
    employeesLoading ||
    tasksLoading ||
    (
      Boolean(selectedEmployeeId) &&
      employeeTasksLoading
    );


  const pageError =
    employeesError ||
    tasksError ||
    employeeTasksError;


  if (
    loading &&
    !selectedEmployeeId
  ) {
    return (
      <div className="space-y-6">

        <div className="flex items-center gap-3">

          <Skeleton className="size-11 rounded-xl" />

          <div className="space-y-2">

            <Skeleton className="h-9 w-56" />

            <Skeleton className="h-4 w-80" />

          </div>

        </div>


        <div className="grid gap-4 md:grid-cols-3">

          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />

        </div>


        <Card>

          <CardContent className="pt-6">

            <Skeleton className="h-10 w-full" />

          </CardContent>

        </Card>

      </div>
    );
  }


  if (pageError) {
    return (
      <div className="space-y-6">

        <div className="flex items-center gap-3">

          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">

            <Link2 className="size-5 text-primary" />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Task Assignment
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Assign activities to individual employees.
            </p>

          </div>

        </div>


        <Alert variant="destructive">

          <CircleAlert />

          <AlertTitle>
            Something went wrong
          </AlertTitle>

          <AlertDescription>
            Unable to load employees, tasks,
            or assignments.
          </AlertDescription>

        </Alert>

      </div>
    );
  }


  return (
    <div className="space-y-6">


      <div className="flex items-center gap-3">

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">

          <Link2 className="size-5 text-primary" />

        </div>


        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            Task Assignment
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Assign and manage activities for your employees.
          </p>

        </div>

      </div>


      <div className="grid gap-4 md:grid-cols-3">


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Active Employees
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {activeEmployees.length}
                </p>

              </div>


              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">

                <UserCheck className="size-5 text-green-500" />

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Available Tasks
                </p>

                <p className="mt-1 text-3xl font-bold">

                  {selectedEmployee
                    ? availableTasks.length
                    : activeTasks.length}

                </p>

              </div>


              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">

                <ClipboardList className="size-5 text-violet-500" />

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Assigned Tasks
                </p>

                <p className="mt-1 text-3xl font-bold">

                  {selectedEmployee
                    ? assignedTasks.length
                    : "—"}

                </p>

              </div>


              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">

                <ClipboardCheck className="size-5 text-blue-500" />

              </div>

            </div>

          </CardContent>

        </Card>


      </div>


      {error && (

        <Alert variant="destructive">

          <CircleAlert />

          <AlertTitle>
            Unable to complete action
          </AlertTitle>

          <AlertDescription>
            {error}
          </AlertDescription>

        </Alert>

      )}


      {success && (

        <Alert>

          <Check />

          <AlertTitle>
            Success
          </AlertTitle>

          <AlertDescription>
            {success}
          </AlertDescription>

        </Alert>

      )}


      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <Users className="size-5 text-primary" />

            Select Employee

          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Choose an active employee to view and manage their assigned activities.
          </p>

        </CardHeader>


        <CardContent>

          <div className="space-y-2">

            <Label>
              Employee
            </Label>


            <Select
              value={selectedEmployeeId}
              onValueChange={
                handleEmployeeChange
              }
            >

              <SelectTrigger className="h-10 w-full">

                <SelectValue placeholder="Select employee" />

              </SelectTrigger>


              <SelectContent className="min-w-[320px]">

                {activeEmployees.length === 0 ? (

                  <SelectItem
                    value="none"
                    disabled
                  >
                    No active employees
                  </SelectItem>

                ) : (

                  activeEmployees.map(
                    (employee) => (

                      <SelectItem
                        key={employee.id}
                        value={String(
                          employee.id
                        )}
                      >

                        <div className="flex items-center gap-3">

                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">

                            {getInitials(
                              employee.full_name
                            )}

                          </div>

                          <div className="flex min-w-0 items-center gap-2">

                            <span>
                              {employee.full_name}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {employee.employee_code}
                            </span>

                          </div>

                        </div>

                      </SelectItem>

                    )
                  )

                )}

              </SelectContent>

            </Select>

          </div>

        </CardContent>

      </Card>


      {selectedEmployee && (

        <Card>

          <CardHeader>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">

                  {getInitials(
                    selectedEmployee.full_name
                  )}

                </div>


                <div>

                  <CardTitle>
                    {selectedEmployee.full_name}
                  </CardTitle>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">

                    <span>
                      {selectedEmployee.employee_code}
                    </span>

                    <span>
                      •
                    </span>

                    <span className="flex items-center gap-1">

                      <BriefcaseBusiness className="size-3.5" />

                      {selectedEmployee.designation}

                    </span>

                  </div>

                </div>

              </div>


              <div className="inline-flex h-7 w-fit items-center gap-2 rounded-full bg-green-500/10 px-3 text-xs font-medium text-green-600 dark:text-green-400">

                <span className="size-1.5 rounded-full bg-green-500" />

                Active Employee

              </div>

            </div>

          </CardHeader>


          <CardContent className="space-y-6">


            <div className="rounded-xl border bg-muted/20 p-4">


              <div className="mb-3 flex items-center gap-3">

                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                  <UserPlus className="size-4 text-primary" />

                </div>


                <div>

                  <h3 className="font-medium">
                    Assign Activity
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Add an active task to this employee.
                  </p>

                </div>

              </div>


              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">


                <Select
                  value={selectedTaskId}
                  onValueChange={
                    setSelectedTaskId
                  }
                >

                  <SelectTrigger className="h-10 min-w-0 flex-1">

                    <SelectValue placeholder="Select a task to assign" />

                  </SelectTrigger>


                  <SelectContent className="min-w-[320px]">

                    {availableTasks.length === 0 ? (

                      <SelectItem
                        value="none"
                        disabled
                      >
                        No unassigned tasks
                      </SelectItem>

                    ) : (

                      availableTasks.map(
                        (task) => {

                          const config =
                            getTaskTypeConfig(
                              task.input_type
                            );

                          const TaskIcon =
                            config.icon;


                          return (
                            <SelectItem
                              key={task.id}
                              value={String(
                                task.id
                              )}
                            >

                              <div className="flex items-center gap-3">

                                <TaskIcon
                                  className={`size-4 shrink-0 ${
                                    config.className.split(
                                      " "
                                    )[1]
                                  }`}
                                />

                                <div className="flex min-w-0 items-center gap-2">

                                  <span>
                                    {task.name}
                                  </span>

                                  <span className="text-xs text-muted-foreground">
                                    {config.label}
                                  </span>

                                </div>

                              </div>

                            </SelectItem>
                          );

                        }

                      )

                    )}

                  </SelectContent>

                </Select>


                <Button
                  onClick={
                    handleAssign
                  }
                  disabled={
                    submitting ||
                    !selectedTaskId ||
                    availableTasks.length === 0
                  }
                  className="h-10 shrink-0 gap-2 px-4"
                >

                  <Plus className="size-4" />

                  {submitting
                    ? "Assigning..."
                    : "Assign"}

                </Button>


              </div>

            </div>


            <div className="space-y-3">


              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h3 className="flex items-center gap-2 font-medium">

                    <ClipboardCheck className="size-4 text-blue-500" />

                    Assigned Activities

                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Activities currently assigned to this employee.
                  </p>

                </div>


                <span className="text-sm text-muted-foreground">

                  {assignedTasks.length}{" "}

                  {assignedTasks.length === 1
                    ? "activity"
                    : "activities"}

                </span>

              </div>


              {employeeTasksLoading ? (

                <div className="space-y-3">

                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />

                </div>

              ) : assignedTasks.length === 0 ? (

                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">

                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">

                    <ClipboardList className="size-5 text-muted-foreground" />

                  </div>

                  <p className="mt-4 font-medium">
                    No activities assigned
                  </p>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Select an available task above to assign the first activity to this employee.
                  </p>

                </div>

              ) : (

                <div className="space-y-3">

                  {assignedTasks.map(
                    (task) => {

                      const config =
                        getTaskTypeConfig(
                          task.input_type
                        );

                      const TaskIcon =
                        config.icon;


                      return (
                        <div
                          key={task.id}
                          className="group rounded-xl border p-4 transition-colors hover:bg-muted/30"
                        >

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


                            <div className="flex min-w-0 items-start gap-3">

                              <div
                                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                              >

                                <TaskIcon className="size-5" />

                              </div>


                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <p className="font-medium">
                                    {task.name}
                                  </p>

                                  <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-green-500/10 px-2 text-xs font-medium text-green-600 dark:text-green-400">

                                    <Check className="size-3" />

                                    Assigned

                                  </span>

                                </div>


                                {task.description && (

                                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">

                                    {task.description}

                                  </p>

                                )}


                                <div className="mt-2 inline-flex h-7 items-center gap-2 rounded-md bg-muted/60 px-2 text-xs text-muted-foreground">

                                  <TaskIcon className="size-3.5" />

                                  <span>
                                    {config.label}
                                  </span>

                                  {config.description && (
                                    <>
                                      <span>
                                        ·
                                      </span>

                                      <span>
                                        {config.description}
                                      </span>
                                    </>
                                  )}

                                </div>

                              </div>

                            </div>


                            <Button
                              variant="outline"
                              size="icon"
                              disabled={
                                submitting
                              }
                              title="Unassign task"
                              aria-label={`Unassign ${task.name}`}
                              onClick={() =>
                                handleUnassign(
                                  task.task_id
                                )
                              }
                              className="size-9 shrink-0 text-red-500 hover:text-red-600"
                            >

                              <Unlink className="size-4" />

                            </Button>


                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>


          </CardContent>

        </Card>

      )}

    </div>
  );
}


export default EmployeeTasks;