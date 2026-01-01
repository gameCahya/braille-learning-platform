"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

export async function login(data: LoginInput) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    // Provide more user-friendly error messages
    if (error.message.includes("Email not confirmed")) {
      return { 
        error: "Please confirm your email address before signing in. Check your inbox for the confirmation link." 
      };
    }
    if (error.message.includes("Invalid login credentials")) {
      return { 
        error: "Invalid email or password. Please try again." 
      };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/learn");
}

export async function register(data: RegisterInput) {
  const supabase = await createClient();

  // Sign up user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  // Check if email confirmation is required
  if (authData.user && !authData.session) {
    return { 
      error: "Please check your email to confirm your account before signing in.",
      requiresConfirmation: true 
    };
  }

  // Profile akan otomatis dibuat via trigger di Supabase
  
  revalidatePath("/", "layout");
  redirect("/learn");
}

export async function signOut() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath("/", "layout");
  redirect("/login");
}