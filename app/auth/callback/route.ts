import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Redirect to dashboard on success
      return NextResponse.redirect(`${origin}/learn`);
    }
  }

  // Redirect to login on error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}