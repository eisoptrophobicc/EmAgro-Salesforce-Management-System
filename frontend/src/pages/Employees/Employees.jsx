import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createEmployee,
  getEmployees,
  updateEmployee,
} from "@/api/employees";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

import { Button } from "@/components/ui/button";

import {
  BadgeCheck,
  BriefcaseBusiness,
  CircleAlert,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
} from "lucide-react";


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


function Employees() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    designation: "",
    is_active: true,
  });

  const [submitting, setSubmitting] =
    useState(false);

  const [formError, setFormError] =
    useState(null);


  const {
    data: employees,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });


  const employeeList = employees ?? [];


  const filteredEmployees =
    employeeList.filter((employee) => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return [
        employee.employee_code,
        employee.full_name,
        employee.email,
        employee.phone,
        employee.designation,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });


  const totalEmployees =
    employeeList.length;

  const activeEmployees =
    employeeList.filter(
      (employee) =>
        employee.is_active
    ).length;

  const inactiveEmployees =
    totalEmployees -
    activeEmployees;


  const handleSubmitEmployee = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setFormError(null);

      if (editingEmployee) {
        await updateEmployee(
          editingEmployee.id,
          {
            full_name: form.full_name,
            email: form.email,
            phone: form.phone || null,
            designation: form.designation,
            is_active: form.is_active,
          }
        );
      } else {
        await createEmployee({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone || null,
          designation: form.designation,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      setForm({
        full_name: "",
        email: "",
        phone: "",
        designation: "",
        is_active: true,
      });

      setEditingEmployee(null);
      setOpen(false);
    } catch (error) {
      console.error(
        "Failed to save employee:",
        error
      );

      setFormError(
        error?.response?.data?.detail ||
          "Failed to save employee."
      );
    } finally {
      setSubmitting(false);
    }
  };


  const openCreateDialog = () => {
    setEditingEmployee(null);

    setForm({
      full_name: "",
      email: "",
      phone: "",
      designation: "",
      is_active: true,
    });

    setFormError(null);
    setOpen(true);
  };


  const openEditDialog = (
    employee
  ) => {
    setEditingEmployee(employee);

    setForm({
      full_name: employee.full_name,
      email: employee.email,
      phone: employee.phone || "",
      designation: employee.designation,
      is_active: employee.is_active,
    });

    setFormError(null);
    setOpen(true);
  };


  const employeeDialog = (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger
        render={
          <Button
            onClick={openCreateDialog}
            className="gap-2"
          >
            <UserPlus className="size-4" />
            Add Employee
          </Button>
        }
      />


      <DialogContent className="sm:max-w-[520px]">

        <DialogHeader>

          <div className="flex items-center gap-3">

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">

              {editingEmployee ? (
                <Pencil className="size-5 text-primary" />
              ) : (
                <UserPlus className="size-5 text-primary" />
              )}

            </div>

            <div>

              <DialogTitle>
                {editingEmployee
                  ? "Edit Employee"
                  : "Add Employee"}
              </DialogTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {editingEmployee
                  ? "Update employee information and status."
                  : "Add a new employee to your workforce."}
              </p>

            </div>

          </div>

        </DialogHeader>


        <form
          onSubmit={handleSubmitEmployee}
          className="mt-4 space-y-5"
        >

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="space-y-2 sm:col-span-2">

              <Label htmlFor="full_name">
                Full Name
              </Label>

              <div className="relative">

                <Users className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="full_name"
                  className="pl-9"
                  value={form.full_name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      full_name:
                        event.target.value,
                    }))
                  }
                  required
                />

              </div>

            </div>


            <div className="space-y-2">

              <Label htmlFor="email">
                Email
              </Label>

              <div className="relative">

                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email:
                        event.target.value,
                    }))
                  }
                  required
                />

              </div>

            </div>


            <div className="space-y-2">

              <Label htmlFor="phone">
                Phone
              </Label>

              <div className="relative">

                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="phone"
                  className="pl-9"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone:
                        event.target.value,
                    }))
                  }
                />

              </div>

            </div>


            <div className="space-y-2 sm:col-span-2">

              <Label htmlFor="designation">
                Designation
              </Label>

              <div className="relative">

                <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="designation"
                  className="pl-9"
                  value={form.designation}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      designation:
                        event.target.value,
                    }))
                  }
                  required
                />

              </div>

            </div>

          </div>


          {editingEmployee && (
            <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">

              <div className="flex items-center gap-3">

                <div
                  className={`flex size-10 items-center justify-center rounded-lg ${
                    form.is_active
                      ? "bg-green-500/10"
                      : "bg-red-500/10"
                  }`}
                >

                  {form.is_active ? (
                    <UserCheck className="size-5 text-green-500" />
                  ) : (
                    <UserX className="size-5 text-red-500" />
                  )}

                </div>

                <div>

                  <Label htmlFor="is_active">
                    Employee Status
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    {form.is_active
                      ? "Employee is active"
                      : "Employee is inactive"}
                  </p>

                </div>

              </div>


              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    is_active: checked,
                  }))
                }
              />

            </div>
          )}


          {formError && (
            <Alert variant="destructive">

              <CircleAlert />

              <AlertTitle>
                Unable to save employee
              </AlertTitle>

              <AlertDescription>
                {formError}
              </AlertDescription>

            </Alert>
          )}


          <div className="flex gap-3">

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>


            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={submitting}
            >

              {editingEmployee ? (
                <Pencil className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}

              {submitting
                ? editingEmployee
                  ? "Saving..."
                  : "Creating..."
                : editingEmployee
                  ? "Save Changes"
                  : "Create Employee"}

            </Button>

          </div>

        </form>

      </DialogContent>

    </Dialog>
  );


  if (isLoading) {
    return (
      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <div className="space-y-2">

            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-4 w-72" />

          </div>

          <Skeleton className="h-10 w-36" />

        </div>


        <div className="grid gap-4 md:grid-cols-3">

          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />

        </div>


        <Card>

          <CardContent className="pt-6">

            <Skeleton className="h-12 w-full" />

            <div className="mt-5 space-y-3">

              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />

            </div>

          </CardContent>

        </Card>

      </div>
    );
  }


  if (isError) {
    return (
      <div className="space-y-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">

              <Users className="size-5 text-primary" />

            </div>

            <div>

              <h1 className="text-3xl font-bold tracking-tight">
                Employees
              </h1>

              <p className="text-muted-foreground">
                Manage employees under your organization.
              </p>

            </div>

          </div>

          {employeeDialog}

        </div>


        <Alert variant="destructive">

          <CircleAlert />

          <AlertTitle>
            Something went wrong
          </AlertTitle>

          <AlertDescription>
            Unable to load employees.
          </AlertDescription>

        </Alert>


        <Button
          onClick={() => refetch()}
          className="gap-2"
        >
          <Users className="size-4" />
          Try Again
        </Button>

      </div>
    );
  }


  return (
    <div className="space-y-6">


      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">

            <Users className="size-5 text-primary" />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Employees
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage employees under your organization.
            </p>

          </div>

        </div>


        {employeeDialog}

      </div>


      <div className="grid gap-4 md:grid-cols-3">


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Employees
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {totalEmployees}
                </p>

              </div>


              <div className="flex size-11 items-center justify-center rounded-xl bg-slate-500/10">

                <Users className="size-5 text-slate-500" />

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Active Employees
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {activeEmployees}
                </p>

              </div>


              <div className="flex size-11 items-center justify-center rounded-xl bg-green-500/10">

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
                  Inactive Employees
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {inactiveEmployees}
                </p>

              </div>


              <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/10">

                <UserX className="size-5 text-red-500" />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <CardTitle className="flex items-center gap-2">

                <BadgeCheck className="size-5 text-primary" />

                Employee Directory

              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {filteredEmployees.length} of{" "}
                {totalEmployees} employees shown
              </p>

            </div>


            <div className="relative w-full md:max-w-sm">

              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search employees..."
                className="pl-9 pr-9"
              />


              {search && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
                  onClick={() =>
                    setSearch("")
                  }
                >

                  <X className="size-4" />

                </Button>
              )}

            </div>

          </div>

        </CardHeader>


        <CardContent>

          {filteredEmployees.length === 0 ? (

            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">

              <div className="flex size-14 items-center justify-center rounded-full bg-muted">

                {search ? (
                  <Search className="size-6 text-muted-foreground" />
                ) : (
                  <Users className="size-6 text-muted-foreground" />
                )}

              </div>

              <p className="mt-4 font-medium">
                {search
                  ? "No employees found"
                  : "No employees yet"}
              </p>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {search
                  ? "Try a different name, employee code, email or designation."
                  : "Add your first employee to start managing your workforce."}
              </p>


              {!search && (
                <Button
                  className="mt-5 gap-2"
                  onClick={openCreateDialog}
                >
                  <UserPlus className="size-4" />
                  Add Employee
                </Button>
              )}

            </div>

          ) : (

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
                      Contact
                    </TableHead>

                    <TableHead>
                      Designation
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead className="w-[70px]">
                      <span className="sr-only">
                        Actions
                      </span>
                    </TableHead>

                  </TableRow>

                </TableHeader>


                <TableBody>

                  {filteredEmployees.map(
                    (employee) => (
                      <TableRow
                        key={
                          employee.employee_code
                        }
                        className="group"
                      >

                        <TableCell>

                          <div className="flex items-center gap-3">

                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">

                              {getInitials(
                                employee.full_name
                              )}

                            </div>

                            <div className="min-w-0">

                              <p className="font-medium">
                                {employee.full_name}
                              </p>

                              <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                                {employee.email}
                              </p>

                            </div>

                          </div>

                        </TableCell>


                        <TableCell>

                          <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-medium">

                            {employee.employee_code}

                          </span>

                        </TableCell>


                        <TableCell>

                          <div className="space-y-1">

                            <div className="flex items-center gap-2 text-sm">

                              <Mail className="size-3.5 shrink-0 text-muted-foreground" />

                              <span className="max-w-[220px] truncate">
                                {employee.email}
                              </span>

                            </div>


                            {employee.phone && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">

                                <Phone className="size-3.5 shrink-0" />

                                {employee.phone}

                              </div>
                            )}

                          </div>

                        </TableCell>


                        <TableCell>

                          <div className="flex items-center gap-2">

                            <BriefcaseBusiness className="size-4 text-muted-foreground" />

                            <span>
                              {employee.designation}
                            </span>

                          </div>

                        </TableCell>


                        <TableCell>

                          {employee.is_active ? (

                            <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400">

                              <span className="size-1.5 rounded-full bg-green-500" />

                              Active

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400">

                              <span className="size-1.5 rounded-full bg-red-500" />

                              Inactive

                            </span>

                          )}

                        </TableCell>


                        <TableCell>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-60 transition-opacity group-hover:opacity-100"
                            onClick={() =>
                              openEditDialog(
                                employee
                              )
                            }
                            aria-label={`Edit ${employee.full_name}`}
                            title={`Edit ${employee.full_name}`}
                          >

                            <Pencil className="size-4" />

                          </Button>

                        </TableCell>

                      </TableRow>
                    )
                  )}

                </TableBody>

              </Table>

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  );
}


export default Employees;