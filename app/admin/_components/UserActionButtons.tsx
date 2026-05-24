"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, Loader2 } from "lucide-react";
import {
  approveUser,
  rejectUser,
  changeUserRole,
  changeUserStatus,
} from "../_actions/admin-actions";

type UserRole = "teacher" | "student" | "admin";
type UserStatus = "pending" | "approved" | "rejected";

export function PendingActionButtons({ userId }: { userId: string }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleApprove() {
    setLoading("approve");
    await approveUser(userId);
    setLoading(null);
  }

  async function handleReject() {
    setLoading("reject");
    await rejectUser(userId);
    setLoading(null);
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={loading !== null}
        className="bg-green-600 hover:bg-green-700 text-white gap-1"
      >
        {loading === "approve" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
        Setujui
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleReject}
        disabled={loading !== null}
        className="gap-1"
      >
        {loading === "reject" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <X className="h-3.5 w-3.5" />
        )}
        Tolak
      </Button>
    </div>
  );
}

export function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const [loading, setLoading] = useState(false);

  async function handleChange(value: string) {
    setLoading(true);
    await changeUserRole(userId, value as UserRole);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-1">
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      <Select defaultValue={currentRole} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger className="h-8 w-[110px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Siswa</SelectItem>
          <SelectItem value="teacher">Guru</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function StatusSelect({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: UserStatus;
}) {
  const [loading, setLoading] = useState(false);

  async function handleChange(value: string) {
    setLoading(true);
    await changeUserStatus(userId, value as UserStatus);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-1">
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      <Select defaultValue={currentStatus} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Disetujui</SelectItem>
          <SelectItem value="rejected">Ditolak</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
