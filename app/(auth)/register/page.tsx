// app/(auth)/register/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;


"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { register as registerAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    
    try {
      const result = await registerAction(data);
      
      if (result?.error) {
        if (result.requiresConfirmation) {
          toast.info("Check your email", {
            description: result.error,
            duration: 6000,
          });
        } else {
          toast.error("Registration failed", {
            description: result.error,
          });
        }
        setIsLoading(false);
      }
      // If no error, redirect() is called in action
    } catch (error) {
      // redirect() throws NEXT_REDIRECT error - this is expected behavior
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        // Redirect successful, do nothing
        return;
      }
      
      console.error("Registration error:", error);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to get started with learning
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                disabled={isLoading}
                aria-invalid={errors.fullName ? "true" : "false"}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p 
                  id="fullName-error" 
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                disabled={isLoading}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p 
                  id="email-error" 
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error password-requirements" : "password-requirements"}
                {...register("password")}
              />
              <p 
                id="password-requirements" 
                className="text-xs text-slate-600 dark:text-slate-400"
              >
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
              {errors.password && (
                <p 
                  id="password-error" 
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p 
                  id="confirmPassword-error" 
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

            {/* Terms & Privacy */}
            <p className="text-xs text-center text-slate-600 dark:text-slate-400">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="underline hover:text-slate-900 dark:hover:text-slate-100"
                tabIndex={isLoading ? -1 : 0}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline hover:text-slate-900 dark:hover:text-slate-100"
                tabIndex={isLoading ? -1 : 0}
              >
                Privacy Policy
              </Link>
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline"
                tabIndex={isLoading ? -1 : 0}
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}