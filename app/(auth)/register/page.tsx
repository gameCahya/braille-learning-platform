"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { register as registerAction } from "../actions";
import { toast } from "sonner";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const result = await registerAction(data);
      if (result?.error) {
        if (result.requiresConfirmation) {
          toast.info("Cek email kamu!", {
            description: result.error,
            duration: 6000,
          });
        } else {
          toast.error("Registrasi gagal", { description: result.error });
        }
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") return;
      toast.error("Terjadi kesalahan", { description: "Coba lagi nanti." });
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-muted border-2 border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-colors disabled:opacity-50";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 md:p-8">
      <main className="w-full max-w-sm flex flex-col items-center">

        {/* Mascot / Logo */}
        <div className="flex flex-col items-center mb-8 w-full">
          <div className="w-28 h-28 mb-6 rounded-full bg-muted border-4 border-border shadow-sm flex items-center justify-center select-none">
            <span className="text-5xl" role="img" aria-label="Maskot Bralingo">🦉</span>
          </div>
          <h1 className="text-3xl font-bold text-center text-foreground mb-2">
            Buat Akun
          </h1>
          <p className="text-base text-center text-muted-foreground px-4">
            Bergabung dan mulai perjalanan belajar Braille kamu!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full flex flex-col gap-4 mb-8">

          {/* Nama Lengkap */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="sr-only">Nama Lengkap</label>
            <input
              id="fullName"
              type="text"
              placeholder="Nama Lengkap"
              autoComplete="name"
              disabled={isLoading}
              aria-invalid={errors.fullName ? "true" : "false"}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className={inputClass}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-sm text-destructive" role="alert">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Pilih Peran */}
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">Saya mendaftar sebagai:</p>
            <input type="hidden" {...register("role")} />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setValue("role", "student", { shouldValidate: true })}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                  selectedRole === "student"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                }`}
              >
                Siswa
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setValue("role", "teacher", { shouldValidate: true })}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                  selectedRole === "teacher"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                }`}
              >
                Guru
              </button>
            </div>
            {errors.role && (
              <p className="text-sm text-destructive" role="alert">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Nama Sekolah */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="schoolName" className="sr-only">Nama Sekolah</label>
            <input
              id="schoolName"
              type="text"
              placeholder="Nama Sekolah"
              disabled={isLoading}
              aria-invalid={errors.schoolName ? "true" : "false"}
              aria-describedby={errors.schoolName ? "schoolName-error" : undefined}
              className={inputClass}
              {...register("schoolName")}
            />
            {errors.schoolName && (
              <p id="schoolName-error" className="text-sm text-destructive" role="alert">
                {errors.schoolName.message}
              </p>
            )}
          </div>

          {/* Tingkat Kelas — hanya untuk siswa */}
          {selectedRole === "student" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gradeLevel" className="sr-only">Tingkat Kelas</label>
              <select
                id="gradeLevel"
                disabled={isLoading}
                aria-invalid={errors.gradeLevel ? "true" : "false"}
                aria-describedby={errors.gradeLevel ? "gradeLevel-error" : undefined}
                className={`${inputClass} cursor-pointer`}
                {...register("gradeLevel")}
                defaultValue=""
              >
                <option value="" disabled>Pilih Tingkat Kelas</option>
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>
              {errors.gradeLevel && (
                <p id="gradeLevel-error" className="text-sm text-destructive" role="alert">
                  {errors.gradeLevel.message}
                </p>
              )}
            </div>
          )}

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
              className={inputClass}
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
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby="password-requirements password-error"
                className={`${inputClass} pr-12`}
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
            <p id="password-requirements" className="text-xs text-muted-foreground">
              Minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka
            </p>
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="sr-only">Konfirmasi Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi Password"
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                className={`${inputClass} pr-12`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full"
                aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-sm text-destructive" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Tactile 3D Submit Button */}
          <div className="tactile-wrapper w-full mt-2">
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full bg-primary text-primary-foreground font-bold text-base py-3 px-6 rounded-xl border-b-4 border-secondary hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4"
            >
              {isLoading ? "Mendaftar..." : "Daftar Sekarang"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-base text-center text-muted-foreground pb-6">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:opacity-80 transition-opacity uppercase ml-1"
            tabIndex={isLoading ? -1 : 0}
          >
            Masuk
          </Link>
        </p>
      </main>
    </div>
  );
}
