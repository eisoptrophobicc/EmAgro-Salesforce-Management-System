import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "@/api/dashboardApi";
import { getUsers } from "@/api/users";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  Activity,
  CalendarCheck,
  CircleAlert,
  ClipboardList,
  ShieldCheck,
  TableProperties,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";


const StatCard = ({
  title,
  value,
  icon: Icon,
  className,
}) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-center justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-3xl font-bold">
            {value}
          </p>
        </div>


        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${className}`}
        >
          <Icon className="size-5" />
        </div>

      </div>
    </CardContent>
  </Card>
);


function AdminDashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });


  const {
    data: users,
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ["admin-dashboard-users"],
    queryFn: () =>
      getUsers({
        page: 1,
        page_size: 5,
        sort_by: "id",
        order: "desc",
      }),
  });


  const stats = data?.users ?? {
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    sub_admins: 0,
  };


  const operations = data?.operations ?? {
    employees: 0,
    active_employees: 0,
    tasks: 0,
    attendance_records: 0,
    daily_activities: 0,
  };


  const subAdmins =
    data?.sub_admins ?? [];


  const activePercent =
    stats.total > 0
      ? Math.round(
          (stats.active / stats.total) * 100
        )
      : 0;


  if (isLoading) {
    return (
      <div className="space-y-6">

        <Skeleton className="h-24 w-full" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />

        </div>

      </div>
    );
  }


  if (isError) {
    return (
      <Alert variant="destructive">

        <CircleAlert />

        <AlertTitle>
          Unable to load admin dashboard
        </AlertTitle>

        <AlertDescription>
          {error?.response?.data?.detail ||
            "Failed to load dashboard data."}
        </AlertDescription>

      </Alert>
    );
  }


  return (
    <div className="space-y-6">


      {/* Header */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>

          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">

            <ShieldCheck className="size-4" />

            Admin Dashboard

          </div>


          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Account Control
          </h1>

        </div>


        <Link
          to="/users/create"
          className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >

          <UserPlus className="size-4" />

          Add Sub Admin

        </Link>

      </div>


      {/* Account Statistics */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Accounts"
          value={stats.total}
          icon={Users}
          className="bg-slate-500/10 text-slate-600 dark:text-slate-400"
        />

        <StatCard
          title="Sub Admins"
          value={stats.sub_admins}
          icon={UserCog}
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Active"
          value={stats.active}
          icon={UserCheck}
          className="bg-green-500/10 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Inactive"
          value={stats.inactive}
          icon={UserX}
          className="bg-red-500/10 text-red-600 dark:text-red-400"
        />

      </div>


      {/* Operational Statistics */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Employees"
          value={operations.employees}
          icon={Users}
          className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
        />

        <StatCard
          title="Tasks"
          value={operations.tasks}
          icon={ClipboardList}
          className="bg-violet-500/10 text-violet-600 dark:text-violet-400"
        />

        <StatCard
          title="Attendance Records"
          value={operations.attendance_records}
          icon={CalendarCheck}
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Daily Activities"
          value={operations.daily_activities}
          icon={Activity}
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

      </div>


      {/* Account Health + Recent Accounts */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">


        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Activity className="size-5 text-primary" />

              Account Health

            </CardTitle>

          </CardHeader>


          <CardContent className="space-y-5">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Active account ratio
                </p>

                <p className="mt-1 text-4xl font-semibold">
                  {activePercent}%
                </p>

              </div>


              <p className="text-sm text-muted-foreground">
                {stats.active} of {stats.total}
              </p>

            </div>


            <div className="h-3 overflow-hidden rounded-full bg-muted">

              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${activePercent}%`,
                }}
              />

            </div>


            <div className="grid gap-3 sm:grid-cols-2">

              <div className="rounded-lg border p-4">

                <p className="text-sm text-muted-foreground">
                  Admins
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {stats.admins}
                </p>

              </div>


              <div className="rounded-lg border p-4">

                <p className="text-sm text-muted-foreground">
                  Sub Admins
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {stats.sub_admins}
                </p>

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Users className="size-5 text-primary" />

              Recent Accounts

            </CardTitle>

          </CardHeader>


          <CardContent>

            {usersLoading ? (

              <div className="space-y-3">

                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />

              </div>

            ) : (

              <div className="space-y-3">

                {(users?.items ?? []).map(
                  (user) => (

                    <div
                      key={user.id}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium">
                          {user.full_name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>

                      </div>


                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                          user.is_active
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {user.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                  )
                )}


                <Link
                  to="/users"
                  className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Manage Accounts
                </Link>

              </div>

            )}

          </CardContent>

        </Card>

      </div>


      {/* Sub Admin Overview */}

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <TableProperties className="size-5 text-primary" />

            Sub Admin Overview

          </CardTitle>

        </CardHeader>


        <CardContent>

          {subAdmins.length === 0 ? (

            <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">

              <UserCog className="size-6 text-muted-foreground" />

              <p className="mt-3 font-medium">
                No sub-admins yet
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-xl border">

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">

                    <tr>

                      <th className="px-4 py-3 font-medium">
                        Sub Admin
                      </th>

                      <th className="px-4 py-3 text-right font-medium">
                        Employees
                      </th>

                      <th className="px-4 py-3 text-right font-medium">
                        Tasks
                      </th>

                      <th className="px-4 py-3 text-right font-medium">
                        Attendance
                      </th>

                      <th className="px-4 py-3 text-right font-medium">
                        Activities
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Last Activity
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {subAdmins.map(
                      (subAdmin) => (

                        <tr
                          key={subAdmin.id}
                          className="border-t"
                        >

                          <td className="px-4 py-3">

                            <div>

                              <p className="font-medium">
                                {subAdmin.full_name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {subAdmin.email}
                              </p>

                            </div>

                          </td>


                          <td className="px-4 py-3 text-right font-medium">
                            {subAdmin.active_employees}/
                            {subAdmin.employees}
                          </td>


                          <td className="px-4 py-3 text-right font-medium">
                            {subAdmin.tasks}
                          </td>


                          <td className="px-4 py-3 text-right font-medium">
                            {subAdmin.attendance_records}
                          </td>


                          <td className="px-4 py-3 text-right font-medium">
                            {subAdmin.daily_activities}
                          </td>


                          <td className="px-4 py-3 text-muted-foreground">
                            {subAdmin.last_activity_date ??
                              "No activity"}
                          </td>


                          <td className="px-4 py-3">

                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                subAdmin.is_active
                                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400"
                              }`}
                            >
                              {subAdmin.is_active
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </CardContent>

      </Card>


    </div>
  );
}


export default AdminDashboard;