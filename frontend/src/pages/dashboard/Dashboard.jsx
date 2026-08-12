import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getSubAdminDashboard } from "@/api/dashboardApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  Activity,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Clock3,
  Trophy,
  UserCheck,
  Users,
  UserX,
  TrendingUp,
} from "lucide-react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const COLORS = {
  present: "#22c55e",
  absent: "#ef4444",
  halfDay: "#f59e0b",
  leave: "#3b82f6",
  productivity: "#8b5cf6",
};


const getDateString = (date) => {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};


const formatChartDate = (value) => {
  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
};


const formatFullDate = (date) => {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};


const getStableColor = (
  value,
  saturation = 65,
  lightness = 55
) => {
  let hash = 0;

  for (let index = 0; index < value.length; index++) {
    hash =
      value.charCodeAt(index) +
      ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};


const getTaskColor = (taskName) => {
  return getStableColor(
    taskName,
    70,
    55
  );
};


const getEmployeeColor = (
  employeeName,
  index
) => {
  if (index === 0) {
    return "#f59e0b";
  }

  if (index === 1) {
    return "#94a3b8";
  }

  if (index === 2) {
    return "#b45309";
  }

  return getStableColor(
    employeeName,
    60,
    55
  );
};


const EmptyState = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center text-center">

      <div className="flex size-12 items-center justify-center rounded-xl bg-muted">

        <Icon className="size-6 text-muted-foreground" />

      </div>

      <p className="mt-4 font-medium">
        {title}
      </p>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

    </div>
  );
};


function Dashboard() {
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const targetDate =
    getDateString(selectedDate);


  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "sub-admin-dashboard",
      targetDate,
    ],

    queryFn: () =>
      getSubAdminDashboard(targetDate),
  });


  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "sub-admin-dashboard",
        targetDate,
      ],
    });
  };


  if (isLoading) {
    return (
      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>

          <Skeleton className="h-10 w-44" />

        </div>


        <div className="grid gap-4 md:grid-cols-3">

          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />

        </div>


        <div className="grid gap-6 lg:grid-cols-2">

          <Skeleton className="h-[380px]" />
          <Skeleton className="h-[380px]" />

        </div>


        <Skeleton className="h-[400px]" />

      </div>
    );
  }


  if (isError) {
    return (
      <div className="space-y-6">

        <div className="flex items-center gap-3">

          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">

            <Activity className="size-5 text-primary" />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Sub Admin Dashboard
            </h1>

            <p className="text-sm text-muted-foreground">
              Workforce, attendance and productivity overview.
            </p>

          </div>

        </div>


        <Alert variant="destructive">

          <CircleAlert />

          <AlertTitle>
            Unable to load dashboard
          </AlertTitle>

          <AlertDescription>
            Failed to load dashboard data.
          </AlertDescription>

        </Alert>


        <Button
          onClick={handleRetry}
          className="gap-2"
        >
          <Activity className="size-4" />
          Try Again
        </Button>

      </div>
    );
  }


  const employees = data?.employees ?? {
    total: 0,
    active: 0,
    inactive: 0,
  };


  const attendance = data?.attendance ?? {
    present: 0,
    absent: 0,
    half_day: 0,
    leave: 0,
  };


  const attendanceTrend =
    data?.attendance_trend ?? [];


  const productivity =
    data?.productivity ?? [];


  const productivityTrend =
    data?.productivity_trend ?? [];


  const employeeProductivity =
    data?.employee_productivity ?? [];


  const attendanceDistribution = [
    {
      name: "Present",
      value: attendance.present,
      fill: COLORS.present,
    },
    {
      name: "Absent",
      value: attendance.absent,
      fill: COLORS.absent,
    },
    {
      name: "Half Day",
      value: attendance.half_day,
      fill: COLORS.halfDay,
    },
    {
      name: "Leave",
      value: attendance.leave,
      fill: COLORS.leave,
    },
  ].filter(
    (item) => item.value > 0
  );


  const attendanceTrendData =
    attendanceTrend.map((item) => ({
      ...item,
      label: formatChartDate(item.date),
    }));


  const productivityData =
    [...productivity]
      .sort(
        (a, b) =>
          Number(b.total) -
          Number(a.total)
      )
      .map((item) => ({
        ...item,
        fill: getTaskColor(item.task),
      }));


  const productivityTrendData =
    productivityTrend.map((item) => ({
      ...item,
      label: formatChartDate(item.date),
    }));


  const employeeProductivityData =
    [...employeeProductivity]
      .sort(
        (a, b) =>
          Number(b.total) -
          Number(a.total)
      )
      .slice(0, 8)
      .map((item, index) => ({
        ...item,
        fill: getEmployeeColor(
          item.employee,
          index
        ),
      }));


  const attendanceTotal =
    attendance.present +
    attendance.absent +
    attendance.half_day +
    attendance.leave;


  const attendanceRate =
    attendanceTotal > 0
      ? Math.round(
          (attendance.present /
            attendanceTotal) *
            100
        )
      : 0;


  const activeRate =
    employees.total > 0
      ? Math.round(
          (employees.active /
            employees.total) *
            100
        )
      : 0;


  return (
    <div className="space-y-7">


      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">

            <Activity className="size-5 text-primary" />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Sub Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Workforce, attendance and productivity overview.
            </p>

          </div>

        </div>


        <Popover>

          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="gap-2"
              >

                <CalendarDays className="size-4" />

                {formatFullDate(selectedDate)}

              </Button>
            }
          />

          <PopoverContent
            className="w-auto p-0"
            align="end"
          >

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              disabled={{
                after: new Date(),
              }}
            />

          </PopoverContent>

        </Popover>

      </div>


      <div className="grid gap-4 md:grid-cols-3">


        <Card className="overflow-hidden">

          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Employees
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {employees.total}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Employees assigned to you
                </p>

              </div>


              <div className="flex size-11 items-center justify-center rounded-xl bg-slate-500/10">

                <Users className="size-5 text-slate-500" />

              </div>

            </div>

          </CardContent>

        </Card>


        <Card className="overflow-hidden">

          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Active Employees
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {employees.active}
                </p>

                <p className="mt-2 flex items-center gap-1 text-xs text-green-600">

                  <UserCheck className="size-3.5" />

                  {activeRate}% of workforce

                </p>

              </div>


              <div className="flex size-11 items-center justify-center rounded-xl bg-green-500/10">

                <UserCheck className="size-5 text-green-500" />

              </div>

            </div>

          </CardContent>

        </Card>


        <Card className="overflow-hidden">

          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Inactive Employees
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {employees.inactive}
                </p>

                <p className="mt-2 flex items-center gap-1 text-xs text-red-500">

                  <UserX className="size-3.5" />

                  Currently inactive

                </p>

              </div>


              <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/10">

                <UserX className="size-5 text-red-500" />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      <div className="grid gap-6 lg:grid-cols-2">


        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <CalendarCheck className="size-5 text-blue-500" />

              Attendance Distribution

            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Attendance status for{" "}
              {formatFullDate(selectedDate)}.
            </p>

          </CardHeader>


          <CardContent>

            {attendanceDistribution.length === 0 ? (

              <EmptyState
                icon={CalendarCheck}
                title="No attendance recorded"
                description="There is no attendance data for this date."
              />

            ) : (

              <div className="h-[320px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={attendanceDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={72}
                      outerRadius={108}
                      paddingAngle={4}
                    >

                      {attendanceDistribution.map(
                        (item) => (
                          <Cell
                            key={item.name}
                            fill={item.fill}
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip />

                    <Legend
                      verticalAlign="bottom"
                      height={36}
                    />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            )}

          </CardContent>

        </Card>


        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <TrendingUp className="size-5 text-blue-500" />

              Attendance Trend

            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Attendance movement across the last seven days.
            </p>

          </CardHeader>


          <CardContent>

            {attendanceTrendData.length === 0 ? (

              <EmptyState
                icon={TrendingUp}
                title="No trend data"
                description="Attendance history is not available."
              />

            ) : (

              <div className="h-[320px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={attendanceTrendData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: 5,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.35}
                    />

                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="present"
                      name="Present"
                      stroke={COLORS.present}
                      strokeWidth={2.5}
                      dot={{
                        r: 3,
                        fill: COLORS.present,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="absent"
                      name="Absent"
                      stroke={COLORS.absent}
                      strokeWidth={2.5}
                      dot={{
                        r: 3,
                        fill: COLORS.absent,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="half_day"
                      name="Half Day"
                      stroke={COLORS.halfDay}
                      strokeWidth={2.5}
                      dot={{
                        r: 3,
                        fill: COLORS.halfDay,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="leave"
                      name="Leave"
                      stroke={COLORS.leave}
                      strokeWidth={2.5}
                      dot={{
                        r: 3,
                        fill: COLORS.leave,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            )}

          </CardContent>

        </Card>

      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">

                <CheckCircle2 className="size-5 text-green-500" />

              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Present
                </p>

                <p className="text-2xl font-bold">
                  {attendance.present}
                </p>

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">

                <UserX className="size-5 text-red-500" />

              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Absent
                </p>

                <p className="text-2xl font-bold">
                  {attendance.absent}
                </p>

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">

                <Clock3 className="size-5 text-amber-500" />

              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Half Day
                </p>

                <p className="text-2xl font-bold">
                  {attendance.half_day}
                </p>

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">

                <CalendarDays className="size-5 text-blue-500" />

              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Leave
                </p>

                <p className="text-2xl font-bold">
                  {attendance.leave}
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <ClipboardList className="size-5 text-violet-500" />

            Task Performance

          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Recorded output by task for{" "}
            {formatFullDate(selectedDate)}.
          </p>

        </CardHeader>


        <CardContent>

          {productivityData.length === 0 ? (

            <EmptyState
              icon={ClipboardList}
              title="No task output recorded"
              description="No integer-based activity has been recorded for this date."
            />

          ) : (

            <div className="h-[350px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={productivityData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    opacity={0.35}
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="task"
                    width={160}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="total"
                    name="Recorded output"
                    radius={[0, 7, 7, 0]}
                  >

                    {productivityData.map(
                      (item) => (
                        <Cell
                          key={item.task}
                          fill={item.fill}
                        />
                      )
                    )}

                  </Bar>

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </CardContent>

      </Card>


      <div className="grid gap-6 lg:grid-cols-2">


        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <BarChart3 className="size-5 text-violet-500" />

              Productivity Trend

            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Total recorded task output across employees.
            </p>

          </CardHeader>


          <CardContent>

            {productivityTrendData.length === 0 ? (

              <EmptyState
                icon={BarChart3}
                title="No productivity history"
                description="Productivity data is not available."
              />

            ) : (

              <div className="h-[320px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={productivityTrendData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: 5,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.35}
                    />

                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total output"
                      stroke={COLORS.productivity}
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: COLORS.productivity,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            )}

          </CardContent>

        </Card>


        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Trophy className="size-5 text-amber-500" />

              Employee Performance

            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Top employees ranked by recorded task output.
            </p>

          </CardHeader>


          <CardContent>

            {employeeProductivityData.length === 0 ? (

              <EmptyState
                icon={Trophy}
                title="No employee performance data"
                description="No productivity has been recorded."
              />

            ) : (

              <div className="h-[320px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={employeeProductivityData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 15,
                      bottom: 5,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      opacity={0.35}
                    />

                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="employee"
                      width={120}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="total"
                      name="Recorded output"
                      radius={[0, 7, 7, 0]}
                    >

                      {employeeProductivityData.map(
                        (item) => (
                          <Cell
                            key={item.employee}
                            fill={item.fill}
                          />
                        )
                      )}

                    </Bar>

                  </BarChart>

                </ResponsiveContainer>

              </div>

            )}

          </CardContent>

        </Card>

      </div>


      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <Activity className="size-5 text-blue-500" />

            Daily Overview

          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Key workforce indicators for{" "}
            {formatFullDate(selectedDate)}.
          </p>

        </CardHeader>


        <CardContent>

          <div className="grid gap-4 md:grid-cols-2">


            <div className="rounded-xl border bg-green-500/[0.03] p-5">

              <div className="flex items-start justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <CalendarCheck className="size-4 text-green-500" />

                    <p className="font-medium">
                      Attendance Rate
                    </p>

                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Employees marked present
                  </p>

                </div>

                <p className="text-3xl font-bold text-green-500">
                  {attendanceRate}%
                </p>

              </div>


              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">

                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{
                    width: `${attendanceRate}%`,
                  }}
                />

              </div>

            </div>


            <div className="rounded-xl border bg-blue-500/[0.03] p-5">

              <div className="flex items-start justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <Users className="size-4 text-blue-500" />

                    <p className="font-medium">
                      Workforce Availability
                    </p>

                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Active employees in your workforce
                  </p>

                </div>

                <p className="text-3xl font-bold text-blue-500">
                  {activeRate}%
                </p>

              </div>


              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">

                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${activeRate}%`,
                  }}
                />

              </div>

            </div>


          </div>

        </CardContent>

      </Card>


    </div>
  );
}


export default Dashboard;