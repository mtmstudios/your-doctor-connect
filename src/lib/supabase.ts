import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Graceful fallback — App rendert auch ohne .env.local (z.B. in Lovable Preview).
// Auth/DB-Operationen geben dann einen klaren Fehler statt die App zum Absturz zu bringen.
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseAnonKey || "placeholder-anon-key";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[ZumArzt] Supabase-Credentials fehlen. " +
      "Bitte VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in .env.local setzen. " +
      "Auth und DB sind bis dahin deaktiviert."
  );
}

export const supabase = createClient(url, key);

/** true wenn echte Supabase-Credentials konfiguriert sind */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
