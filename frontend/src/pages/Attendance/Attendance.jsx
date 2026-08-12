import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getEmployees } from "@/api/employees";
import {
  getAttendance,
  markBulkAttendance,
  updateAttendance,
} from "@/api/attendance";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { Skeleton } from "@/components/ui/skeleton";

import {
  CalendarCheck,
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  Pencil,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";


const ATTENDANCE_STATUSES = [
  "Present",
  "Absent",
  "Half Day",
  "Leave",
];


const STATUS_CONFIG = {
  Present: {
    icon: UserCheck,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
    dot: "bg-green-500",
  },

  Absent: {
    icon: UserX,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    dot: "bg-red-500",
  },

  "Half Day": {
    icon: Clock3,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    dot: "bg-amber-500",
  },

  Leave: {
    icon: CalendarDays,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    dot: "bg-blue-500",
  },
};


function Attendance() {
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [attendance, setAttendance] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState(null);

  const [success, setSuccess] =
    useState(false);

  const [editingAttendance, setEditingAttendance] =
    useState(null);

  const [editStatus, setEditStatus] =
    useState("");

  const [editing, setEditing] =
    useState(false);


  const dateString =
    new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(selectedDate);


  const {
    data: employees,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });


  const {
    data: existingAttendance,
    isLoading: attendanceLoading,
    isError: attendanceError,
  } = useQuery({
    queryKey: ["attendance", dateString],
    queryFn: () => getAttendance(dateString),
  });


  const loading =
    employeesLoading ||
    attendanceLoading;

  const error =
    employeesError ||
    attendanceError;


  const existingAttendanceMap =
    Object.fromEntries(
      (existingAttendance ?? []).map(
        (record) => [
          record.employee_id,
          record.status,
        ]
      )
    );


  const getStatus = (employeeId) => {
    if (attendance[employeeId]) {
      return attendance[employeeId];
    }

    return (
      existingAttendanceMap[employeeId] ??
      ""
    );
  };


  const handleStatusChange = (
    employeeId,
    status
  ) => {
    setSuccess(false);
    setSubmitError(null);

    setAttendance((current) => ({
      ...current,
      [employeeId]: status,
    }));
  };


  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setSuccess(false);

    try {
      const records =
        (employees ?? []).map(
          (employee) => ({
            employee_id: employee.id,
            status: getStatus(
              employee.id
            ),
          })
        );


      const incomplete =
        records.some(
          (record) => !record.status
        );


      if (incomplete) {
        setSubmitError(
          "Please select an attendance status for every employee."
        );
        return;
      }


      if (
        (existingAttendance ?? [])
          .length > 0
      ) {
        setSubmitError(
          "Attendance has already been marked for one or more employees on this date."
        );
        return;
      }


      await markBulkAttendance(
        dateString,
        records
      );


      await queryClient.invalidateQueries({
        queryKey: [
          "attendance",
          dateString,
        ],
      });


      setAttendance({});
      setSuccess(true);

    } catch (error) {
      console.error(
        "Failed to mark attendance:",
        error
      );

      setSubmitError(
        error?.response?.data?.detail ||
          "Failed to mark attendance."
      );

    } finally {
      setSubmitting(false);
    }
  };


  const handleEditAttendance =
    async () => {
      if (
        !editingAttendance ||
        !editStatus
      ) {
        return;
      }

      try {
        setEditing(true);
        setSubmitError(null);

        await updateAttendance(
          editingAttendance.id,
          editStatus
        );

        await queryClient.invalidateQueries({
          queryKey: [
            "attendance",
            dateString,
          ],
        });

        setEditingAttendance(null);
        setEditStatus("");
        setSuccess(true);

      } catch (error) {
        console.error(
          "Failed to update attendance:",
          error
        );

        setSubmitError(
          error?.response?.data?.detail ||
            "Failed to update attendance."
        );

      } finally {
        setEditing(false);
      }
    };


  const attendanceAlreadyMarked =
    (existingAttendance ?? []).length >
    0;


  const getEmployeeName = (
    employeeId
  ) => {
    return (
      employees?.find(
        (employee) =>
          employee.id === employeeId
      )?.full_name || "Employee"
    );
  };


  const getStatusConfig = (status) => {
    return (
      STATUS_CONFIG[status] ?? {
        icon: CalendarCheck,
        color:
          "text-muted-foreground",
        bg: "bg-muted",
        dot: "bg-muted-foreground",
      }
    );
  };


  const statusCounts =
    ATTENDANCE_STATUSES.reduce(
      (counts, status) => {
        counts[status] =
          (employees ?? []).filter(
            (employee) =>
              getStatus(employee.id) ===
              status
          ).length;

        return counts;
      },
      {}
    );


  if (loading) {
    return (
      <div className="space-y-6">

        <div className="flex items-center gap-3">

          <Skeleton className="size-11 rounded-xl" />

          <div className="space-y-2">

            <Skeleton className="h-9 w-40" />

            <Skeleton className="h-4 w-64" />

          </div>

        </div>


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />

        </div>


        <Card>

          <CardHeader>

            <Skeleton className="h-5 w-40" />

          </CardHeader>

          <CardContent>

            <Skeleton className="h-10 w-56" />

          </CardContent>

        </Card>


        <Card>

          <CardContent className="space-y-3 pt-6">

            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />

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

            <CalendarCheck className="size-5 text-primary" />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Attendance
            </h1>

            <p className="text-muted-foreground">
              Mark and manage daily employee attendance.
            </p>

          </div>

        </div>


        <Alert variant="destructive">

          <CircleAlert />

          <AlertTitle>
            Something went wrong
          </AlertTitle>

          <AlertDescription>
            Unable to load attendance data.
          </AlertDescription>

        </Alert>

      </div>
    );
  }


  return (
    <div className="space-y-6">


      <Dialog
        open={Boolean(editingAttendance)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingAttendance(null);
            setEditStatus("");
          }
        }}
      >

        <DialogContent className="sm:max-w-[440px]">

          <DialogHeader>

            <div className="flex items-center gap-3">

              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">

                <Pencil className="size-5 text-primary" />

              </div>

              <div>

                <DialogTitle>
                  Edit Attendance
                </DialogTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update the attendance status for this employee.
                </p>

              </div>

            </div>

          </DialogHeader>


          {editingAttendance && (
            <div className="space-y-5">

              <div className="rounded-xl border bg-muted/30 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">

                    {getEmployeeName(
                      editingAttendance.employee_id
                    )
                      .split(" ")
                      .map(
                        (part) =>
                          part[0]
                      )
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}

                  </div>

                  <div>

                    <p className="font-medium">
                      {getEmployeeName(
                        editingAttendance.employee_id
                      )}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {selectedDate.toLocaleDateString(
                        undefined,
                        {
                          weekday:
                            "long",
                          day: "numeric",
                          month:
                            "long",
                          year:
                            "numeric",
                        }
                      )}
                    </p>

                  </div>

                </div>

              </div>


              <div className="space-y-2">

                <p className="text-sm font-medium">
                  Attendance Status
                </p>

                <Select
                  value={editStatus}
                  onValueChange={
                    setEditStatus
                  }
                >

                  <SelectTrigger className="h-11">

                    <SelectValue placeholder="Select status" />

                  </SelectTrigger>


                  <SelectContent>

                    {ATTENDANCE_STATUSES.map(
                      (status) => {
                        const config =
                          getStatusConfig(
                            status
                          );

                        const Icon =
                          config.icon;

                        return (
                          <SelectItem
                            key={status}
                            value={status}
                          >

                            <div className="flex items-center gap-2">

                              <Icon
                                className={`size-4 ${config.color}`}
                              />

                              {status}

                            </div>

                          </SelectItem>
                        );
                      }
                    )}

                  </SelectContent>

                </Select>

              </div>


              <Button
                className="w-full gap-2"
                onClick={
                  handleEditAttendance
                }
                disabled={
                  editing ||
                  !editStatus
                }
              >

                <Check className="size-4" />

                {editing
                  ? "Saving..."
                  : "Save Changes"}

              </Button>

            </div>
          )}

        </DialogContent>

      </Dialog>


      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">

            <CalendarCheck className="size-5 text-primary" />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Attendance
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Mark and manage daily employee attendance.
            </p>

          </div>

        </div>


        <Popover>

          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="w-full justify-start gap-2 sm:w-[250px]"
              >

                <CalendarDays className="size-4" />

                {selectedDate.toLocaleDateString(
                  undefined,
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}

              </Button>
            }
          />

          <PopoverContent className="w-auto p-0">

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setAttendance({});
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


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


        {ATTENDANCE_STATUSES.map(
          (status) => {
            const config =
              getStatusConfig(status);

            const Icon =
              config.icon;

            return (
              <Card key={status}>

                <CardContent className="p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-medium text-muted-foreground">
                        {status}
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        {statusCounts[status] ??
                          0}
                      </p>

                    </div>


                    <div
                      className={`flex size-10 items-center justify-center rounded-xl ${config.bg}`}
                    >

                      <Icon
                        className={`size-5 ${config.color}`}
                      />

                    </div>

                  </div>

                </CardContent>

              </Card>
            );
          }
        )}

      </div>


      {attendanceAlreadyMarked && (
        <Alert>

          <Check />

          <AlertTitle>
            Attendance already marked
          </AlertTitle>

          <AlertDescription>
            Attendance has already been recorded
            for this date. Existing records can
            still be edited individually.
          </AlertDescription>

        </Alert>
      )}


      {submitError && (
        <Alert variant="destructive">

          <CircleAlert />

          <AlertTitle>
            Unable to save attendance
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
            Attendance saved
          </AlertTitle>

          <AlertDescription>
            Attendance has been successfully saved.
          </AlertDescription>

        </Alert>
      )}


      <Card>

        <CardHeader>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <CardTitle className="flex items-center gap-2">

                <Users className="size-5 text-primary" />

                Employee Attendance

              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Set the attendance status for each employee.
              </p>

            </div>


            <div className="text-sm text-muted-foreground">

              {employees?.length ?? 0} employees

            </div>

          </div>

        </CardHeader>


        <CardContent>

          {(employees ?? []).length === 0 ? (

            <div className="flex min-h-[260px] flex-col items-center justify-center text-center">

              <div className="flex size-14 items-center justify-center rounded-full bg-muted">

                <Users className="size-6 text-muted-foreground" />

              </div>

              <p className="mt-4 font-medium">
                No employees found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add employees before marking attendance.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {(employees ?? []).map(
                (employee) => {

                  const record =
                    existingAttendance?.find(
                      (item) =>
                        item.employee_id ===
                        employee.id
                    );

                  const currentStatus =
                    getStatus(
                      employee.id
                    );

                  const config =
                    getStatusConfig(
                      currentStatus
                    );

                  const StatusIcon =
                    config.icon;

                  return (
                    <div
                      key={employee.id}
                      className="group flex flex-col gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">

                          {employee.full_name
                            .split(" ")
                            .map(
                              (part) =>
                                part[0]
                            )
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}

                        </div>


                        <div className="min-w-0">

                          <p className="font-medium">
                            {employee.full_name}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">

                            <span>
                              {employee.employee_code}
                            </span>

                            <span>
                              •
                            </span>

                            <span>
                              {employee.designation}
                            </span>

                          </div>

                        </div>


                        {currentStatus && (
                          <div
                            className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:flex ${config.bg} ${config.color}`}
                          >

                            <StatusIcon className="size-3.5" />

                            {currentStatus}

                          </div>
                        )}

                      </div>


                      <div className="flex items-center gap-2">

                        <Select
                          value={currentStatus}
                          onValueChange={(
                            value
                          ) =>
                            handleStatusChange(
                              employee.id,
                              value
                            )
                          }
                          disabled={
                            attendanceAlreadyMarked
                          }
                        >

                          <SelectTrigger className="w-full sm:w-[180px]">

                            <SelectValue placeholder="Select status" />

                          </SelectTrigger>


                          <SelectContent>

                            {ATTENDANCE_STATUSES.map(
                              (status) => {

                                const statusConfig =
                                  getStatusConfig(
                                    status
                                  );

                                const Icon =
                                  statusConfig.icon;

                                return (
                                  <SelectItem
                                    key={status}
                                    value={status}
                                  >

                                    <div className="flex items-center gap-2">

                                      <Icon
                                        className={`size-4 ${statusConfig.color}`}
                                      />

                                      {status}

                                    </div>

                                  </SelectItem>
                                );
                              }
                            )}

                          </SelectContent>

                        </Select>


                        {record && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingAttendance(
                                record
                              );

                              setEditStatus(
                                record.status
                              );

                              setSubmitError(
                                null
                              );
                            }}
                            aria-label={`Edit attendance for ${employee.full_name}`}
                            title={`Edit attendance for ${employee.full_name}`}
                          >

                            <Pencil className="size-4" />

                          </Button>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}


          {(employees ?? []).length >
            0 && (
            <div className="mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-muted-foreground">

                {attendanceAlreadyMarked
                  ? "Attendance is already recorded for this date."
                  : "Make sure every employee has a status before saving."}

              </p>


              <Button
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  attendanceAlreadyMarked
                }
                className="gap-2"
              >

                <Check className="size-4" />

                {submitting
                  ? "Saving..."
                  : "Mark Attendance"}

              </Button>

            </div>
          )}

        </CardContent>

      </Card>

    </div>
  );
}


export default Attendance;