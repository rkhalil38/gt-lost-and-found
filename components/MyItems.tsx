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
      className={`flex h-full w-full flex-row items-center gap-2 p-10 pt-28`}
    >
      {loading ? (
        <div className="flex h-full w-full flex-wrap gap-4 py-24 pb:pt-0">
          <div className="flex h-48 w-96 flex-col items-center justify-center rounded-lg border-[1px] border-gray-500 bg-mainTheme shadow-lg">
            <div className="h-full w-full animate-pulse rounded-lg bg-mainHover2 duration-300" />
          </div>
          <div className="hidden flex-col items-center justify-center rounded-lg border-[1px] border-gray-500 bg-mainTheme shadow-lg pb:flex pb:h-48 pb:w-96">
            <div className="h-full w-full animate-pulse rounded-lg bg-mainHover2 duration-300" />
          </div>
        </div>
      ) : user ? (
        <div className={`flex h-full w-full flex-wrap gap-4 py-24 pb:pt-0`}>
          {pins.map((pin) => (
            <Link
              href={`${pathname}/${pin.item_id}`}
              key={pin.item_id}
              className={`${
                filterElement(filter, pin) ? "flex" : "hidden"
              } group h-48 w-96 cursor-pointer flex-col items-center gap-4 rounded-lg border-[1px] border-gray-500 bg-mainHover p-2 shadow-lg duration-500 hover:bg-mainHover2`}
            >
              <div className="flex h-full w-full flex-col justify-between overflow-clip p-3">
                <div className="flex w-full flex-row">
                  <div className="flex w-full flex-col gap-1">
                    <h1 className="text-sm">{pin.item}</h1>
                    <p className="text-xs text-gray-400">{pin.description}</p>
                  </div>
                  {pin.resolved ? (
                    <p className="text-xs text-green-400">Resolved</p>
                  ) : (
                    <IoIosArrowBack className="rotate-180 text-gray-500 duration-300 group-hover:translate-x-1 group-hover:text-white" />
                  )}
                </div>
                <div className="flex w-full flex-row justify-between text-[.65rem] text-gtGold pb:text-xs">
                  <div className="flex w-1/3 flex-row items-center gap-2">
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
        <div className="flex flex-col items-center gap-4 self-center justify-self-center">
          <h1 className="text-lg text-gtGold">You are not logged in.</h1>
          <Link
            className="flex w-24 items-center justify-center rounded-lg bg-gtGold p-2 text-sm duration-500 hover:bg-gtGoldHover"
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
    <div className="absolute right-10 flex w-52 flex-col gap-4 self-start rounded-lg border-[1px] border-gray-500 bg-mainHover p-4 text-white duration-300">
      <div className="flex w-full flex-row items-center justify-between gap-2 duration-300">
        <h1 className="text-sm">Filtered by: {filter}</h1>
        <button
          onClick={() => setHideOptions(!hideOptions)}
          className="flex rounded-lg border-[1px] border-gray-400 p-2 duration-300 hover:bg-mainHover2"
        >
          <FaFilter className="text-base text-gtGold" />
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
                } duration-300 hover:text-gtGold`}
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
          } items-center justify-center 
          rounded-lg bg-gtGold p-2 text-sm duration-500 hover:bg-gtGoldHover`}
        >
          Apply
        </Link>
      </div>
    </div>
  );
};

export default MyItems;
