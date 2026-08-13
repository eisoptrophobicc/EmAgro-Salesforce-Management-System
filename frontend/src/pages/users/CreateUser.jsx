import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { createUser, getRoles } from "@/api/users";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  ArrowLeft,
  Check,
  CircleAlert,
  ShieldCheck,
  UserPlus,
} from "lucide-react";


const emptyForm = {
  full_name: "",
  email: "",
  password: "",
  role_id: "",
};

const PASSWORD_REQUIREMENTS = [
  {
    label: "At least 8 characters",
    test: (value) => value.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    label: "One lowercase letter",
    test: (value) => /[a-z]/.test(value),
  },
  {
    label: "One number",
    test: (value) => /\d/.test(value),
  },
];


const getErrorMessage = (
  err,
  fallback
) => {
  const detail =
    err?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg)
      .join(" ");
  }

  return (
    detail ||
    err?.response?.data?.message ||
    fallback
  );
};


function PasswordRequirements({
  value = "",
}) {
  return (
    <ul className="grid gap-1 text-xs sm:grid-cols-2">
      {PASSWORD_REQUIREMENTS.map(
        (requirement) => {
          const isMet =
            requirement.test(value);

          return (
            <li
              key={requirement.label}
              className={
                isMet
                  ? "flex items-center gap-1.5 text-green-600 dark:text-green-400"
                  : "flex items-center gap-1.5 text-muted-foreground"
              }
            >
              <Check
                className={
                  isMet
                    ? "size-3"
                    : "size-3 opacity-35"
                }
              />
              {requirement.label}
            </li>
          );
        }
      )}
    </ul>
  );
}


function CreateUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] =
    useState(emptyForm);
  const [error, setError] =
    useState(null);

  const {
    data: roles,
    isLoading: rolesLoading,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const mutation = useMutation({
    mutationFn: () =>
      createUser({
        full_name:
          form.full_name.trim(),
        email: form.email.trim(),
        role_id: Number(form.role_id),
        password: form.password,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-dashboard-users"],
      });

      navigate("/users");
    },
    onError: (err) => {
      setError(
        getErrorMessage(
          err,
          "Unable to create account."
        )
      );
    },
  });

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.role_id ||
      !form.password
    ) {
      setError(
        "Name, email, role and password are required."
      );
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="size-4" />
            Admin
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Create Account
          </h1>
        </div>

        <Button
          render={<Link to="/users" />}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Accounts
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>
            Unable to create account
          </AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full Name
              </Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(event) =>
                  handleChange(
                    "full_name",
                    event.target.value
                  )
                }
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
                  handleChange(
                    "email",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_id">
                Role
              </Label>
              <select
                id="role_id"
                value={form.role_id}
                onChange={(event) =>
                  handleChange(
                    "role_id",
                    event.target.value
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={rolesLoading}
              >
                <option value="">
                  Select role
                </option>
                {(roles ?? []).map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  handleChange(
                    "password",
                    event.target.value
                  )
                }
              />
              <PasswordRequirements
                value={form.password}
              />
            </div>

            <div className="flex justify-end gap-2 border-t pt-5">
              <Button
                type="button"
                variant="outline"
                render={<Link to="/users" />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="gap-2"
              >
                <Check className="size-4" />
                {mutation.isPending
                  ? "Creating..."
                  : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


export default CreateUser;
