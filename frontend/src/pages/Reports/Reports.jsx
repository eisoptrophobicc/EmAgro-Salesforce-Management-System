import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Activity,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  Check,
  CircleAlert,
  ClipboardCheck,
  Download,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  UserRoundCheck,
  UserRoundX,
  Users,
  Clock3,
} from "lucide-react";


const REPORT_TYPES = {
  attendance: {
    label: "Attendance",
    description:
      "Attendance status and daily presence",
    icon: ClipboardCheck,
  },

  productivity: {
    label: "Productivity",
    description:
      "Task activity and productivity trends",
    icon: TrendingUp,
  },

  employees: {
    label: "Employees",
    description:
      "Employee-wise attendance summary",
    icon: Users,
  },
};


function Reports() {
  const [reportType, setReportType] =
    useState("attendance");

  const [dateRange, setDateRange] =
    useState({
      from: new Date("2026-08-01"),
      to: new Date("2026-08-10"),
    });


  const fromDate =
    dateRange.from
      ?.toISOString()
      .split("T")[0];

  const toDate =
    dateRange.to
      ?.toISOString()
      .split("T")[0];


  const {
    data: report,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "report",
      reportType,
      fromDate,
      toDate,
    ],

    queryFn: async () => {
      if (reportType === "attendance") {
        return getAttendanceReport(
          fromDate,
          toDate
        );
      }

      if (reportType === "productivity") {
        return getProductivityReport(
          fromDate,
          toDate
        );
      }

      return getEmployeeReport(
        fromDate,
        toDate
      );
    },

    enabled: false,
  });


  const downloadFile = (
    blob,
    filename
  ) => {
    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };


  const handleExcelExport = async () => {
    let blob;
    let filename;

    if (reportType === "attendance") {
      blob =
        await downloadAttendanceExcel(
          fromDate,
          toDate
        );

      filename =
        "attendance_report.xlsx";

    } else if (
      reportType === "productivity"
    ) {
      blob =
        await downloadProductivityExcel(
          fromDate,
          toDate
        );

      filename =
        "productivity_report.xlsx";

    } else {
      blob =
        await downloadEmployeeExcel(
          fromDate,
          toDate
        );

      filename =
        "employee_report.xlsx";
    }

    downloadFile(
      blob,
      filename
    );
  };


  const handlePdfExport = async () => {
    let blob;
    let filename;

    if (reportType === "attendance") {
      blob =
        await downloadAttendancePdf(
          fromDate,
          toDate
        );

      filename =
        "attendance_report.pdf";

    } else if (
      reportType === "productivity"
    ) {
      blob =
        await downloadProductivityPdf(
          fromDate,
          toDate
        );

      filename =
        "productivity_report.pdf";

    } else {
      blob =
        await downloadEmployeePdf(
          fromDate,
          toDate
        );

      filename =
        "employee_report.pdf";
    }

    downloadFile(
      blob,
      filename
    );
  };


  const selectedReport =
    REPORT_TYPES[reportType];

  const SelectedReportIcon =
    selectedReport.icon;


  return (
    <div className="space-y-6">


      <div className="flex items-center gap-3">

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">

          <FileBarChart className="size-5 text-primary" />

        </div>


        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            Reports
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Generate and export reports for the selected period.
          </p>

        </div>

      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Report Type
                </p>

                <p className="mt-1 font-semibold">
                  {selectedReport.label}
                </p>

              </div>


              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">

                <SelectedReportIcon className="size-5 text-blue-500" />

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  From
                </p>

                <p className="mt-1 font-semibold">

                  {dateRange.from
                    ? dateRange.from.toLocaleDateString(
                        undefined,
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "—"}

                </p>

              </div>


              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">

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
                  To
                </p>

                <p className="mt-1 font-semibold">

                  {dateRange.to
                    ? dateRange.to.toLocaleDateString(
                        undefined,
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "—"}

                </p>

              </div>


              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">

                <CalendarDays className="size-5 text-amber-500" />

              </div>

            </div>

          </CardContent>

        </Card>


      </div>


      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <FileBarChart className="size-5 text-primary" />

            Report Configuration

          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Select a reporting period and the type of report you want to generate.
          </p>

        </CardHeader>


        <CardContent className="space-y-6">


          <div className="space-y-2">

            <p className="text-sm font-medium">
              Reporting Period
            </p>


            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">


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

                        {dateRange.from
                          ? dateRange.from.toLocaleDateString(
                              undefined,
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "From date"}

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
                    selected={dateRange.from}
                    onSelect={(date) =>
                      setDateRange(
                        (current) => ({
                          ...current,
                          from: date,
                        })
                      )
                    }
                    disabled={{
                      after: new Date(),
                    }}
                  />

                </PopoverContent>

              </Popover>


              <span className="hidden text-center text-sm text-muted-foreground md:block">
                to
              </span>


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

                        {dateRange.to
                          ? dateRange.to.toLocaleDateString(
                              undefined,
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "To date"}

                      </span>

                    </Button>
                  }
                />


                <PopoverContent
                  align="end"
                  className="w-auto p-0"
                >

                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) =>
                      setDateRange(
                        (current) => ({
                          ...current,
                          to: date,
                        })
                      )
                    }
                    disabled={[
                      {
                        before:
                          dateRange.from,
                      },
                      {
                        after:
                          new Date(),
                      },
                    ]}
                  />

                </PopoverContent>

              </Popover>


            </div>

          </div>


          <div className="space-y-3">

            <div>

              <p className="text-sm font-medium">
                Report Type
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Choose the information you want to analyse.
              </p>

            </div>


            <div className="grid gap-3 md:grid-cols-3">

              {Object.entries(
                REPORT_TYPES
              ).map(
                ([
                  type,
                  config,
                ]) => {

                  const Icon =
                    config.icon;

                  const selected =
                    reportType === type;


                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setReportType(
                          type
                        )
                      }
                      className={`relative flex min-h-[88px] items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/40"
                      }`}
                    >

                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          selected
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >

                        <Icon className="size-4" />

                      </div>


                      <div className="min-w-0">

                        <p className="font-medium">
                          {config.label}
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {config.description}
                        </p>

                      </div>


                      {selected && (

                        <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">

                          <Check className="size-3" />

                        </div>

                      )}

                    </button>
                  );
                }
              )}

            </div>

          </div>


          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">


            <div className="flex items-center gap-3">

              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                <SelectedReportIcon className="size-4 text-primary" />

              </div>


              <div>

                <p className="text-sm font-medium">
                  {selectedReport.label} Report
                </p>

                <p className="text-xs text-muted-foreground">
                  {fromDate} → {toDate}
                </p>

              </div>

            </div>


            <Button
              onClick={() =>
                refetch()
              }
              disabled={isFetching}
              className="!h-10 gap-2 px-4"
            >

              <FileBarChart className="size-4" />

              {isFetching
                ? "Generating..."
                : "Generate Report"}

            </Button>


          </div>


          <div className="flex flex-wrap gap-2 border-t pt-5">


            <Button
              variant="outline"
              disabled={!report || isFetching}
              onClick={
                handleExcelExport
              }
              className="!h-10 gap-2"
            >

              <Download className="size-4" />

              <FileSpreadsheet className="size-4 text-green-600" />

              Export Excel

            </Button>


            <Button
              variant="outline"
              disabled={!report || isFetching}
              onClick={
                handlePdfExport
              }
              className="!h-10 gap-2"
            >

              <Download className="size-4" />

              <FileText className="size-4 text-red-500" />

              Export PDF

            </Button>


          </div>


          <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">

            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">

              <SelectedReportIcon className="size-5 text-primary" />

            </div>


            <div>

              <p className="text-sm text-muted-foreground">
                Selected report
              </p>

              <p className="mt-0.5 text-lg font-semibold">
                {selectedReport.label}
              </p>

            </div>

          </div>


        </CardContent>

      </Card>


      {isError && (

        <Alert variant="destructive">

          <CircleAlert />

          <AlertTitle>
            Failed to generate report
          </AlertTitle>

          <AlertDescription>
            {error?.message ||
              "An unexpected error occurred."}
          </AlertDescription>

        </Alert>

      )}


      {isFetching && (

        <Card>

          <CardHeader>

            <div className="flex items-center gap-3">

              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">

                <FileBarChart className="size-5 text-primary" />

              </div>


              <div className="space-y-2">

                <Skeleton className="h-5 w-40" />

                <Skeleton className="h-4 w-64" />

              </div>

            </div>

          </CardHeader>


          <CardContent className="space-y-4">

            <Skeleton className="h-24 w-full rounded-xl" />

            <Skeleton className="h-24 w-full rounded-xl" />

            <Skeleton className="h-24 w-full rounded-xl" />

          </CardContent>

        </Card>

      )}


      {!isFetching &&
        report &&
        reportType ===
          "attendance" && (

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <ClipboardCheck className="size-5 text-primary" />

                Attendance Report

              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Attendance summary for the selected reporting period.
              </p>

            </CardHeader>


            <CardContent>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                <Card>

                  <CardContent className="p-5">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm font-medium text-muted-foreground">
                          Present
                        </p>

                        <p className="mt-1 text-3xl font-bold">
                          {report.summary?.present ?? 0}
                        </p>

                      </div>


                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">

                        <UserRoundCheck className="size-5 text-green-500" />

                      </div>

                    </div>

                  </CardContent>

                </Card>


                <Card>

                  <CardContent className="p-5">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm font-medium text-muted-foreground">
                          Absent
                        </p>

                        <p className="mt-1 text-3xl font-bold">
                          {report.summary?.absent ?? 0}
                        </p>

                      </div>


                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">

                        <UserRoundX className="size-5 text-red-500" />

                      </div>

                    </div>

                  </CardContent>

                </Card>


                <Card>

                  <CardContent className="p-5">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm font-medium text-muted-foreground">
                          Half Day
                        </p>

                        <p className="mt-1 text-3xl font-bold">
                          {report.summary?.half_day ?? 0}
                        </p>

                      </div>


                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">

                        <Clock3 className="size-5 text-amber-500" />

                      </div>

                    </div>

                  </CardContent>

                </Card>


                <Card>

                  <CardContent className="p-5">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm font-medium text-muted-foreground">
                          Leave
                        </p>

                        <p className="mt-1 text-3xl font-bold">
                          {report.summary?.leave ?? 0}
                        </p>

                      </div>


                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">

                        <CalendarCheck className="size-5 text-violet-500" />

                      </div>

                    </div>

                  </CardContent>

                </Card>


              </div>

            </CardContent>

          </Card>

        )}


      {!isFetching &&
        report &&
        reportType ===
          "productivity" && (

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <TrendingUp className="size-5 text-primary" />

                Productivity Report

              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Task activity and productivity across the selected period.
              </p>

            </CardHeader>


            <CardContent className="space-y-8">


              <div>

                <div className="mb-3 flex items-center gap-2">

                  <Activity className="size-4 text-primary" />

                  <h3 className="text-sm font-medium">
                    Tasks
                  </h3>

                </div>


                <div className="overflow-hidden rounded-xl border">

                  <div className="overflow-x-auto">

                    <Table>

                      <TableHeader>

                        <TableRow>

                          <TableHead>
                            Task
                          </TableHead>

                          <TableHead className="text-right">
                            Total
                          </TableHead>

                        </TableRow>

                      </TableHeader>


                      <TableBody>

                        {(report.tasks ?? [])
                          .length === 0 ? (

                          <TableRow>

                            <TableCell
                              colSpan={2}
                              className="h-24 text-center text-muted-foreground"
                            >
                              No productivity data for this period.
                            </TableCell>

                          </TableRow>

                        ) : (

                          report.tasks.map(
                            (item) => (

                              <TableRow
                                key={
                                  item.task
                                }
                              >

                                <TableCell className="font-medium">
                                  {item.task}
                                </TableCell>

                                <TableCell className="text-right font-semibold">
                                  {item.total}
                                </TableCell>

                              </TableRow>

                            )
                          )

                        )}

                      </TableBody>

                    </Table>

                  </div>

                </div>

              </div>


              <div>

                <div className="mb-3 flex items-center gap-2">

                  <BarChart3 className="size-4 text-primary" />

                  <h3 className="text-sm font-medium">
                    Activity Timeline
                  </h3>

                </div>


                <div className="overflow-hidden rounded-xl border">

                  <div className="overflow-x-auto">

                    <Table>

                      <TableHeader>

                        <TableRow>

                          <TableHead>
                            Date
                          </TableHead>

                          <TableHead className="text-right">
                            Total
                          </TableHead>

                        </TableRow>

                      </TableHeader>


                      <TableBody>

                        {(report.timeline ?? [])
                          .length === 0 ? (

                          <TableRow>

                            <TableCell
                              colSpan={2}
                              className="h-24 text-center text-muted-foreground"
                            >
                              No activity recorded for this period.
                            </TableCell>

                          </TableRow>

                        ) : (

                          report.timeline.map(
                            (item) => (

                              <TableRow
                                key={
                                  item.date
                                }
                              >

                                <TableCell className="font-medium">
                                  {item.date}
                                </TableCell>

                                <TableCell className="text-right font-semibold">
                                  {item.total}
                                </TableCell>

                              </TableRow>

                            )
                          )

                        )}

                      </TableBody>

                    </Table>

                  </div>

                </div>

              </div>


            </CardContent>

          </Card>

        )}


      {!isFetching &&
        report &&
        reportType ===
          "employees" && (

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <Users className="size-5 text-primary" />

                Employee Report

              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Attendance breakdown by employee for the selected period.
              </p>

            </CardHeader>


            <CardContent>

              <div className="overflow-hidden rounded-xl border">

                <div className="overflow-x-auto">

                  <Table>

                    <TableHeader>

                      <TableRow>

                        <TableHead>
                          Employee
                        </TableHead>

                        <TableHead>
                          Code
                        </TableHead>

                        <TableHead>
                          Designation
                        </TableHead>

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

                      {(report.employees ?? [])
                        .length === 0 ? (

                        <TableRow>

                          <TableCell
                            colSpan={7}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No employee data for this period.
                          </TableCell>

                        </TableRow>

                      ) : (

                        report.employees.map(
                          (employee) => (

                            <TableRow
                              key={
                                employee.employee_code
                              }
                            >

                              <TableCell>

                                <div className="flex items-center gap-3">

                                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">

                                    {employee.full_name
                                      ?.split(" ")
                                      .filter(Boolean)
                                      .slice(0, 2)
                                      .map(
                                        (part) =>
                                          part[0]
                                      )
                                      .join("")
                                      .toUpperCase()}

                                  </div>


                                  <span className="font-medium">
                                    {employee.full_name}
                                  </span>

                                </div>

                              </TableCell>


                              <TableCell>
                                {employee.employee_code}
                              </TableCell>


                              <TableCell>
                                {employee.designation}
                              </TableCell>


                              <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                                {employee.present}
                              </TableCell>


                              <TableCell className="text-right font-medium text-red-600 dark:text-red-400">
                                {employee.absent}
                              </TableCell>


                              <TableCell className="text-right font-medium text-amber-600 dark:text-amber-400">
                                {employee.half_day}
                              </TableCell>


                              <TableCell className="text-right font-medium text-violet-600 dark:text-violet-400">
                                {employee.leave}
                              </TableCell>

                            </TableRow>

                          )
                        )

                      )}

                    </TableBody>

                  </Table>

                </div>

              </div>

            </CardContent>

          </Card>

        )}

    </div>
  );
}


export default Reports;