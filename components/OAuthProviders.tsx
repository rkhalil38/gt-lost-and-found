"use client";
import React from "react";
import { BsGithub } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

/*

Componenet on login page that utilizes supabase third party Oauth
to verify users
Currently supports Facebook, Google, and Github

*/
const OAuthProviders = () => {
  const router = useRouter();

  const signInWithGithub = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) {
      return router.push("/login?message=Could not authenticate user");
    }
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return router.push("/login?message=Could not authenticate user");
    }
  };

  const signInWithFacebook = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
    });

    if (error) {
      return router.push("/login?message=Could not authenticate user");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-1/6">
      <button
        onClick={signInWithGoogle}
        className="flex flex-row duration-300 hover:bg-mainHover items-center justify-center gap-2 rounded-lg border-[1px] border-gray-600"
      >
        <svg
          className="my-2"
          width="30px"
          height="30px"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z"
            fill="#4285F4"
          />
          <path
            d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z"
            fill="#34A853"
          />
          <path
            d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z"
            fill="#FBBC05"
          />
          <path
            d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z"
            fill="#EB4335"
          />
        </svg>
        <p className="text-white">Sign in with Google</p>
      </button>
      <button
        onClick={signInWithGithub}
        className="flex flex-row duration-300 hover:bg-mainHover items-center justify-center gap-2 rounded-lg border-[1px] border-gray-600"
      >
        <BsGithub className="text-white hover:cursor-pointer h-[30px] w-[30px] my-2" />
        <p className="text-white">Sign in with Github</p>
      </button>
      <button
        onClick={signInWithFacebook}
        className="flex flex-row duration-300 hover:bg-mainHover items-center justify-center gap-2 rounded-lg border-[1px] border-gray-600"
      >
        <svg
          className="my-2"
          width="30px"
          height="30px"
          viewBox="0 0 48 48"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Icons" stroke="none" strokeWidth="1" fill="none">
            <g
              id="Color-"
              transform="translate(-200.000000, -160.000000)"
              fill="#4460A0"
            >
              <path
                d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z"
                id="Facebook"
              ></path>
            </g>
          </g>
        </svg>
        <p className="text-white">Sign in with Facebook</p>
      </button>
    </div>
  );
};

export default OAuthProviders;
