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

import { CircleAlert, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";


function Employees() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    designation: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);


  const {
    data: employees,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });


  const handleSubmitEmployee = async (event) => {
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
      console.error("Failed to save employee:", error);

      setFormError(
        error?.response?.data?.detail ||
          "Failed to save employee."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const employeeDialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            onClick={() => {
              setEditingEmployee(null);

              setForm({
                full_name: "",
                email: "",
                phone: "",
                designation: "",
                is_active: true,
              });

              setFormError(null);
            }}
          >
            Add Employee
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingEmployee ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmitEmployee}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="full_name">
              Full Name
            </Label>

            <Input
              id="full_name"
              value={form.full_name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  full_name: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone
            </Label>

            <Input
              id="phone"
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">
              Designation
            </Label>

            <Input
              id="designation"
              value={form.designation}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  designation: event.target.value,
                }))
              }
              required
            />
          </div>

          {editingEmployee && (
            <div className="flex items-center justify-between rounded-lg border p-3">
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
            <p className="text-sm text-destructive">
              {formError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting
              ? editingEmployee
                ? "Saving..."
                : "Creating..."
              : editingEmployee
                ? "Save Changes"
                : "Create Employee"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );


  if (isLoading) {
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
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }


  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Employees
            </h1>

            <p className="text-muted-foreground">
              Manage employees under your organization.
            </p>
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

        <Button onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employees
          </h1>

          <p className="text-muted-foreground">
            Manage employees under your organization.
          </p>
        </div>

        {employeeDialog}
      </div>


      <Card>
        <CardHeader>
          <CardTitle>
            Employee Directory
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Employee Code
                  </TableHead>

                  <TableHead>
                    Name
                  </TableHead>

                  <TableHead>
                    Email
                  </TableHead>

                  <TableHead>
                    Phone
                  </TableHead>

                  <TableHead>
                    Designation
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(employees ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.employee_code}>
                      <TableCell className="font-medium">
                        {employee.employee_code}
                      </TableCell>

                      <TableCell>
                        <div className="group flex items-center gap-2">
                          <span>{employee.full_name}</span>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => {
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
                            }}
                            aria-label={`Edit ${employee.full_name}`}
                            title={`Edit ${employee.full_name}`}
                          >
                            <Pencil />
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell>
                        {employee.email}
                      </TableCell>

                      <TableCell>
                        {employee.phone || "—"}
                      </TableCell>

                      <TableCell>
                        {employee.designation}
                      </TableCell>

                      <TableCell>
                        {employee.is_active
                          ? "Active"
                          : "Inactive"}
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


export default Employees;