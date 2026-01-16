"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get code from URL
        const code = new URLSearchParams(window.location.search).get('code');
        
        if (code) {
          // Exchange code for session
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Auth error:', error);
            setError(error.message);
            // Redirect to login after 3 seconds
            setTimeout(() => {
              router.push('/login?error=auth_failed');
            }, 3000);
            return;
          }
        }

        // Success - redirect to dashboard
        router.push('/learn');
        router.refresh();
      } catch (err) {
        console.error('Callback error:', err);
        setError('Authentication failed. Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <div className="text-destructive">
              <p className="text-lg font-semibold">Authentication Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-lg font-semibold">Completing authentication...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we sign you in.
            </p>
          </>
        )}
      </div>
    </div>
  );
}