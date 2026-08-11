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
  CalendarIcon,
  Check,
  CircleAlert,
  Pencil,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";


const ATTENDANCE_STATUSES = [
  "Present",
  "Absent",
  "Half Day",
  "Leave",
];


function Attendance() {
  const queryClient = useQueryClient();


  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );


  const [attendance, setAttendance] = useState({});


  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);


  const [editingAttendance, setEditingAttendance] =
    useState(null);

  const [editStatus, setEditStatus] = useState("");

  const [editing, setEditing] = useState(false);


  const dateString =
    selectedDate.toISOString().split("T")[0];


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
    employeesLoading || attendanceLoading;


  const error =
    employeesError || attendanceError;


  const existingAttendanceMap = Object.fromEntries(
    (existingAttendance ?? []).map((record) => [
      record.employee_id,
      record.status,
    ])
  );


  const getStatus = (employeeId) => {
    if (attendance[employeeId]) {
      return attendance[employeeId];
    }

    return existingAttendanceMap[employeeId] ?? "";
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
      const records = (employees ?? []).map(
        (employee) => ({
          employee_id: employee.id,
          status: getStatus(employee.id),
        })
      );


      const incomplete = records.some(
        (record) => !record.status
      );


      if (incomplete) {
        setSubmitError(
          "Please select an attendance status for every employee."
        );
        return;
      }


      if ((existingAttendance ?? []).length > 0) {
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
        queryKey: ["attendance", dateString],
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


  const handleEditAttendance = async () => {
    if (!editingAttendance || !editStatus) {
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
        queryKey: ["attendance", dateString],
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


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-64" />
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Attendance
          </h1>


          <p className="text-muted-foreground">
            Mark daily employee attendance.
          </p>
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


  const attendanceAlreadyMarked =
    (existingAttendance ?? []).length > 0;


  const getEmployeeName = (employeeId) => {
    return (
      employees?.find(
        (employee) =>
          employee.id === employeeId
      )?.full_name || "Employee"
    );
  };


  return (
    <div className="space-y-6">

      {/* Edit Attendance Dialog */}

      <Dialog
        open={Boolean(editingAttendance)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingAttendance(null);
            setEditStatus("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Attendance
            </DialogTitle>
          </DialogHeader>


          {editingAttendance && (
            <div className="space-y-4">

              <div>
                <p className="font-medium">
                  {getEmployeeName(
                    editingAttendance.employee_id
                  )}
                </p>

                <p className="text-sm text-muted-foreground">
                  {selectedDate.toLocaleDateString()}
                </p>
              </div>


              <Select
                value={editStatus}
                onValueChange={setEditStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  {ATTENDANCE_STATUSES.map(
                    (status) => (
                      <SelectItem
                        key={status}
                        value={status}
                      >
                        {status}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>


              <Button
                className="w-full"
                onClick={handleEditAttendance}
                disabled={
                  editing || !editStatus
                }
              >
                {editing
                  ? "Saving..."
                  : "Save Changes"}
              </Button>

            </div>
          )}
        </DialogContent>
      </Dialog>


      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Attendance
        </h1>


        <p className="text-muted-foreground">
          Mark daily employee attendance.
        </p>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>
            Attendance Date
          </CardTitle>
        </CardHeader>


        <CardContent>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className="w-[240px] justify-start"
                >
                  <CalendarIcon />

                  {selectedDate.toLocaleDateString()}
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
        </CardContent>
      </Card>


      {attendanceAlreadyMarked && (
        <Alert>
          <Check />

          <AlertTitle>
            Attendance already marked
          </AlertTitle>

          <AlertDescription>
            Attendance has already been recorded
            for this date.
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
          <CardTitle>
            Employee Attendance
          </CardTitle>
        </CardHeader>


        <CardContent>
          {(employees ?? []).length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No employees found.
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

                  return (
                    <div
                      key={employee.id}
                      className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="group flex items-center gap-2">

                        <div>
                          <p className="font-medium">
                            {employee.full_name}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {employee.employee_code}{" "}
                            ·{" "}
                            {employee.designation}
                          </p>
                        </div>


                        {record && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => {
                              setEditingAttendance(
                                record
                              );

                              setEditStatus(
                                record.status
                              );

                              setSubmitError(null);
                            }}
                            aria-label={`Edit attendance for ${employee.full_name}`}
                            title={`Edit attendance for ${employee.full_name}`}
                          >
                            <Pencil />
                          </Button>
                        )}

                      </div>


                      <Select
                        value={getStatus(
                          employee.id
                        )}
                        onValueChange={(value) =>
                          handleStatusChange(
                            employee.id,
                            value
                          )
                        }
                        disabled={
                          attendanceAlreadyMarked
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent>
                          {ATTENDANCE_STATUSES.map(
                            (status) => (
                              <SelectItem
                                key={status}
                                value={status}
                              >
                                {status}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                    </div>
                  );
                }
              )}

            </div>
          )}


          {(employees ?? []).length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  attendanceAlreadyMarked
                }
              >
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