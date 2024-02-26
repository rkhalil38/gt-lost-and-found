import LostItems from "@/components/LostItems";
import UnivHeader from "@/components/UnivHeader";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col bg-mainTheme items-center justify-center min-h-screen w-screen">
      <LostItems />
    </div>
  );
};

export default page;
