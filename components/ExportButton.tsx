"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  data: Record<string, string | number>[];
  filename: string;
  label?: string;
}

/**
 * Tombol export CSV — generate file dari data array dan trigger download.
 */
export function ExportButton({ data, filename, label = "Export CSV" }: ExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) return;

    // Ambil header dari keys object pertama
    const headers = Object.keys(data[0]);

    // Build CSV string
    const csvRows: string[] = [];

    // Header row
    csvRows.push(headers.map((h) => `"${h}"`).join(","));

    // Data rows
    for (const row of data) {
      csvRows.push(
        headers.map((h) => {
          const val = row[h] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(",")
      );
    }

    const csvString = csvRows.join("\n");

    // BOM untuk Excel mengenali UTF-8
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvString], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={data.length === 0}
      aria-label={`Unduh ${filename}`}
    >
      <Download className="h-4 w-4 mr-2" aria-hidden="true" />
      {label}
    </Button>
  );
}
