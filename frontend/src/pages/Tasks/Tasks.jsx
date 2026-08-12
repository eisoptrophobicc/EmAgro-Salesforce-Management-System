import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
} from "@/api/tasks";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Activity,
  Check,
  CircleAlert,
  ClipboardList,
  Hash,
  Pencil,
  Plus,
  Power,
  PowerOff,
  ToggleLeft,
  Type,
  X,
} from "lucide-react";


const INPUT_TYPE_CONFIG = {
  Boolean: {
    icon: ToggleLeft,
    label: "Boolean",
    description: "Yes / No",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },

  Integer: {
    icon: Hash,
    label: "Integer",
    description: "Number",
    className:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },

  Text: {
    icon: Type,
    label: "Text",
    description: "Free text",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};


function Tasks() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] =
    useState(false);

  const [editingTaskId, setEditingTaskId] =
    useState(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [inputType, setInputType] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [success, setSuccess] =
    useState(null);


  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });


  const taskList = tasks ?? [];

  const activeTasks =
    taskList.filter(
      (task) => task.is_active
    ).length;

  const inactiveTasks =
    taskList.length - activeTasks;


  const resetForm = () => {
    setName("");
    setDescription("");
    setInputType("");
    setEditingTaskId(null);
    setShowForm(false);
    setError(null);
  };


  const openCreateForm = () => {
    setName("");
    setDescription("");
    setInputType("");
    setEditingTaskId(null);
    setError(null);
    setSuccess(null);
    setShowForm(true);
  };


  const openEditForm = (task) => {
    setName(task.name);

    setDescription(
      task.description ?? ""
    );

    setInputType(task.input_type);
    setEditingTaskId(task.id);
    setError(null);
    setSuccess(null);
    setShowForm(true);
  };


  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError(
        "Task name is required."
      );
      return;
    }

    if (!inputType) {
      setError(
        "Please select an input type."
      );
      return;
    }

    setSubmitting(true);

    try {
      if (editingTaskId) {
        await updateTask(
          editingTaskId,
          {
            name: name.trim(),
            description:
              description.trim() ||
              null,
            input_type: inputType,
          }
        );

        setSuccess(
          "Task updated successfully."
        );
      } else {
        await createTask({
          name: name.trim(),
          description:
            description.trim() ||
            null,
          input_type: inputType,
        });

        setSuccess(
          "Task created successfully."
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      setName("");
      setDescription("");
      setInputType("");
      setEditingTaskId(null);
      setShowForm(false);

    } catch (err) {
      console.error(
        "Failed to save task:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to save task."
      );

    } finally {
      setSubmitting(false);
    }
  };


  const handleStatusChange = async (
    task
  ) => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await updateTaskStatus(
        task.id,
        !task.is_active
      );

      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      setSuccess(
        task.is_active
          ? "Task deactivated successfully."
          : "Task activated successfully."
      );

    } catch (err) {
      console.error(
        "Failed to update task status:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to update task status."
      );

    } finally {
      setSubmitting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6">

        <div className="flex items-center gap-3">

          <Skeleton className="size-11 rounded-xl" />

          <div className="space-y-2">

            <Skeleton className="h-9 w-32" />

            <Skeleton className="h-4 w-72" />

          </div>

        </div>


        <div className="grid gap-4 sm:grid-cols-3">

          <Skeleton className="h-[108px]" />
          <Skeleton className="h-[108px]" />
          <Skeleton className="h-[108px]" />

        </div>


        <Card>

          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>

          <CardContent className="space-y-4">

            <Skeleton className="h-[104px] w-full" />
            <Skeleton className="h-[104px] w-full" />
            <Skeleton className="h-[104px] w-full" />

          </CardContent>

        </Card>

      </div>
    );
  }


  if (isError) {
    return (
      <div className="space-y-6">

        <div className="flex items-center gap-3">

          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">

            <ClipboardList className="size-5 text-primary" />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Tasks
            </h1>

            <p className="text-muted-foreground">
              Manage employee activities and task definitions.
            </p>

          </div>

        </div>


        <Alert variant="destructive">

          <CircleAlert />

          <AlertTitle>
            Something went wrong
          </AlertTitle>

          <AlertDescription>
            Unable to load tasks.
          </AlertDescription>

        </Alert>

      </div>
    );
  }


  return (
    <div className="space-y-6">


      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">

            <ClipboardList className="size-5 text-primary" />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Tasks
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage employee activities and task definitions.
            </p>

          </div>

        </div>


        {!showForm && (
          <Button
            onClick={openCreateForm}
            className="h-11 gap-2"
          >

            <Plus className="size-4" />

            Add Task

          </Button>
        )}

      </div>


      <div className="grid gap-4 sm:grid-cols-3">


        <Card>

          <CardContent className="flex h-[108px] items-center p-5">

            <div className="flex w-full items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Tasks
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {taskList.length}
                </p>

              </div>


              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-500/10">

                <ClipboardList className="size-5 text-slate-500" />

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="flex h-[108px] items-center p-5">

            <div className="flex w-full items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Active Tasks
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {activeTasks}
                </p>

              </div>


              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10">

                <Power className="size-5 text-green-500" />

              </div>

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardContent className="flex h-[108px] items-center p-5">

            <div className="flex w-full items-center justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Inactive Tasks
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {inactiveTasks}
                </p>

              </div>


              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">

                <PowerOff className="size-5 text-red-500" />

              </div>

            </div>

          </CardContent>

        </Card>


      </div>


      {error && (
        <Alert variant="destructive">

          <CircleAlert />

          <AlertTitle>
            Unable to complete action
          </AlertTitle>

          <AlertDescription>
            {error}
          </AlertDescription>

        </Alert>
      )}


      {success && (
        <Alert>

          <Check />

          <AlertTitle>
            Success
          </AlertTitle>

          <AlertDescription>
            {success}
          </AlertDescription>

        </Alert>
      )}


      {showForm && (
        <Card>

          <CardHeader>

            <div className="flex items-center gap-3">

              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">

                {editingTaskId ? (
                  <Pencil className="size-5 text-primary" />
                ) : (
                  <Plus className="size-5 text-primary" />
                )}

              </div>


              <div>

                <CardTitle>
                  {editingTaskId
                    ? "Edit Task"
                    : "Add Task"}
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  {editingTaskId
                    ? "Update the task definition."
                    : "Create a task that can be assigned to employees."}
                </p>

              </div>

            </div>

          </CardHeader>


          <CardContent className="space-y-5">

            <div className="grid items-start gap-5 md:grid-cols-2">


              <div className="space-y-2">

                <Label htmlFor="task-name">
                  Task Name
                </Label>

                <div className="relative">

                  <ClipboardList className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="task-name"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Production Units"
                    className="h-11 pl-9"
                  />

                </div>

              </div>


              <div className="space-y-2">

                <Label>
                  Input Type
                </Label>

                <Select
                  value={inputType}
                  onValueChange={
                    setInputType
                  }
                >

                  <SelectTrigger className="h-11 w-full">

                    <SelectValue placeholder="Select input type" />

                  </SelectTrigger>


                  <SelectContent className="min-w-[220px]">

                    <SelectItem value="Boolean">

                      <div className="flex w-full items-center gap-2">

                        <ToggleLeft className="size-4 shrink-0 text-blue-500" />

                        <span>
                          Boolean
                        </span>

                        <span className="ml-auto text-xs text-muted-foreground">
                          Yes / No
                        </span>

                      </div>

                    </SelectItem>


                    <SelectItem value="Integer">

                      <div className="flex w-full items-center gap-2">

                        <Hash className="size-4 shrink-0 text-violet-500" />

                        <span>
                          Integer
                        </span>

                        <span className="ml-auto text-xs text-muted-foreground">
                          Number
                        </span>

                      </div>

                    </SelectItem>


                    <SelectItem value="Text">

                      <div className="flex w-full items-center gap-2">

                        <Type className="size-4 shrink-0 text-amber-500" />

                        <span>
                          Text
                        </span>

                        <span className="ml-auto text-xs text-muted-foreground">
                          Free text
                        </span>

                      </div>

                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>


              <div className="space-y-2 md:col-span-2">

                <Label htmlFor="task-description">
                  Description
                </Label>

                <Textarea
                  id="task-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe what this activity measures..."
                  rows={3}
                  className="min-h-[96px] resize-none"
                />

              </div>


            </div>


            <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">

              <Button
                variant="outline"
                onClick={resetForm}
                disabled={submitting}
                className="h-11 gap-2"
              >

                <X className="size-4" />

                Cancel

              </Button>


              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="h-11 gap-2 px-5"
              >

                {editingTaskId ? (
                  <Pencil className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}

                {submitting
                  ? "Saving..."
                  : editingTaskId
                    ? "Update Task"
                    : "Create Task"}

              </Button>

            </div>

          </CardContent>

        </Card>
      )}


      <Card>

        <CardHeader>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <CardTitle className="flex items-center gap-2">

                <Activity className="size-5 text-primary" />

                Task Definitions

              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Tasks available for employee assignment.
              </p>

            </div>


            <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-muted px-3 text-sm font-medium text-muted-foreground">

              {taskList.length}{" "}
              {taskList.length === 1
                ? "task"
                : "tasks"}

            </span>

          </div>

        </CardHeader>


        <CardContent>

          {taskList.length === 0 ? (

            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">

              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted">

                <ClipboardList className="size-6 text-muted-foreground" />

              </div>

              <p className="mt-4 font-medium">
                No tasks yet
              </p>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create your first task to start recording employee activities.
              </p>

              <Button
                className="mt-5 h-11 gap-2"
                onClick={openCreateForm}
              >

                <Plus className="size-4" />

                Add Task

              </Button>

            </div>

          ) : (

            <div className="space-y-4">

              {taskList.map(
                (task) => {

                  const config =
                    INPUT_TYPE_CONFIG[
                      task.input_type
                    ] ?? {
                      icon: Activity,
                      label:
                        task.input_type ||
                        "Task",
                      description: "",
                      className:
                        "bg-muted text-muted-foreground",
                    };


                  const InputIcon =
                    config.icon;


                  return (
                    <div
                      key={task.id}
                      className="min-h-[112px] rounded-xl border p-4 transition-colors hover:bg-muted/30"
                    >

                      <div className="flex min-h-[80px] items-center justify-between gap-4">


                        <div className="flex min-w-0 flex-1 items-start gap-3">

                          <div
                            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                          >

                            <InputIcon className="size-5" />

                          </div>


                          <div className="min-w-0 flex-1">

                            <div className="flex min-h-7 flex-wrap items-center gap-2">

                              <h3 className="font-semibold">
                                {task.name}
                              </h3>


                              {task.is_active ? (

                                <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 text-xs font-medium text-green-600 dark:text-green-400">

                                  <span className="size-1.5 rounded-full bg-green-500" />

                                  Active

                                </span>

                              ) : (

                                <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-muted px-2.5 text-xs font-medium text-muted-foreground">

                                  <span className="size-1.5 rounded-full bg-muted-foreground" />

                                  Inactive

                                </span>

                              )}

                            </div>


                            <p
                              className={`mt-1 line-clamp-2 min-h-5 text-sm text-muted-foreground ${
                                task.description
                                  ? ""
                                  : "invisible"
                              }`}
                            >
                              {task.description ||
                                "No description"}
                            </p>


                            <div className="mt-2 inline-flex h-7 items-center gap-2 rounded-lg bg-muted/60 px-2.5 text-xs font-medium">

                              <InputIcon className="size-3.5 shrink-0" />

                              <span>
                                {config.label}
                              </span>

                              {config.description && (
                                <>
                                  <span className="text-muted-foreground">
                                    ·
                                  </span>

                                  <span className="text-muted-foreground">
                                    {config.description}
                                  </span>
                                </>
                              )}

                            </div>

                          </div>

                        </div>


                        <div className="flex shrink-0 gap-2">

                          <Button
                            variant="outline"
                            size="icon"
                            className="size-10"
                            onClick={() =>
                              openEditForm(
                                task
                              )
                            }
                            title="Edit task"
                            aria-label={`Edit ${task.name}`}
                          >

                            <Pencil className="size-4" />

                          </Button>


                          <Button
                            variant={
                              task.is_active
                                ? "outline"
                                : "default"
                            }
                            size="icon"
                            className="size-10"
                            disabled={
                              submitting
                            }
                            onClick={() =>
                              handleStatusChange(
                                task
                              )
                            }
                            title={
                              task.is_active
                                ? "Deactivate task"
                                : "Activate task"
                            }
                            aria-label={
                              task.is_active
                                ? `Deactivate ${task.name}`
                                : `Activate ${task.name}`
                            }
                          >

                            {task.is_active ? (
                              <PowerOff className="size-4" />
                            ) : (
                              <Power className="size-4" />
                            )}

                          </Button>

                        </div>


                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  );
}


export default Tasks;