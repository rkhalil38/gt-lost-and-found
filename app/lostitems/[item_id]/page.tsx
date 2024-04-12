import LostItemDisplay from "@/components/LostItemDisplay";
import { getItemInfo } from "@/utils/supabase/server";
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

  const item = await getItemInfo(itemID);

  if (!item || "message" in item) {
    return {
      title: "Lost Item",
      description: "Lost Item",
      openGraph: {
        title: "Lost Item",
        description: "Lost Item",
        images: [
          {
            url: "/Buzz.png",
            width: 1200,
            height: 630,
            alt: "Lost Item",
          },
        ],
      },
    };
  }

  return {
    title: `Lost Item | ${itemID}`,
    description: `${item?.description}`,
    openGraph: {
      title: `Lost ${item.item} at Georgia Tech | GT Lost and Found`,
      description: `${item.description}`,
      images: [
        {
          url: `/Buzz.png`,
          width: 1200,
          height: 630,
          alt: `Lost ${item.item} at Georgia Tech`,
        },
      ],
    },
  };
}

const page = () => {
  const apiKey = process.env.GOOGLE_MAPS_KEY ? process.env.GOOGLE_MAPS_KEY : "";

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-mainTheme">
      <LostItemDisplay apiKey={apiKey} />
    </div>
  );
};

export default page;
