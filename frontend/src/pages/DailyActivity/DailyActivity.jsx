import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getEmployees } from "@/api/employees";
import { getAttendance } from "@/api/attendance";
import {
  getEmployeeTasks,
  getDailyActivity,
  createDailyActivity,
  updateDailyActivity,
} from "@/api/dailyActivity";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Activity,
  CalendarCheck,
  CalendarDays,
  Check,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Hash,
  MessageSquareText,
  ToggleLeft,
  Type,
  Users,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";


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


const getDateString = (date) => {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
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


function DailyActivity() {
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [values, setValues] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState(null);

  const [success, setSuccess] =
    useState(false);


  const dateString =
    getDateString(selectedDate);


  const {
    data: employees,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });


  const {
    data: attendance,
    isLoading: attendanceLoading,
    isError: attendanceError,
  } = useQuery({
    queryKey: ["attendance", dateString],
    queryFn: () => getAttendance(dateString),
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


  const selectedEmployee = (
    employees ?? []
  ).find(
    (employee) =>
      String(employee.id) ===
      selectedEmployeeId
  );


  const selectedAttendance = (
    attendance ?? []
  ).find(
    (record) =>
      selectedEmployee &&
      record.employee_id ===
        selectedEmployee.id
  );


  const {
    data: existingActivity,
    isLoading: activityLoading,
    isError: activityError,
  } = useQuery({
    queryKey: [
      "daily-activity",
      selectedAttendance?.id,
    ],

    queryFn: async () => {
      try {
        return await getDailyActivity(
          selectedAttendance.id
        );
      } catch (error) {
        if (
          error?.response?.status ===
          404
        ) {
          return null;
        }

        throw error;
      }
    },

    enabled: Boolean(
      selectedAttendance
    ),
  });


  const assignedTasks =
    employeeTasks ?? [];


  const loading =
    employeesLoading ||
    attendanceLoading ||
    employeeTasksLoading ||
    activityLoading;


  const error =
    employeesError ||
    attendanceError ||
    employeeTasksError ||
    activityError;


  const activityExists =
    Boolean(existingActivity);

  const recordedValues = (
    existingActivity?.items ?? []
  ).reduce((current, item) => {
    current[item.task_id] = item.value;

    return current;
  }, {});

  const getTaskValue = (taskId) =>
    values[taskId] ??
    recordedValues[taskId] ??
    "";


  const handleEmployeeChange = (
    value
  ) => {
    setSelectedEmployeeId(value);
    setValues({});
    setRemarks("");
    setSubmitError(null);
    setSuccess(false);
  };


  const handleValueChange = (
    taskId,
    value
  ) => {
    setSubmitError(null);
    setSuccess(false);

    setValues((current) => ({
      ...current,
      [taskId]: value,
    }));
  };


  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setSuccess(false);

    try {
      if (!selectedAttendance) {
        setSubmitError(
          "Attendance must be marked before creating daily activity."
        );
        return;
      }

      if (assignedTasks.length === 0) {
        setSubmitError(
          "No activities are assigned to this employee."
        );
        return;
      }

      const incomplete =
        assignedTasks.some(
          (task) =>
            (
              values[task.task_id] ===
                undefined &&
              recordedValues[task.task_id] ===
                undefined
            ) ||
            getTaskValue(task.task_id) === ""
        );

      if (incomplete) {
        setSubmitError(
          "Please complete every activity before saving."
        );
        return;
      }

      const items =
        assignedTasks.map(
          (task) => ({
            task_id:
              task.task_id,

            value: String(
              getTaskValue(task.task_id)
            ),
          })
        );

      const activityRemarks =
        remarks ||
        existingActivity?.remarks ||
        "";

      if (activityExists) {
        await updateDailyActivity(
          selectedAttendance.id,
          activityRemarks,
          items
        );
      } else {
        await createDailyActivity(
          selectedAttendance.id,
          activityRemarks,
          items
        );
      }

      await queryClient.invalidateQueries({
        queryKey: [
          "daily-activity",
          selectedAttendance.id,
        ],
      });

      setSuccess(true);

    } catch (error) {
      console.error(
        "Failed to create daily activity:",
        error
      );

      setSubmitError(
        error?.response?.data?.detail ||
          "Failed to save daily activity."
      );

    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="space-y-6">

        <div className="flex items-center gap-3">

          <Skeleton className="size-11 rounded-xl" />

          <div className="space-y-2">

            <Skeleton className="h-9 w-48" />

            <Skeleton className="h-4 w-72" />

          </div>

        </div>


        <div className="grid gap-4 md:grid-cols-2">

          <Skeleton className="h-24" />
          <Skeleton className="h-24" />

        </div>


        <Card>

          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>

          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>

        </Card>

      </div>
    );
  }


  if (error) {
    return (
      <div className="space-y-6">

        <div className="flex items-center gap-3">

          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">

            <Activity className="size-5 text-primary" />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Daily Activity
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Record employee task activity for a day.
            </p>

          </div>

        </div>


        <Alert variant="destructive">

          <CircleAlert />

          <AlertTitle>
            Something went wrong
          </AlertTitle>

          <AlertDescription>
            Unable to load employees, attendance,
            or employee activities.
          </AlertDescription>

        </Alert>

      </div>
    );
  }


  const activeEmployees = (
    employees ?? []
  ).filter(
    (employee) =>
      employee.is_active
  );


  return (
    <div className="space-y-6">


      <div className="flex items-center gap-3">

        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">

          <Activity className="size-5 text-primary" />

        </div>


        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            Daily Activity
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Record employee task activity for a day.
          </p>

        </div>

      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


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


              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10">

                <Users className="size-5 text-blue-500" />

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Selected Date
                </p>

                <p className="mt-1 text-lg font-bold">

                  {selectedDate.toLocaleDateString(
                    undefined,
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}

                </p>

              </div>


              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10">

                <CalendarDays className="size-5 text-violet-500" />

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Assigned Activities
                </p>

                <p className="mt-1 text-3xl font-bold">

                  {selectedEmployee
                    ? assignedTasks.length
                    : "—"}

                </p>

              </div>


              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">

                <ClipboardList className="size-5 text-amber-500" />

              </div>

            </div>

          </CardContent>

        </Card>


      </div>


      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <ClipboardCheck className="size-5 text-primary" />

            Activity Details

          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Select a date and employee to record their daily activity.
          </p>

        </CardHeader>


        <CardContent className="space-y-5">


          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


            <div className="min-w-0 space-y-2">

              <Label>
                Date
              </Label>


              <Popover>

                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="!h-10 !w-full justify-start gap-2 px-3"
                    >

                      <CalendarDays className="size-4 shrink-0" />

                      <span className="truncate">

                        {selectedDate.toLocaleDateString(
                          undefined,
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}

                      </span>

                    </Button>
                  }
                />


                <PopoverContent
                  align="start"
                  className="w-auto p-0"
                >

                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {

                      if (date) {

                        setSelectedDate(date);
                        setSelectedEmployeeId("");
                        setValues({});
                        setRemarks("");
                        setSuccess(false);
                        setSubmitError(null);

                      }

                    }}
                    disabled={{
                      after: new Date(),
                    }}
                  />

                </PopoverContent>

              </Popover>

            </div>


            <div className="min-w-0 space-y-2">

              <Label>
                Employee
              </Label>


              <Select
                value={selectedEmployeeId}
                onValueChange={
                  handleEmployeeChange
                }
              >

                <SelectTrigger className="!h-10 !w-full">

                  <SelectValue placeholder="Select employee" />

                </SelectTrigger>


                <SelectContent className="min-w-[320px]">

                  {activeEmployees.length ===
                  0 ? (

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
                                {
                                  employee.employee_code
                                }
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


          </div>


          {selectedEmployee && (

            <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-3.5">

              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">

                {getInitials(
                  selectedEmployee.full_name
                )}

              </div>


              <div className="min-w-0">

                <p className="truncate font-medium">
                  {selectedEmployee.full_name}
                </p>


                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">

                  <span>
                    {selectedEmployee.employee_code}
                  </span>

                  <span>
                    •
                  </span>

                  <span>
                    {selectedEmployee.designation}
                  </span>

                </div>

              </div>

            </div>

          )}


          {selectedEmployee &&
            !selectedAttendance && (

              <Alert variant="destructive">

                <CircleAlert />

                <AlertTitle>
                  Attendance not found
                </AlertTitle>

                <AlertDescription>

                  Attendance must be marked for{" "}
                  {selectedEmployee.full_name}{" "}
                  on{" "}
                  {selectedDate.toLocaleDateString()}{" "}
                  before daily activity can be recorded.

                </AlertDescription>

              </Alert>

            )}


          {selectedAttendance &&
            !activityExists && (

              <Alert>

                <CalendarCheck />

                <AlertTitle>
                  Attendance recorded
                </AlertTitle>

                <AlertDescription>

                  Status:{" "}

                  <span className="font-medium">
                    {selectedAttendance.status}
                  </span>

                </AlertDescription>

              </Alert>

            )}


          {selectedAttendance &&
            !activityLoading &&
            activityExists && (

              <Alert>

                <Check />

                <AlertTitle>
                  Daily activity already recorded
                </AlertTitle>

                <AlertDescription>

                  Daily activity has already been
                  recorded for{" "}
                  {selectedEmployee?.full_name}{" "}
                  on{" "}
                  {selectedDate.toLocaleDateString()}.
                  You can update currently
                  assigned activities below.

                </AlertDescription>

              </Alert>

            )}


        </CardContent>

      </Card>


      {selectedAttendance &&
        !activityLoading && (

          <Card>

            <CardHeader>

              <div className="flex items-center justify-between gap-4">

                <div>

                  <CardTitle className="flex items-center gap-2">

                    <Activity className="size-5 text-primary" />

                    Task Activity

                  </CardTitle>


                  <p className="mt-1 text-sm text-muted-foreground">
                    {activityExists
                      ? "Update values for currently assigned activities."
                      : "Enter the values for each assigned activity."}
                  </p>

                </div>


                <div className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">

                  {assignedTasks.length}{" "}

                  {assignedTasks.length === 1
                    ? "activity"
                    : "activities"}

                </div>

              </div>

            </CardHeader>


            <CardContent className="space-y-6">


              {assignedTasks.length ===
              0 ? (

                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">

                  <div className="flex size-12 items-center justify-center rounded-xl bg-muted">

                    <ClipboardList className="size-5 text-muted-foreground" />

                  </div>


                  <p className="mt-4 font-medium">
                    No activities assigned
                  </p>


                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    No activities are assigned to this employee.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {assignedTasks.map(
                    (task) => {

                      const config =
                        getTaskTypeConfig(
                          task.input_type
                        );

                      const TaskIcon =
                        config.icon;

                      const taskValue =
                        getTaskValue(
                          task.task_id
                        );


                      return (
                        <div
                          key={
                            task.task_id
                          }
                          className="rounded-xl border p-5 transition-colors hover:bg-muted/20"
                        >

                          <div className="flex flex-col gap-4">


                            <div className="flex items-start gap-3">

                              <div
                                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                              >

                                <TaskIcon className="size-5" />

                              </div>


                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <Label className="text-base font-semibold">
                                    {task.name}
                                  </Label>


                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
                                  >
                                    {config.label}
                                  </span>

                                </div>


                                {task.description && (

                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {task.description}
                                  </p>

                                )}

                              </div>

                            </div>


                            {task.input_type ===
                              "Boolean" && (

                              <Select
                                value={
                                  taskValue
                                }
                                onValueChange={(
                                  value
                                ) =>
                                  handleValueChange(
                                    task.task_id,
                                    value
                                  )
                                }
                              >

                                <SelectTrigger className="!h-10 !w-full">

                                  <SelectValue placeholder="Select Yes or No" />

                                </SelectTrigger>


                                <SelectContent className="min-w-[220px]">

                                  <SelectItem value="true">

                                    <div className="flex items-center gap-2">

                                      <Check className="size-4 text-green-500" />

                                      Yes

                                    </div>

                                  </SelectItem>


                                  <SelectItem value="false">

                                    <div className="flex items-center gap-2">

                                      <CircleAlert className="size-4 text-red-500" />

                                      No

                                    </div>

                                  </SelectItem>

                                </SelectContent>

                              </Select>

                            )}


                            {task.input_type ===
                              "Integer" && (

                              <div className="relative">

                                <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                <input
                                  type="number"
                                  min="0"
                                  value={taskValue}
                                  onChange={(
                                    event
                                  ) =>
                                    handleValueChange(
                                      task.task_id,
                                      event.target.value
                                    )
                                  }
                                  placeholder="Enter a number"
                                  className="flex !h-10 w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />

                              </div>

                            )}


                            {task.input_type ===
                              "Text" && (

                              <div className="relative">

                                <Type className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                <input
                                  type="text"
                                  value={taskValue}
                                  onChange={(
                                    event
                                  ) =>
                                    handleValueChange(
                                      task.task_id,
                                      event.target.value
                                    )
                                  }
                                  placeholder="Enter activity value"
                                  className="flex !h-10 w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />

                              </div>

                            )}

                          </div>

                        </div>
                      );

                    }
                  )}

                </div>

              )}


              {assignedTasks.length > 0 && (

                <>

                  <div className="space-y-2 border-t pt-6">

                    <Label
                      htmlFor="remarks"
                      className="flex items-center gap-2"
                    >

                      <MessageSquareText className="size-4 text-muted-foreground" />

                      Remarks

                    </Label>


                    <Textarea
                      id="remarks"
                      value={remarks}
                      onChange={(event) =>
                        setRemarks(
                          event.target.value
                        )
                      }
                      placeholder={
                        existingActivity?.remarks ||
                        "Optional remarks..."
                      }
                      rows={4}
                    />

                  </div>


                  {submitError && (

                    <Alert variant="destructive">

                      <CircleAlert />

                      <AlertTitle>
                        Unable to save activity
                      </AlertTitle>

                      <AlertDescription>
                        {submitError}
                      </AlertDescription>

                    </Alert>

                  )}


                  {success && (

                    <Alert>

                      <Check />

                      <AlertTitle>
                        Activity saved
                      </AlertTitle>

                      <AlertDescription>
                        Daily activity has been recorded successfully.
                      </AlertDescription>

                    </Alert>

                  )}


                  <div className="flex justify-end border-t pt-5">

                    <Button
                      onClick={
                        handleSubmit
                      }
                      disabled={
                        submitting ||
                        assignedTasks.length === 0
                      }
                      className="!h-10 gap-2 px-4"
                    >

                      <Check className="size-4" />

                      {submitting
                        ? "Saving..."
                        : activityExists
                          ? "Update Activity"
                          : "Save Activity"}

                    </Button>

                  </div>

                </>

              )}

            </CardContent>

          </Card>

        )}

    </div>
  );
}


export default DailyActivity;
