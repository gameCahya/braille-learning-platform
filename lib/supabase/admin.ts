// lib/supabase/admin.ts
// ⚠️ HANYA untuk server-side (server actions, route handlers)
// JANGAN di-import di client components!
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SECRET_SUPABASE_KEY

  if (!url || !key) {
    throw new Error('Supabase admin credentials not configured. Set SECRET_SUPABASE_KEY in .env.local')
  }

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
