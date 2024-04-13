import Link from "next/link";
import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BsGithub } from "react-icons/bs";
import UnivHeader from "@/components/UnivHeader";
import OAuthProviders from "@/components/OAuthProviders";

export default async function Login() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const signedIn = await supabase.auth.getUser();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-mainTheme">
      {!signedIn.data.user ? (
        <div className="animate-in flex h-full w-full flex-col items-center justify-center">
          <OAuthProviders />
        </div>
      ) : (
        <div>
          <p>You are already signed in.</p>
        </div>
      )}
    </div>
  );
}
