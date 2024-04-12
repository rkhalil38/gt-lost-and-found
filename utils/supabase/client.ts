import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Suapabase client that can be used in Client Components.
 * 
 * @returns The Supabase client that is used to interact with the Supabase database.
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

