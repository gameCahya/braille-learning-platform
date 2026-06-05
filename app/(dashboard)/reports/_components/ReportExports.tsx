"use client";

import { ExportButton } from "@/components/ExportButton";

interface ReportExportsProps {
  studentProgress: Array<{
    student_name: string;
    classroom_name: string;
    completed: number;
    total: number;
    avg_score: number;
  }>;
}

export function ReportExports({ studentProgress }: ReportExportsProps) {
  const csvData = studentProgress.map((sp) => ({
    "Nama Siswa": sp.student_name,
    "Kelas": sp.classroom_name,
    "Modul Selesai": sp.completed,
    "Total Modul": sp.total,
    "Skor Rata-rata": sp.avg_score,
    "Progres (%)": sp.total > 0 ? Math.round((sp.completed / sp.total) * 100) : 0,
  }));

  const date = new Date().toISOString().split("T")[0];

  return (
    <ExportButton
      data={csvData}
      filename={`laporan-progres-siswa-${date}`}
      label="Export CSV"
    />
  );
}
