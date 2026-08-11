import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { CalendarIcon, FileBarChart } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  getAttendanceReport,
  getProductivityReport,
  getEmployeeReport,
  downloadAttendanceExcel,
  downloadAttendancePdf,
  downloadProductivityExcel,
  downloadProductivityPdf,
  downloadEmployeeExcel,
  downloadEmployeePdf,
} from "@/api/reports";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


function Reports() {
  const [reportType, setReportType] = useState("attendance");

  const [dateRange, setDateRange] = useState({
    from: new Date("2026-08-01"),
    to: new Date("2026-08-10"),
  });

  const fromDate = dateRange.from?.toISOString().split("T")[0];
  const toDate = dateRange.to?.toISOString().split("T")[0];
  
  const {
    data: report,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["report", reportType, fromDate, toDate],
    queryFn: async () => {
      if (reportType === "attendance") {
        return getAttendanceReport(fromDate, toDate);
      }

      if (reportType === "productivity") {
        return getProductivityReport(fromDate, toDate);
      }

      return getEmployeeReport(fromDate, toDate);
    },
    enabled: false,
  });

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports
        </h1>

        <p className="text-muted-foreground">
          Generate and export reports for the selected period.
        </p>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Reporting Period */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Reporting Period
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {/* From Date */}
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
                    disabled={{ after: new Date() }}
                    />
                </PopoverContent>
                </Popover>

                <span className="text-muted-foreground">
                to
                </span>

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
                    disabled={[
                        { before: dateRange.from },
                        { after: new Date() },
                    ]}
                    />
                </PopoverContent>
                </Popover>
            </div>
          </div>

          {/* Report Type */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Report Type
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={
                  reportType === "attendance"
                    ? "default"
                    : "outline"
                }
                onClick={() => setReportType("attendance")}
              >
                Attendance
              </Button>

              <Button
                variant={
                  reportType === "productivity"
                    ? "default"
                    : "outline"
                }
                onClick={() => setReportType("productivity")}
              >
                Productivity
              </Button>

              <Button
                variant={
                  reportType === "employees"
                    ? "default"
                    : "outline"
                }
                onClick={() => setReportType("employees")}
              >
                Employees
              </Button>
            </div>
          </div>

          {/* Generate */}
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <FileBarChart />

            {isFetching
              ? "Generating..."
              : "Generate Report"}
          </Button>

          <div className="flex flex-wrap gap-2">
            <Button
                variant="outline"
                disabled={!report}
                onClick={async () => {
                let blob;
                let filename;

                if (reportType === "attendance") {
                    blob = await downloadAttendanceExcel(fromDate, toDate);
                    filename = "attendance_report.xlsx";
                } else if (reportType === "productivity") {
                    blob = await downloadProductivityExcel(fromDate, toDate);
                    filename = "productivity_report.xlsx";
                } else {
                    blob = await downloadEmployeeExcel(fromDate, toDate);
                    filename = "employee_report.xlsx";
                }

                downloadFile(blob, filename);
                }}
            >
                Export Excel
            </Button>

            <Button
                variant="outline"
                disabled={!report}
                onClick={async () => {
                let blob;
                let filename;

                if (reportType === "attendance") {
                    blob = await downloadAttendancePdf(fromDate, toDate);
                    filename = "attendance_report.pdf";
                } else if (reportType === "productivity") {
                    blob = await downloadProductivityPdf(fromDate, toDate);
                    filename = "productivity_report.pdf";
                } else {
                    blob = await downloadEmployeePdf(fromDate, toDate);
                    filename = "employee_report.pdf";
                }

                downloadFile(blob, filename);
                }}
            >
                Export PDF
            </Button>
          </div>

          {/* Selected Report */}
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">
              Selected report
            </p>

            <p className="mt-1 text-lg font-medium capitalize">
              {reportType}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {isError && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-destructive">
              Failed to generate report.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {error?.message || "An unexpected error occurred."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Report Result */}
      {report && reportType === "attendance" && (
        <Card>
            <CardHeader>
            <CardTitle>Attendance Report</CardTitle>
            </CardHeader>

            <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                    Present
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-3xl font-bold">
                    {report.summary?.present ?? 0}
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
                    {report.summary?.absent ?? 0}
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
                    {report.summary?.half_day ?? 0}
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
                    {report.summary?.leave ?? 0}
                    </p>
                </CardContent>
                </Card>
            </div>
            </CardContent>
        </Card>
        )}

        {report && reportType === "productivity" && (
            <Card>
                <CardHeader>
                <CardTitle>Productivity Report</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                {/* Task Summary */}
                <div>
                    <h3 className="mb-3 text-sm font-medium">
                    Tasks
                    </h3>

                    <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead className="text-right">
                            Total
                            </TableHead>
                        </TableRow>
                        </TableHeader>

                        <TableBody>
                        {(report.tasks ?? []).length === 0 ? (
                            <TableRow>
                            <TableCell
                                colSpan={2}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No productivity data for this period.
                            </TableCell>
                            </TableRow>
                        ) : (
                            report.tasks.map((item) => (
                            <TableRow key={item.task}>
                                <TableCell className="font-medium">
                                {item.task}
                                </TableCell>

                                <TableCell className="text-right">
                                {item.total}
                                </TableCell>
                            </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <h3 className="mb-3 text-sm font-medium">
                    Activity Timeline
                    </h3>

                    <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">
                            Total
                            </TableHead>
                        </TableRow>
                        </TableHeader>

                        <TableBody>
                        {(report.timeline ?? []).length === 0 ? (
                            <TableRow>
                            <TableCell
                                colSpan={2}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No activity recorded for this period.
                            </TableCell>
                            </TableRow>
                        ) : (
                            report.timeline.map((item) => (
                            <TableRow key={item.date}>
                                <TableCell className="font-medium">
                                {item.date}
                                </TableCell>

                                <TableCell className="text-right">
                                {item.total}
                                </TableCell>
                            </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                    </div>
                </div>
                </CardContent>
            </Card>
        )}

        {report && reportType === "employees" && (
            <Card>
                <CardHeader>
                <CardTitle>Employee Report</CardTitle>
                </CardHeader>

                <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead className="text-right">
                            Present
                        </TableHead>
                        <TableHead className="text-right">
                            Absent
                        </TableHead>
                        <TableHead className="text-right">
                            Half Day
                        </TableHead>
                        <TableHead className="text-right">
                            Leave
                        </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {(report.employees ?? []).length === 0 ? (
                        <TableRow>
                            <TableCell
                            colSpan={7}
                            className="h-24 text-center text-muted-foreground"
                            >
                            No employee data for this period.
                            </TableCell>
                        </TableRow>
                        ) : (
                        report.employees.map((employee) => (
                            <TableRow key={employee.employee_code}>
                            <TableCell className="font-medium">
                                {employee.full_name}
                            </TableCell>

                            <TableCell>
                                {employee.employee_code}
                            </TableCell>

                            <TableCell>
                                {employee.designation}
                            </TableCell>

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
        )}
    </div>
  );
}

export default Reports;