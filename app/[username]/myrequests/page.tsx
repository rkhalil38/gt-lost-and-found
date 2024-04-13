import React from "react";
import { Metadata } from "next";
import MyRequests from "@/components/MyRequests";

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
    <div className="flex min-h-screen w-screen flex-col bg-mainTheme px-8 pt-28">
      <MyRequests />
    </div>
  );
};

export default page;
