"use client";
import { AuthError, User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Database } from "@/supabase";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchUser, fetchUserItems } from "@/db/database";
import { FaFilter } from "react-icons/fa";

type Pin = Database["public"]["Tables"]["pins"]["Row"];

/**
 * Component that displays the user's items.
 *
 * @returns The MyItems component that displays the user's items.
 */
const MyItems = () => {
  const [user, setUser] = useState<User>();
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const params = useSearchParams();
  const filter = params.get("filter") || "all";
  const pathname = usePathname();

  const filterElement = (filter: string, pin: Pin): boolean => {
    switch (filter) {
      case "resolved":
        return pin.resolved;
      case "unresolved":
        return !pin.resolved;
      case "no claims":
        return pin.claim_requests === 0;
      default:
        return true;
    }
  };

  useEffect(() => {
    const fetchUserAndPins = async () => {
      const data = await fetchUser();

      if (data instanceof AuthError) {
        return;
      }

      setUser(data);

      const pins = await fetchUserItems(data);

      if ("message" in pins) {
        return;
      }

      setPins(pins ? pins : []);
      setLoading(false);
    };

    fetchUserAndPins();
  }, []);

  useEffect(() => {}, [filter]);

  return (
    <div
      className={`flex flex-row items-center w-full h-full gap-2 p-10 pt-28`}
    >
      {loading ? (
        <div className="flex flex-wrap gap-4 w-full h-full py-24 pb:pt-0">
          <div className="flex flex-col bg-mainTheme border-[1px] border-gray-500 items-center justify-center w-96 h-48 shadow-lg rounded-lg">
            <div className="w-full h-full duration-300 rounded-lg bg-mainHover2 animate-pulse" />
          </div>
          <div className="hidden pb:flex flex-col bg-mainTheme border-[1px] border-gray-500 items-center justify-center pb:w-96 pb:h-48 shadow-lg rounded-lg">
            <div className="w-full h-full duration-300 rounded-lg bg-mainHover2 animate-pulse" />
          </div>
        </div>
      ) : user ? (
        <div className={`flex flex-wrap gap-4 w-full h-full py-24 pb:pt-0`}>
          {pins.map((pin) => (
            <Link
              href={`${pathname}/${pin.item_id}`}
              key={pin.item_id}
              className={`${
                filterElement(filter, pin) ? "flex" : "hidden"
              } flex-col group duration-500 cursor-pointer bg-mainHover hover:bg-mainHover2 border-[1px] border-gray-500 gap-4 p-2 items-center w-96 h-48 shadow-lg rounded-lg`}
            >
              <div className="flex flex-col h-full w-full p-3 overflow-clip justify-between">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col w-full gap-1">
                    <h1 className="text-sm">{pin.item}</h1>
                    <p className="text-xs text-gray-400">{pin.description}</p>
                  </div>
                  {pin.resolved ? (
                    <p className="text-green-400 text-xs">Resolved</p>
                  ) : (
                    <IoIosArrowBack className="group-hover:text-white group-hover:translate-x-1 text-gray-500 duration-300 rotate-180" />
                  )}
                </div>
                <div className="flex flex-row justify-between text-[.65rem] pb:text-xs text-gtGold w-full">
                  <div className="flex flex-row items-center w-1/3 gap-2">
                    <p>{pin.claim_requests} Claim Requests</p>
                  </div>
                  <p className="text-gray-500">
                    {pin.created_at.substring(0, 10)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
      <FilterComponent filter={filter} />
    </div>
  );
};

/**
 * Component that filters the user's items.
 *
 * @param filter The current filter.
 * @returns The FilterComponent that filters the user's items.
 */
const FilterComponent = ({ filter }: { filter: string }) => {
  const [hideOptions, setHideOptions] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const path = usePathname();

  const optipns = ["All", "Resolved", "Unresolved", "No Claims"];

  const handleChange = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <div className="flex flex-col duration-300 right-10 absolute text-white self-start p-4 gap-4 w-52 rounded-lg bg-mainHover border-[1px] border-gray-500">
      <div className="flex flex-row w-full items-center justify-between gap-2 duration-300">
        <h1 className="text-sm">Filtered by: {filter}</h1>
        <button
          onClick={() => setHideOptions(!hideOptions)}
          className="flex p-2 rounded-lg border-gray-400 border-[1px] hover:bg-mainHover2 duration-300"
        >
          <FaFilter className="text-gtGold text-base" />
        </button>
      </div>
      <div className={`${hideOptions ? "hidden" : "flex"} flex-col gap-2`}>
        <ol>
          {optipns.map((option) => (
            <li key={option} className="flex flex-row items-center gap-2">
              <button
                onClick={() => handleChange(option)}
                className={`${
                  selectedFilter === option ? "text-gtGold" : "text-white"
                } hover:text-gtGold duration-300`}
              >
                {option}
              </button>
            </li>
          ))}
        </ol>
        <Link
          href={`${path}?filter=${selectedFilter.toLowerCase()}`}
          onClick={() => {
            setHideOptions(true);
          }}
          className={`${
            hideOptions ? "hidden" : "flex"
          } bg-gtGold hover:bg-gtGoldHover 
          text-sm duration-500 rounded-lg items-center justify-center p-2`}
        >
          Apply
        </Link>
      </div>
    </div>
  );
};

export default MyItems;
