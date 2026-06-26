"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getPrePostTest } from "@/lib/data/pre-post-tests";
import { TestRunner } from "./_components/TestRunner";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { PrePostTestData } from "@/types";

export default function PrePostTestPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const moduleId = params?.moduleId as string;
  const testType = params?.testType as string;

  const [testData, setTestData] = useState<PrePostTestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  // Validate testType + get test data (static)
  useEffect(() => {
    if (testType !== "pre" && testType !== "post") {
      setError("Halaman tidak ditemukan");
      setLoading(false);
      return;
    }

    const data = getPrePostTest(moduleId);
    if (!data) {
      setError("Modul tidak ditemukan");
      setLoading(false);
      return;
    }

    setTestData(data);
  }, [moduleId, testType]);

  // Check auth + get teacher/student IDs
  useEffect(() => {
    if (!testData) return;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setError("Silakan login terlebih dahulu.");
        setLoading(false);
        return;
      }

      // Get profile role
      supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
        .then(({ data: profile }) => {
          const role = profile?.role ?? "teacher";

          if (role === "teacher") {
            // Teacher: get studentId from search params
            const sid = searchParams?.get("studentId");
            if (!sid) {
              setError("Silakan pilih siswa terlebih dahulu.");
              setLoading(false);
              return;
            }
            setTeacherId(user.id);
            setStudentId(sid);
            setLoading(false);
          } else {
            // Student: find their own student record
            supabase
              .from("students")
              .select("id, teacher_id")
              .eq("teacher_id", user.id)
              .single()
              .then(({ data: studentRecord, error: studentErr }) => {
                if (studentErr || !studentRecord) {
                  setError("Data siswa tidak ditemukan.");
                  setLoading(false);
                  return;
                }
                setTeacherId(user.id);
                setStudentId(studentRecord.id);
                setLoading(false);
              });
          }
        });
    });
  }, [testData, searchParams]);

  // Check if already submitted
  useEffect(() => {
    if (!studentId || !moduleId || !testType) return;

    const supabase = createClient();
    supabase
      .from("pre_post_results" as any)
      .select("id")
      .eq("student_id", studentId)
      .eq("module_id", moduleId)
      .eq("test_type", testType)
      .maybeSingle()
      .then(({ data: existing }: { data: any }) => {
        if (existing) {
          router.replace(
            `/prepost-test/${moduleId}/results?studentId=${studentId}`
          );
        }
      });
  }, [studentId, moduleId, testType, router]);

  // ── Render states ──

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
        <p className="text-muted-foreground">Memuat soal...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
        <p className="text-lg font-medium text-foreground">{error}</p>
        <Link
          href="/reports"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Kembali ke laporan
        </Link>
      </div>
    );
  }

  // Render TestRunner
  if (!testData || !teacherId || !studentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
        <p className="text-lg font-medium text-foreground">Data tidak lengkap.</p>
      </div>
    );
  }

  return (
    <TestRunner
      testData={testData}
      testType={testType as "pre" | "post"}
      studentId={studentId}
      teacherId={teacherId}
    />
  );
}
