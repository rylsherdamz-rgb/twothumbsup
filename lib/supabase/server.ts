import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from "@/lib/env";

export function createServerSupabaseClient(): SupabaseClient<Database> | null {
  if (!hasSupabaseEnv) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}