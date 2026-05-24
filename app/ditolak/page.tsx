import { SignOutButton } from "@/components/SignOutButton";
import { XCircle } from "lucide-react";

export default async function DitolakPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pendaftaran Tidak Disetujui
        </h1>
        <p className="text-gray-500 mb-6">
          Maaf, pendaftaran kamu tidak dapat disetujui saat ini. Hubungi admin
          sekolah kamu untuk informasi lebih lanjut.
        </p>

        <SignOutButton />
      </div>
    </div>
  );
}
