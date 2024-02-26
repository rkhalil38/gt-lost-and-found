import UnivHeader from "@/components/UnivHeader";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import MyItems from "@/components/MyItems";

type Props = {
  params: {
    username: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username} | My Items`,
  };
}

const page = () => {
  return (
    <div className="flex flex-col bg-mainTheme items-center w-screen min-h-screen">
      <MyItems />
    </div>
  );
};

export default page;
