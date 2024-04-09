import LostItems from "@/components/LostItems";
import React, { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lost Items | GT Lost and Found",
  description: "Lost items at Georgia Tech",
  keywords: [
    "lost items georgia tech",
    "lost and found georgia tech",
    "lost items in georgia tech",
    "lost and found gt",
    "GT lost and found",
    "items lost at georgia tech",
  ],
  openGraph: {
    title: "Lost Items | GT Lost and Found",
    description: "Lost items at Georgia Tech",
    siteName: "GT Lost and Found",
    images: [
      {
        url: "/Buzz.png",
        width: 1200,
        height: 630,
        alt: "Lost Items at Georgia Tech",
      },
    ],
  },
};

const page = () => {
  return (
    <div className="flex flex-col bg-mainTheme items-center justify-center min-h-screen w-screen">
      <Suspense>
        <LostItems />
      </Suspense>
    </div>
  );
};

export default page;
