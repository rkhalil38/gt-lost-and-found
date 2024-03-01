"use client";
import { Database } from "@/supabase";
import React, { useEffect, useState } from "react";
import { reactIconMatcher } from "@/utils/supabase/iconMatcher";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchPins } from "@/db/database";

type Pin = Database["public"]["Tables"]["pins"]["Row"];

const LostItems = () => {
  const [loading, setLoading] = useState<boolean>(true);
  let parser;

  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    parser = new DOMParser();

    const fetchAllPins = async () => {
      const data = await fetchPins();

      if ("message" in data) {
        return;
      }

      setPins(data);
      setLoading(false);
    };

    fetchAllPins();
  }, []);

  return (
    <div className="flex flex-wrap justify-start py-28 px-10 gap-6 w-screen min-h-screen">
      {loading ? (
        <div className="flex flex-col border-[1px] border-gray-600 cursor-pointer duration-500 gap-4 p-2 items-center w-72 h-96 bg-gradient-to-b from-gtGold to-gtBlue shadow-lg rounded-lg">
          <div className="flex flex-col items-center rounded-lg bg-mainHover shadow-lg justify-center w-full h-1/2">
            <Skeleton width={100} height={100} baseColor="#B3A369" />
            <h1 className="font-semibold mt-4 text-white">
              <Skeleton width={90} baseColor="#B3A369" count={1} />
            </h1>
          </div>
          <div className="flex flex-col justify-center items-center rounded-lg w-full h-[40%]">
            <p className="text-gtGold">
              <Skeleton width={90} baseColor="#B3A369" />
            </p>
          </div>
          <p className="text-gray-500 text-xs">
            <Skeleton width={150} baseColor="#B3A369" />
          </p>
        </div>
      ) : (
        pins.map((pin) => (
          <Link
            href={`/lostitems/${pin.item_id}`}
            key={pin.created_at}
            className={`flex flex-col border-[1px] border-gray-600 hover:opacity-65 cursor-pointer duration-500 gap-4 p-2 items-center w-72 h-96 bg-gradient-to-b from-gtGold to-gtBlue shadow-lg rounded-lg`}
          >
            <div className="flex flex-col items-center rounded-lg bg-mainHover shadow-lg justify-center w-full h-1/2">
              {reactIconMatcher[pin.item ? pin.item : "miscellaneous"]}
              <h1 className="font-semibold mt-4 text-white">{pin.item}</h1>
            </div>
            <div className="flex flex-col overflow-x-scroll justify-center items-center rounded-lg w-full h-[40%]">
              <p className="text-gtGold">{pin.description}</p>
            </div>
            <p className="text-gray-500 text-xs">
              Found by {pin.user_name} on {pin.created_at.slice(0, 10)}
            </p>
          </Link>
        ))
      )}
    </div>
  );
};

export default LostItems;
