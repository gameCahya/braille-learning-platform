import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Grid3X3, ClipboardList, ChevronRight } from "lucide-react";
import Link from "next/link";
import { MODULES } from "@/lib/data/modules";

export default async function LearnPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { data: progressData } = await supabase
    .from("user_progress")
    .select("module_id, completed")
    .eq("user_id", user!.id);

  const completedIds = new Set(
    progressData?.filter((p) => p.completed).map((p) => p.module_id) ?? []
  );

  const completedCount = completedIds.size;
  const totalModules = MODULES.length;
  const firstName = profile?.full_name?.split(" ")[0] || "Guru";

  const quickLinks = [
    {
      href: "/learn/modules",
      icon: BookOpen,
      label: "Modul Belajar",
      desc: "Pelajari materi Braille per topik",
      color: "text-blue-600",
    },
    {
      href: "/braille-reference",
      icon: Grid3X3,
      label: "Panduan Braille",
      desc: "Referensi huruf dan pola Braille",
      color: "text-purple-600",
    },
    {
      href: "/quiz",
      icon: ClipboardList,
      label: "Quiz & Test",
      desc: "Tampilkan soal untuk kelas",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Selamat datang, {firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Pilih materi yang ingin dipelajari hari ini
        </p>
      </div>

      {/* Ringkasan modul */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-3xl font-bold">{totalModules}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Modul</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-3xl font-bold text-green-600">{completedCount}</p>
            <p className="text-sm text-muted-foreground mt-1">Sudah Selesai</p>
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="pt-5">
            <p className="text-3xl font-bold text-blue-600">
              {totalModules - completedCount}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Belum Selesai</p>
          </CardContent>
        </Card>
      </div>

      {/* Akses cepat */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Akses Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <Icon className={`h-7 w-7 mb-1 ${item.color}`} />
                    <CardTitle className="text-base">{item.label}</CardTitle>
                    <CardDescription className="text-sm">{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Daftar modul ringkas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Semua Modul
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/modules">
              Lihat semua
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODULES.slice(0, 6).map((mod) => {
            const done = completedIds.has(mod.id);
            return (
              <Link key={mod.id} href={`/learn/modules/${mod.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-4 pb-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{mod.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {mod.content.lessons.length} pelajaran
                      </p>
                    </div>
                    <div className="shrink-0">
                      {done ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Selesai
                        </Badge>
                      ) : (
                        <Badge variant="outline">Buka</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
