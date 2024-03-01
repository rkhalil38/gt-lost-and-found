import LostItemDisplay from "@/components/LostItemDisplay";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

type Props = {
  params: {
    item_id: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const itemID = params.item_id;

  return {
    title: `Lost Item | ${itemID}`,
  };
}

const page = () => {
  const apiKey = process.env.GOOGLE_MAPS_KEY ? process.env.GOOGLE_MAPS_KEY : "";

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-mainTheme">
      <LostItemDisplay apiKey={apiKey}/>
    </div>
  );
};

export default page;
