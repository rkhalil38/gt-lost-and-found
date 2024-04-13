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
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username} | My Items`,
  };
}

const page = () => {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center bg-mainTheme">
      <MyItems />
    </div>
  );
};

export default page;
