"use client";

import { useState, useRef, useEffect } from "react";
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
  const [serverError, setServerError] = useState<string | null>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Fokus ke error summary setiap kali serverError muncul
  useEffect(() => {
    if (serverError && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [serverError]);

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const result = await login(data);
      if (result?.error) {
        setServerError(result.error);
        toast.error("Login gagal", { description: result.error });
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") return;
      const msg = "Terjadi kesalahan. Coba lagi nanti.";
      setServerError(msg);
      toast.error("Terjadi kesalahan", { description: "Coba lagi nanti." });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 md:p-8">
      <main id="auth-content" tabIndex={-1} className="w-full max-w-sm flex flex-col items-center outline-none">

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

        {/* Error summary — server-side */}
        {serverError && (
          <div
            ref={errorSummaryRef}
            role="alert"
            tabIndex={-1}
            className="w-full mb-4 p-3 rounded-xl bg-destructive/10 border-2 border-destructive text-destructive text-sm font-medium outline-none"
          >
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full flex flex-col gap-4 mb-8">

          <fieldset disabled={isLoading} className="contents">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="sr-only">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "login-email-error" : undefined}
                className="w-full bg-muted border-2 border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-colors disabled:opacity-50"
                {...register("email")}
              />
              {errors.email && (
                <p id="login-email-error" className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "login-password-error" : undefined}
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
                <p id="login-password-error" className="text-sm text-destructive" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-primary hover:opacity-80 transition-opacity uppercase tracking-wider"
                aria-label="Lupa password — buka halaman reset password"
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
            <div aria-live="polite" className="sr-only" aria-atomic="true">
              {isLoading ? "Memproses login, harap tunggu" : serverError ? `Gagal: ${serverError}` : ""}
            </div>

          </fieldset>
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
