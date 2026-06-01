"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { login } from "../actions";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      if (result?.error) {
        toast.error("Login gagal", { description: result.error });
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") return;
      toast.error("Terjadi kesalahan", { description: "Coba lagi nanti." });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 md:p-8">
      <main className="w-full max-w-sm flex flex-col items-center">

        {/* Mascot / Logo */}
        <div className="flex flex-col items-center mb-8 w-full">
          <div className="w-28 h-28 mb-6 rounded-full bg-muted border-4 border-border shadow-sm flex items-center justify-center select-none">
            <span className="text-5xl" role="img" aria-label="Maskot Bralingo">🦉</span>
          </div>
          <h1 className="text-3xl font-bold text-center text-foreground mb-2">
            Selamat datang!
          </h1>
          <p className="text-base text-center text-muted-foreground px-4">
            Siap belajar Braille hari ini? Ayo mulai!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full flex flex-col gap-4 mb-8">

          {/* Email */}
           <div className="flex flex-col gap-1.5">
             <label htmlFor="email" className="sr-only">Email</label>
             <input
               id="email"
               type="email"
               placeholder="Email"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full bg-muted border-2 border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-colors disabled:opacity-50"
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                disabled={isLoading}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="w-full bg-muted border-2 border-border rounded-xl px-4 py-3 pr-12 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-colors disabled:opacity-50"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end -mt-1">
            <Link
              href="/forgot-password"
              className="text-sm font-bold text-primary hover:opacity-80 transition-opacity uppercase tracking-wider"
              tabIndex={isLoading ? -1 : 0}
            >
              Lupa Password?
            </Link>
          </div>

          {/* Tactile 3D Submit Button */}
          <div className="tactile-wrapper w-full">
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full bg-primary text-primary-foreground font-bold text-base py-3 px-6 rounded-xl border-b-4 border-secondary hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4"
            >
              {isLoading ? "Masuk..." : "Masuk"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-base text-center text-muted-foreground pb-6">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-bold text-primary hover:opacity-80 transition-opacity uppercase ml-1"
            tabIndex={isLoading ? -1 : 0}
          >
            Daftar
          </Link>
        </p>
      </main>
    </div>
  );
}
