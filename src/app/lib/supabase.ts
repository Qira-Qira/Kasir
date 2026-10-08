import { createClient } from "@supabase/supabase-js";

const viteEnv = typeof import.meta !== "undefined" && import.meta && typeof import.meta.env !== "undefined" ? import.meta.env : undefined;
const runtimeEnv = viteEnv ?? (typeof process !== "undefined" ? process.env : {});

const supabaseUrl = (runtimeEnv as Record<string, string | undefined>).VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = (runtimeEnv as Record<string, string | undefined>).VITE_SUPABASE_ANON_KEY ?? "";

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
