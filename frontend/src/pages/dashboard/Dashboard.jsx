import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useState } from "react";

import {
  getAttendanceReport,
  getProductivityReport,
  getEmployeeReport,
} from "@/api/reports";

import AttendanceChart from "@/components/charts/AttendanceChart";
import ProductivityChart from "@/components/charts/ProductivityChart";
import ActivityTimeline from "@/components/charts/ActivityTimeline";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  CalendarIcon,
  CircleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Dashboard() {
  const queryClient = useQueryClient();

  const [dateRange, setDateRange] = useState({
    from: new Date("2026-08-01"),
    to: new Date("2026-08-10"),
  });

  const fromDate = dateRange.from?.toISOString().split("T")[0];
  const toDate = dateRange.to?.toISOString().split("T")[0];

  const {
    data: attendance,
    isLoading: attendanceLoading,
    isError: attendanceError,
  } = useQuery({
    queryKey: ["reports", "attendance", fromDate, toDate],
    queryFn: () => getAttendanceReport(fromDate, toDate),
  });

  const {
    data: productivity,
    isLoading: productivityLoading,
    isError: productivityError,
  } = useQuery({
    queryKey: ["reports", "productivity", fromDate, toDate],
    queryFn: () => getProductivityReport(fromDate, toDate),
  });

  const {
    data: employees,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useQuery({
    queryKey: ["reports", "employees", fromDate, toDate],
    queryFn: () => getEmployeeReport(fromDate, toDate),
  });

  const loading =
    attendanceLoading ||
    productivityLoading ||
    employeesLoading;

  const error =
    attendanceError ||
    productivityError ||
    employeesError;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>

              <CardContent>
                <Skeleton className="h-9 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>

              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>

          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>

          <CardContent>
            <Skeleton className="h-48 w-full" />
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
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Unable to load dashboard data.
          </p>
        </div>

        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data.
          </AlertDescription>
        </Alert>

        <Button
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ["reports"],
            })
          }
        >
          Try again
        </Button>
      </div>
    );
  }

  const summary = attendance?.summary ?? {
    present: 0,
    absent: 0,
    half_day: 0,
    leave: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-muted-foreground">
            Reporting period:
          </p>

          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline">
                  <CalendarIcon />
                  {dateRange.from
                    ? dateRange.from.toLocaleDateString()
                    : "From date"}
                </Button>
              }
            />

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) =>
                  setDateRange((current) => ({
                    ...current,
                    from: date,
                  }))
                }
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">to</span>

          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline">
                  <CalendarIcon />
                  {dateRange.to
                    ? dateRange.to.toLocaleDateString()
                    : "To date"}
                </Button>
              }
            />

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) =>
                  setDateRange((current) => ({
                    ...current,
                    to: date,
                  }))
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Present
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {summary.present}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Absent
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {summary.absent}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Half Day
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {summary.half_day}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Leave
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {summary.leave}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
          </CardHeader>

          <CardContent>
            <AttendanceChart
              attendance={attendance?.summary}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productivity</CardTitle>
          </CardHeader>

          <CardContent>
            <ProductivityChart
              tasks={productivity?.tasks ?? []}
            />
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>

        <CardContent>
          <ActivityTimeline
            timeline={productivity?.timeline ?? []}
          />
        </CardContent>
      </Card>

      {/* Employees */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Overview</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="text-right">Present</TableHead>
                  <TableHead className="text-right">Absent</TableHead>
                  <TableHead className="text-right">Half Day</TableHead>
                  <TableHead className="text-right">Leave</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(employees?.employees ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No employee attendance data for this period.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.employees.map((employee) => (
                    <TableRow key={employee.employee_code}>
                      <TableCell className="font-medium">
                        {employee.full_name}
                      </TableCell>

                      <TableCell>{employee.employee_code}</TableCell>

                      <TableCell>{employee.designation}</TableCell>

                      <TableCell className="text-right">
                        {employee.present}
                      </TableCell>

                      <TableCell className="text-right">
                        {employee.absent}
                      </TableCell>

                      <TableCell className="text-right">
                        {employee.half_day}
                      </TableCell>

                      <TableCell className="text-right">
                        {employee.leave}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;