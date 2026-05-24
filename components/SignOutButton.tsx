"use client";

import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function SignOutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOut();
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={handleSignOut}
      className={className ?? "w-full gap-2"}
    >
      <LogOut className="h-4 w-4" />
      Keluar
    </Button>
  );
}
