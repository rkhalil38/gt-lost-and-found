import Link from "next/link";
import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BsGithub } from "react-icons/bs";
import UnivHeader from "@/components/UnivHeader";
import OAuthProviders from "@/components/OAuthProviders";

export default async function Login() {
  const apiKey = process.env.GOOGLE_MAPS_KEY ? process.env.GOOGLE_MAPS_KEY : "";

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const signedIn = await supabase.auth.getUser();

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center bg-mainTheme">
      <UnivHeader apiKey={apiKey} />

      {!signedIn.data.user ? (
        <div className="flex flex-col animate-in h-full w-full items-center justify-center">
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
