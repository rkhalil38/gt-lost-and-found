import UnivHeader from "@/components/UnivHeader";
import React from "react";
import { Metadata } from "next";

type Props = {
  params: {
    username: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username} | My Requests`,
  };
}

const page = () => {
  return (
    <div className="flex flex-col bg-mainTheme items-center w-screen min-h-screen">
      
    </div>
  );
};

export default page;
