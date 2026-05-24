import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Setup Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Cek session user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route publik (tidak butuh login)
  const authRoutes = [
    "/login",
    "/register",
    "/auth/callback",
    "/confirm-email",
    "/forgot-password",
    "/reset-password",
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // "/" → redirect ke /login jika belum login
  if (pathname === "/" && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Belum login + akses route protected → redirect ke /login
  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Sudah login + akses halaman auth → redirect ke dashboard
  if (user && isAuthRoute && pathname !== "/auth/callback") {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  // Routing berbasis role dan status (hanya untuk user yang sudah login)
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    const isPending = !profile || profile.status === "pending";
    const isRejected = profile?.status === "rejected";
    const isAdmin = profile?.role === "admin";

    // User ditolak → redirect ke halaman khusus
    if (isRejected && !pathname.startsWith("/ditolak")) {
      return NextResponse.redirect(new URL("/ditolak", request.url));
    }

    // User pending → hanya boleh akses /menunggu-persetujuan
    if (isPending && !isRejected && !pathname.startsWith("/menunggu-persetujuan")) {
      return NextResponse.redirect(new URL("/menunggu-persetujuan", request.url));
    }

    // User approved/admin yang masuk ke halaman tunggu → redirect ke tempat yang tepat
    if (!isPending && !isRejected && pathname.startsWith("/menunggu-persetujuan")) {
      return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/learn", request.url));
    }

    // Non-admin mencoba akses /admin → redirect ke dashboard
    if (!isAdmin && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/learn", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
