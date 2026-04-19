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

  // Route publik yang boleh diakses tanpa login
  const publicRoutes = [
    "/login",
    "/register",
    "/auth/callback",
    "/confirm-email",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // "/" → redirect ke /login atau /learn
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(user ? "/learn" : "/login", request.url)
    );
  }

  // Belum login + akses route protected → redirect ke /login
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Sudah login + akses halaman auth → redirect ke /learn
  if (user && isPublicRoute && pathname !== "/auth/callback") {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
