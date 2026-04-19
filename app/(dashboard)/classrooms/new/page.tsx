// app/(dashboard)/classrooms/new/page.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ClassroomForm } from "../_components/ClassroomForm";

export default function NewClassroomPage() {
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
          <CardTitle>Create New Class</CardTitle>
          <CardDescription>
            Add a new class to organize your students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClassroomForm />
        </CardContent>
      </Card>
    </div>
  );
}
