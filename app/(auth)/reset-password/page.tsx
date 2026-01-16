// app/(auth)/reset-password/page.tsx
import { ResetPasswordClient } from "./ResetPasswordClient";

export const dynamic = "force-dynamic"; // 👈 Ini sekarang berlaku!

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { code?: string; access_token?: string };
}) {
  return <ResetPasswordClient code={searchParams.code} accessToken={searchParams.access_token} />;
}