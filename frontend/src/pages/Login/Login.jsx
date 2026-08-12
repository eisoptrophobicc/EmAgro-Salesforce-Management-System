import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { login as loginRequest } from "@/api/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CircleAlert,
  ClipboardCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Users,
} from "lucide-react";


const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required."),
});


const FEATURES = [
  {
    title: "Employees",
    description: "Workforce management",
    icon: Users,
  },
  {
    title: "Attendance",
    description: "Daily tracking",
    icon: ClipboardCheck,
  },
  {
    title: "Activities",
    description: "Daily productivity",
    icon: Activity,
  },
  {
    title: "Reports",
    description: "Actionable insights",
    icon: BarChart3,
  },
];


function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");


  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });


  const onSubmit = async (data) => {
    setSubmitError("");

    try {
      const response =
        await loginRequest(
          data.email,
          data.password
        );

      login(response.access_token);

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      setSubmitError(
        error?.response?.data?.detail ||
          "Invalid email or password. Please try again."
      );
    }
  };


  return (
    <div className="min-h-svh bg-muted/40 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto flex min-h-[calc(100svh-2rem)] max-w-6xl items-center">

        <div className="grid w-full overflow-hidden rounded-2xl border bg-background shadow-sm lg:min-h-[680px] lg:grid-cols-2">


          <section className="relative overflow-hidden bg-foreground text-background">

            <div className="absolute -right-32 -top-32 size-80 rounded-full bg-background/[0.04]" />

            <div className="absolute -bottom-40 -left-32 size-96 rounded-full bg-background/[0.03]" />


            <div className="relative flex h-full flex-col p-7 sm:p-10 lg:p-12">


              <div className="flex items-center gap-3">

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/10 ring-1 ring-background/10">

                  <Building2 className="size-5" />

                </div>


                <div>

                  <p className="text-sm font-semibold tracking-tight">
                    EmAgro
                  </p>

                  <p className="text-xs text-background/55">
                    Salesforce Management
                  </p>

                </div>

              </div>


              <div className="my-auto py-12">


                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/45">
                  Management Platform
                </p>


                <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">

                  Manage your
                  <br />

                  <span>
                    workforce.
                  </span>

                </h1>


                <p className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-background/45 sm:text-4xl">
                  Make every day count.
                </p>


                <p className="mt-6 max-w-md text-sm leading-6 text-background/60">
                  A centralized platform for employee
                  management, attendance, tasks,
                  activities, and performance insights.
                </p>


                <div className="mt-8 grid max-w-xl grid-cols-2 gap-2.5">

                  {FEATURES.map(
                    ({
                      title,
                      description,
                      icon: Icon,
                    }) => (

                      <div
                        key={title}
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-background/10 bg-background/[0.04] px-3.5 py-3"
                      >

                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background/10">

                          <Icon className="size-4" />

                        </div>


                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium">
                            {title}
                          </p>

                          <p className="truncate text-xs text-background/45">
                            {description}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>


              <div className="flex items-center gap-2 text-xs text-background/40">

                <ShieldCheck className="size-4 shrink-0" />

                <span>
                  Secure enterprise access
                </span>

              </div>

            </div>

          </section>


          <section className="flex items-center justify-center bg-background px-6 py-10 sm:px-10 lg:px-12 xl:px-16">


            <div className="w-full max-w-md">


              <div className="mb-8 flex items-center gap-3 lg:hidden">

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">

                  <Building2 className="size-5 text-primary" />

                </div>


                <div>

                  <p className="font-semibold">
                    EmAgro
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Salesforce Management
                  </p>

                </div>

              </div>


              <Card className="border bg-card shadow-sm">


                <CardHeader className="space-y-4 p-6 sm:p-7">

                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">

                    <LockKeyhole className="size-5 text-primary" />

                  </div>


                  <div>

                    <CardTitle className="text-2xl tracking-tight sm:text-3xl">
                      Welcome back
                    </CardTitle>

                    <CardDescription className="mt-2 leading-5">
                      Sign in to your EmAgro Salesforce
                      Management account.
                    </CardDescription>

                  </div>

                </CardHeader>


                <CardContent className="px-6 pb-6 sm:px-7 sm:pb-7">


                  <form
                    onSubmit={handleSubmit(
                      onSubmit
                    )}
                    className="space-y-5"
                  >


                    {submitError && (

                      <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5">

                        <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />

                        <p className="text-sm leading-5 text-destructive">
                          {submitError}
                        </p>

                      </div>

                    )}


                    <div className="space-y-2">

                      <Label htmlFor="email">
                        Email
                      </Label>


                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="h-10"
                        {...register("email")}
                      />


                      {errors.email && (

                        <p className="text-sm text-destructive">
                          {errors.email.message}
                        </p>

                      )}

                    </div>


                    <div className="space-y-2">

                      <Label htmlFor="password">
                        Password
                      </Label>


                      <div className="relative">

                        <Input
                          id="password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="h-10 pr-10"
                          {...register(
                            "password"
                          )}
                        />


                        <button
                          type="button"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() =>
                            setShowPassword(
                              (current) =>
                                !current
                            )
                          }
                          className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                        >

                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}

                        </button>

                      </div>


                      {errors.password && (

                        <p className="text-sm text-destructive">
                          {errors.password.message}
                        </p>

                      )}

                    </div>


                    <Button
                      type="submit"
                      disabled={
                        isSubmitting
                      }
                      className="h-10 w-full gap-2"
                    >

                      {isSubmitting ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign in

                          <ArrowRight className="size-4" />

                        </>
                      )}

                    </Button>


                    <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">

                      <Check className="size-3.5 shrink-0" />

                      <span>
                        Secure access to your workspace
                      </span>

                    </div>


                  </form>


                </CardContent>

              </Card>


              <p className="mt-6 text-center text-xs text-muted-foreground">
                © 2026 EmAgro. All rights reserved.
              </p>


            </div>

          </section>


        </div>

      </div>

    </div>
  );
}


export default Login;