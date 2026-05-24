import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { Clock, Mail } from "lucide-react";

export default async function MenungguPersetujuanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  const roleLabel = profile?.role === "teacher" ? "Guru" : "Siswa";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-100 rounded-full p-4">
            <Clock className="h-10 w-10 text-amber-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Menunggu Persetujuan
        </h1>
        <p className="text-gray-500 mb-6">
          Halo, <span className="font-medium text-gray-700">{profile?.full_name ?? user.email}</span>!
          Pendaftaran kamu sebagai <strong>{roleLabel}</strong> sedang menunggu
          persetujuan dari admin.
        </p>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left space-y-2">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">Cek email kamu</p>
              <p className="text-sm text-blue-700">
                Kamu akan mendapat notifikasi ke <strong>{user.email}</strong> setelah
                admin memproses pendaftaranmu.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          Proses persetujuan biasanya memakan waktu 1×24 jam pada hari kerja.
        </p>

        <SignOutButton />
      </div>
    </div>
  );
}
