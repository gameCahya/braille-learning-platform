// app/(dashboard)/classrooms/[id]/edit/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ClassroomForm } from "../../_components/ClassroomForm";

interface EditClassroomPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClassroomPage({ params }: EditClassroomPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: classroom } = await supabase
    .from("classrooms")
    .select("id, name, description")
    .eq("id", id)
    .eq("teacher_id", user.id)
    .single();

  if (!classroom) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/classrooms">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classes
        </Link>
      </Button>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Class</CardTitle>
          <CardDescription>Update class details</CardDescription>
        </CardHeader>
        <CardContent>
          <ClassroomForm classroom={classroom} />
        </CardContent>
      </Card>
    </div>
  );
}
