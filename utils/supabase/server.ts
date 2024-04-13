import { Pin } from "@/db/database";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { PostgrestError } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};

/**
 * Gets the item information. Used for metadata generation.
 *
 * @param id The item ID
 * @returns The item information or an error if the item does not exist.
 */
export const getItemInfo = async (
  id: string,
): Promise<Pin | PostgrestError> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("pins")
    .select("*")
    .eq("item_id", id);

  if (error) {
    return error;
  }

  return data ? data[0] : {};
};
