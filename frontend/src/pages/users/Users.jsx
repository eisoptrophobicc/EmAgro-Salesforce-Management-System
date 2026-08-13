import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createUser,
  getRoles,
  getUsers,
  resetUserPassword,
  updateUser,
  updateUserStatus,
} from "@/api/users";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  Check,
  CircleAlert,
  KeyRound,
  Pencil,
  RotateCcw,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users as UsersIcon,
  UserX,
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


function Users() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingUser, setEditingUser] = useState(null);
  const [resetPasswordFor, setResetPasswordFor] =
    useState(null);
  const [resetPassword, setResetPassword] =
    useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const {
    data: roles,
    isLoading: rolesLoading,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "users",
      search,
    ],
    queryFn: () =>
      getUsers({
        page: 1,
        page_size: 50,
        search: search || undefined,
        sort_by: "full_name",
        order: "asc",
      }),
  });

  const invalidateUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["users"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["admin-dashboard"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["admin-dashboard-users"],
    });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        role_id: Number(form.role_id),
      };

      if (editingUser) {
        return updateUser(editingUser.id, payload);
      }

      return createUser({
        ...payload,
        password: form.password,
      });
    },
    onSuccess: async () => {
      await invalidateUsers();
      setForm(emptyForm);
      setEditingUser(null);
      setMessage(
        editingUser
          ? "Account updated successfully."
          : "Account created successfully."
      );
      setError(null);
    },
    onError: (err) => {
      setError(
        getErrorMessage(
          err,
          "Unable to save account."
        )
      );
      setMessage(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, isActive }) =>
      updateUserStatus(userId, isActive),
    onSuccess: async () => {
      await invalidateUsers();
      setMessage("Account status updated.");
      setError(null);
    },
    onError: (err) => {
      setError(
        getErrorMessage(
          err,
          "Unable to update account status."
        )
      );
      setMessage(null);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: () =>
      resetUserPassword(
        resetPasswordFor.id,
        resetPassword
      ),
    onSuccess: async () => {
      await invalidateUsers();
      setResetPasswordFor(null);
      setResetPassword("");
      setMessage("Password reset successfully.");
      setError(null);
    },
    onError: (err) => {
      setError(
        getErrorMessage(
          err,
          "Unable to reset password."
        )
      );
      setMessage(null);
    },
  });

  const handleFormChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError(null);
    setMessage(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setResetPasswordFor(null);
    setForm({
      full_name: user.full_name,
      email: user.email,
      password: "",
      role_id: String(
        (roles ?? []).find(
          (role) =>
            role.name === user.role
        )?.id ?? ""
      ),
    });
    setError(null);
    setMessage(null);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleSave = () => {
    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.role_id
    ) {
      setError("Name, email and role are required.");
      return;
    }

    if (!editingUser && !form.password) {
      setError("Password is required.");
      return;
    }

    saveMutation.mutate();
  };

  const users = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="size-4" />
            Admin
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Account Management
          </h1>
        </div>

        <Button
          render={<Link to="/users/create" />}
          className="gap-2"
        >
          <UserPlus className="size-4" />
          Create Account
        </Button>
      </div>

      {message && (
        <Alert>
          <Check />
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Action failed</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              {editingUser
                ? "Edit Account"
                : "Create Account"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full Name
              </Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(event) =>
                  handleFormChange(
                    "full_name",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  handleFormChange(
                    "email",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_id">Role</Label>
              <select
                id="role_id"
                value={form.role_id}
                onChange={(event) =>
                  handleFormChange(
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
                {(roles ?? [])
                  .map((role) => (
                    <option
                      key={role.id}
                      value={role.id}
                    >
                      {role.name}
                    </option>
                  ))}
              </select>
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    handleFormChange(
                      "password",
                      event.target.value
                    )
                  }
                />
                <PasswordRequirements
                  value={form.password}
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="gap-2"
              >
                <Check className="size-4" />
                {saveMutation.isPending
                  ? "Saving..."
                  : editingUser
                    ? "Update"
                    : "Create"}
              </Button>
              {editingUser && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="size-5 text-primary" />
                Accounts
              </CardTitle>
              <div className="relative md:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search accounts"
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ||
            rolesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : isError ? (
              <Alert variant="destructive">
                <CircleAlert />
                <AlertTitle>
                  Unable to load accounts
                </AlertTitle>
                <AlertDescription>
                  Failed to load users.
                </AlertDescription>
              </Alert>
            ) : users.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                <UsersIcon className="size-6 text-muted-foreground" />
                <p className="mt-3 font-medium">
                  No accounts found
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-xl border p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">
                            {user.full_name}
                          </p>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
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
                        <p className="mt-1 text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            handleEdit(user)
                          }
                        >
                          <Pencil className="size-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            setResetPasswordFor(user);
                            setResetPassword("");
                            setEditingUser(null);
                          }}
                        >
                          <KeyRound className="size-4" />
                          Reset
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            statusMutation.mutate({
                              userId: user.id,
                              isActive:
                                !user.is_active,
                            })
                          }
                        >
                          {user.is_active ? (
                            <UserX className="size-4" />
                          ) : (
                            <UserCheck className="size-4" />
                          )}
                          {user.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {resetPasswordFor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="size-5 text-primary" />
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="reset-password">
                {resetPasswordFor.full_name}
              </Label>
              <Input
                id="reset-password"
                type="password"
                value={resetPassword}
                onChange={(event) =>
                  setResetPassword(
                    event.target.value
                  )
                }
              />
              <PasswordRequirements
                value={resetPassword}
              />
            </div>
            <Button
              onClick={() => {
                if (!resetPassword) {
                  setError(
                    "New password is required."
                  );
                  return;
                }

                passwordMutation.mutate();
              }}
              disabled={passwordMutation.isPending}
              className="gap-2"
            >
              <KeyRound className="size-4" />
              {passwordMutation.isPending
                ? "Resetting..."
                : "Reset Password"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setResetPasswordFor(null);
                setResetPassword("");
              }}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export default Users;
