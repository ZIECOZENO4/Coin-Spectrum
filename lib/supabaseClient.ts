import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./supabase-2";
// import { Database } from "../types/supabase";

export const supabaseBrowser = () => {
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and Anon Key must be set in environment variables."
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

// npx supabase gen types typescript --project-id "pvgqaoqcuutjjufnvhgp" --schema public > lib/supabase.ts
