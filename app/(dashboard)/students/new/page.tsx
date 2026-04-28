// app/(dashboard)/students/new/page.tsx

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StudentForm } from "../_components/StudentForm";

export default async function NewStudentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil daftar kelas untuk dropdown
  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, name")
    .eq("teacher_id", user!.id)
    .order("name");

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/students">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Link>
      </Button>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Student</CardTitle>
          <CardDescription>
            Create a profile for a new student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentForm classrooms={classrooms || []} />
        </CardContent>
      </Card>
    </div>
  );
}
