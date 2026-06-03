"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const [serverError, setServerError] = useState<string | null>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

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

  // Fokus ke error summary setiap kali serverError muncul
  useEffect(() => {
    if (serverError && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [serverError]);

  // === Keyboard handler untuk radio group role selector ===
  const handleRoleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const roles: RegisterInput["role"][] = ["student", "teacher"];
      const currentIndex = roles.indexOf(selectedRole);
      let nextIndex = currentIndex;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % roles.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + roles.length) % roles.length;
      }
      if (nextIndex !== currentIndex) {
        setValue("role", roles[nextIndex], { shouldValidate: true });
        // Fokus ke radio yang baru dipilih
        const nextRadio = document.querySelector(
          `[data-role-radio="${roles[nextIndex]}"]`
        ) as HTMLElement | null;
        nextRadio?.focus();
      }
    },
    [selectedRole, setValue]
  );

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const result = await registerAction(data);
      if (result?.error) {
        if (result.requiresConfirmation) {
          toast.info("Cek email kamu!", {
            description: result.error,
            duration: 6000,
          });
        } else {
          setServerError(result.error);
          toast.error("Registrasi gagal", { description: result.error });
        }
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

  const inputClass =
    "w-full bg-muted border-2 border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-colors disabled:opacity-50";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 md:p-8">
      <main id="auth-content" tabIndex={-1} className="w-full max-w-sm flex flex-col items-center outline-none">

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

            {/* ============ Data Diri ============ */}
            <fieldset className="border-0 p-0 flex flex-col gap-4">
              <legend className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Data Diri
              </legend>

              {/* Nama Lengkap */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="register-fullName" className="sr-only">Nama Lengkap</label>
                <input
                  id="register-fullName"
                  type="text"
                  placeholder="Nama Lengkap"
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={errors.fullName ? "true" : "false"}
                  aria-describedby={errors.fullName ? "register-fullName-error" : undefined}
                  className={inputClass}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p id="register-fullName-error" className="text-sm text-destructive" role="alert">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Nama Sekolah */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="register-schoolName" className="sr-only">Nama Sekolah</label>
                <input
                  id="register-schoolName"
                  type="text"
                  placeholder="Nama Sekolah"
                  aria-required="true"
                  aria-invalid={errors.schoolName ? "true" : "false"}
                  aria-describedby={errors.schoolName ? "register-schoolName-error" : undefined}
                  className={inputClass}
                  {...register("schoolName")}
                />
                {errors.schoolName && (
                  <p id="register-schoolName-error" className="text-sm text-destructive" role="alert">
                    {errors.schoolName.message}
                  </p>
                )}
              </div>
            </fieldset>

            {/* ============ Pilih Peran ============ */}
            <fieldset className="border-0 p-0 flex flex-col gap-1.5">
              <legend className="text-sm font-medium text-foreground">
                Saya mendaftar sebagai:
              </legend>
              <input type="hidden" {...register("role")} />
              <div
                role="radiogroup"
                aria-labelledby="role-legend"
                aria-required="true"
                className="grid grid-cols-2 gap-3"
                onKeyDown={handleRoleKeyDown}
              >
                <span id="role-legend" className="sr-only">Pilih peran: Siswa atau Guru</span>
                <button
                  type="button"
                  role="radio"
                  data-role-radio="student"
                  aria-checked={selectedRole === "student"}
                  tabIndex={selectedRole === "student" ? 0 : -1}
                  onClick={() => setValue("role", "student", { shouldValidate: true })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    selectedRole === "student"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Siswa
                </button>
                <button
                  type="button"
                  role="radio"
                  data-role-radio="teacher"
                  aria-checked={selectedRole === "teacher"}
                  tabIndex={selectedRole === "teacher" ? 0 : -1}
                  onClick={() => setValue("role", "teacher", { shouldValidate: true })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
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
            </fieldset>

            {/* ============ Tingkat Kelas — hanya untuk siswa ============ */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-gradeLevel" className="sr-only">Tingkat Kelas</label>
              <select
                id="register-gradeLevel"
                disabled={isLoading}
                aria-required={selectedRole === "student" ? "true" : "false"}
                aria-invalid={errors.gradeLevel ? "true" : "false"}
                aria-describedby={errors.gradeLevel ? "register-gradeLevel-error" : undefined}
                className={`${inputClass} cursor-pointer ${selectedRole !== "student" ? "hidden" : ""}`}
                {...register("gradeLevel")}
                defaultValue=""
              >
                <option value="" disabled>Pilih Tingkat Kelas</option>
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>
              {errors.gradeLevel && (
                <p id="register-gradeLevel-error" className="text-sm text-destructive" role="alert">
                  {errors.gradeLevel.message}
                </p>
              )}
            </div>
            {/* Announcement untuk screen reader saat gradeLevel muncul/hilang */}
            <div aria-live="polite" className="sr-only" aria-atomic="true">
              {selectedRole === "student"
                ? "Kolom tingkat kelas tersedia, silakan pilih kelas."
                : ""}
            </div>

            {/* ============ Akun ============ */}
            <fieldset className="border-0 p-0 flex flex-col gap-4">
              <legend className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Akun
              </legend>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="register-email" className="sr-only">Email</label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "register-email-error" : undefined}
                  className={inputClass}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="register-email-error" className="text-sm text-destructive" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="register-password" className="sr-only">Password</label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="new-password"
                    aria-required="true"
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={
                      errors.password
                        ? "register-password-requirements register-password-error"
                        : "register-password-requirements"
                    }
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
                <p id="register-password-requirements" className="text-xs text-muted-foreground">
                  Minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka
                </p>
                {errors.password && (
                  <p id="register-password-error" className="text-sm text-destructive" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="register-confirmPassword" className="sr-only">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    id="register-confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    autoComplete="new-password"
                    aria-required="true"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={errors.confirmPassword ? "register-confirmPassword-error" : undefined}
                    className={`${inputClass} pr-12`}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full"
                    aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="register-confirmPassword-error" className="text-sm text-destructive" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </fieldset>

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

          </fieldset>
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
