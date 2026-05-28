export const supabaseUrl = process.env.NEXT_PUBLIC_PROJECT_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_PROJECT_KEY ?? "";
export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);
