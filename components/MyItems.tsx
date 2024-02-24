"use client";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Database } from "@/supabase";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "react-loading-skeleton/dist/skeleton.css";

type Pin = Database["public"]["Tables"]["pins"]["Row"];

const MyItems = () => {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>();
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserAndPins = async () => {
      const { data } = await supabase.auth.getUser();
      const temp_id = data.user?.id;
      setUser(data.user);

      let { data: pins, error } = await supabase
        .from("pins")
        .select("*")
        .eq("creator_id", temp_id);

      setPins(pins ? pins : []);
      setLoading(false);
    };

    fetchUserAndPins();
  }, []);

  return (
    <div
      className={`flex flex-wrap items-center w-full h-full gap-4 p-10 mt-16`}
    >
      {loading ? (
        <div className="flex flex-row gap-4">
          <div className="flex flex-col bg-mainTheme border-[1px] border-gray-600 items-center justify-center w-96 h-48 shadow-lg rounded-lg">
            <div className="w-full h-full duration-300 rounded-lg bg-mainHover2 animate-pulse" />
          </div>
          <div className="flex flex-col bg-mainTheme border-[1px] border-gray-600 items-center justify-center w-96 h-48 shadow-lg rounded-lg">
            <div className="w-full h-full duration-300 rounded-lg bg-mainHover2 animate-pulse" />
          </div>
        </div>
      ) : user ? (
        pins.map((pin) => (
          <Link
            href={`${pathname}/${pin.item_id}`}
            key={pin.item_id}
            className="flex flex-col group duration-500 cursor-pointer bg-mainHover hover:bg-mainHover2 border-[1px] border-gray-600 gap-4 p-2 items-center w-96 h-48 shadow-lg rounded-lg"
          >
            <div className="flex flex-col h-full w-full p-3 overflow-clip justify-between">
              <div className="flex flex-row w-full">
                <div className="flex flex-col w-full gap-1">
                  <h1 className="text-sm">{pin.item}</h1>
                  <p className="text-xs text-gray-400">{pin.description}</p>
                </div>
                <IoIosArrowBack className="group-hover:text-white group-hover:translate-x-1 text-gray-500 duration-300 rotate-180" />
              </div>
              <div className="flex flex-row justify-between text-xs text-gtGold w-full">
                <div className="flex flex-row items-center w-1/3 gap-2">
                  <h1>{pin.claim_requests}</h1>
                  <p>Claim Requests</p>
                </div>
                <p className="text-gray-500">
                  {pin.created_at.substring(0, 10)}
                </p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="flex flex-col items-center justify-self-center self-center gap-4">
          <h1 className="text-lg text-gtGold">You are not logged in.</h1>
          <Link
            className="flex w-24 bg-gtGold hover:bg-gtGoldHover text-sm duration-500 rounded-lg items-center justify-center p-2"
            href="/login"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyItems;
