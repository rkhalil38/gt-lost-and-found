"use client";
import { Database } from "@/supabase";
import React, { useEffect, useState } from "react";
import { reactIconMatcher } from "@/utils/supabase/iconMatcher";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchPins } from "@/db/database";
import { FaFilter } from "react-icons/fa";
import { usePathname, useSearchParams } from "next/navigation";

type Pin = Database["public"]["Tables"]["pins"]["Row"];

/**
 * Component that displays the lost items.
 *
 * @returns The LostItems component that displays the lost items.
 */
const LostItems = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [pins, setPins] = useState<Pin[]>([]);
  const params = useSearchParams();
  const filter = params.get("filter") || "all";

  useEffect(() => {
    const fetchAllPins = async () => {
      const data = await fetchPins();

      if ("message" in data) {
        return;
      }

      let viablePins = [];
      for (const pin of data) {
        if (pin.resolved === false) {
          viablePins.push(pin);
        }
      }

      setPins(viablePins);
      setLoading(false);
    };

    fetchAllPins();
  }, []);

  const filterElement = (filter: string, pin: Pin): boolean => {
    switch (filter) {
      case "ipad":
        return pin.item === "ipad";
      case "iphone":
        return pin.item === "iphone";
      case "laptop":
        return pin.item === "laptop";
      case "android":
        return pin.item === "android";
      case "buzzcard":
        return pin.item === "buzzcard";
      case "backpack":
        return pin.item === "backpack";
      case "jacket":
        return pin.item === "jacket";
      case "airpods":
        return pin.item === "airpods";
      default:
        return true;
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-start justify-start px-10 pb-24 pt-44 pb:py-28">
      <div
        className={`flex w-full flex-col items-center gap-6 px-0 pt-0 pb:flex-row pb:flex-wrap pb:items-start pb:px-14 pb:pt-24 tb:px-0 tb:pt-0`}
      >
        {loading ? (
          <div className="flex h-fit w-72 cursor-pointer flex-col items-center gap-4 rounded-lg border-[1px] border-gray-500 bg-mainHover p-2 duration-500 pb:h-96">
            <div className="flex h-1/2 w-full flex-col items-center justify-center gap-4 rounded-lg border-[1px] border-gray-500 p-4 duration-300 group-hover:border-white">
              <div className="hidden pb:block">
                <Skeleton width={100} height={100} baseColor="#B3A369" />
              </div>
              <h1 className="font-semibold text-white">
                <Skeleton width={90} baseColor="#B3A369" count={1} />
              </h1>
            </div>
            <div className="flex h-[40%] w-full flex-col items-center justify-center rounded-lg">
              <p className="text-gtGold">
                <Skeleton width={90} baseColor="#B3A369" />
              </p>
            </div>
            <p className="text-xs text-gray-500">
              <Skeleton width={150} baseColor="#B3A369" />
            </p>
          </div>
        ) : (
          pins.map((pin) => (
            <Link
              href={`/lostitems/${pin.item_id}`}
              key={pin.created_at}
              className={`${
                filterElement(filter, pin) ? "flex" : "hidden"
              } group h-fit w-72 cursor-pointer flex-col 
                  items-center gap-4 overflow-clip rounded-lg border-[1px] border-gray-500 bg-mainHover p-2 shadow-lg duration-300 hover:bg-mainHover2 pb:h-96`}
            >
              <div className="flex h-1/2 w-full flex-col items-center justify-center rounded-lg border-[1px] border-gray-500 p-4 duration-300 tb:group-hover:border-white">
                <div className="hidden pb:block">
                  {reactIconMatcher[pin.item ? pin.item : "miscellaneous"]}
                </div>
                <h1 className="font-semibold text-white">{pin.item}</h1>
              </div>
              <div className="flex h-[40%] w-full flex-col items-center justify-center rounded-lg">
                <p className="text-gtGold duration-300">{pin.description}</p>
              </div>
              <p className="text-xs text-gray-500 duration-300 tb:group-hover:text-white">
                {`${pin.in_possession? 'Found by' : 'Spotted by'} ${pin.user_name} on ${pin.created_at.slice(0, 10)}`}
              </p>
            </Link>
          ))
        )}
      </div>
      <FilterComponent filter={filter} />
    </div>
  );
};

/**
 * Component that allows users to change the filter.
 *
 * @param filter The current filter.
 * @returns The FilterComponent that allows users to change the filter.
 */
const FilterComponent = ({ filter }: { filter: string }) => {
  const [hideOptions, setHideOptions] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const path = usePathname();

  const options = [
    "all",
    "ipad",
    "iphone",
    "laptop",
    "android",
    "buzzcard",
    "backpack",
    "jacket",
    "airpods",
  ];

  const handleChange = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <div className="absolute right-11 top-20 flex w-52 flex-col gap-4 self-start rounded-lg border-[1px] border-gray-500 bg-mainHover p-4 text-white duration-300 pb:right-4 pb:top-auto">
      <div className="flex w-full flex-row items-center justify-between gap-2 duration-300">
        <h1 className="text-sm">
          {`Filtered by:`} {filter}
        </h1>
        <button
          onClick={() => setHideOptions(!hideOptions)}
          className="flex rounded-lg border-[1px] border-gray-400 p-2 duration-300 hover:bg-mainHover2"
        >
          <FaFilter className="text-base text-gtGold" />
        </button>
      </div>
      <div className={`${hideOptions ? "hidden" : "flex"} flex-col gap-2`}>
        <ol>
          {options.map((option) => (
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

export default LostItems;
