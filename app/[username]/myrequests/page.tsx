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
    <div className="flex flex-col pt-28 px-8 bg-mainTheme w-screen min-h-screen">
      <MyRequests />
    </div>
  );
};

export default page;
