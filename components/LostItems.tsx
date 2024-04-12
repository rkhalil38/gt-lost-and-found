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

const LostItems = () => {
  const [loading, setLoading] = useState<boolean>(true);
  let parser;

  const [pins, setPins] = useState<Pin[]>([]);
  const params = useSearchParams();
  const filter = params.get("filter") || "all";

  useEffect(() => {
    parser = new DOMParser();

    const fetchAllPins = async () => {
      const data = await fetchPins();

      if ("message" in data) {
        return;
      }

      let viablePins = []
      for (const pin of data) {
        if (pin.resolved === false) {
          viablePins.push(pin)
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
      default:
        return true;
    }
  };

  return (
    <div className="flex items-start justify-start pt-44 pb-24 pb:py-28 px-10 w-screen min-h-screen">
      <div
        className={`flex flex-col pt-0 pb:pt-24 tb:pt-0 px-0 pb:px-14 tb:px-0 pb:flex-row pb:flex-wrap items-center pb:items-start gap-6 w-full`}
      >
        {loading ? (
          <div className="flex flex-col border-[1px] border-gray-500 cursor-pointer duration-500 gap-4 p-2 items-center w-72 h-fit pb:h-96 bg-mainHover rounded-lg">
            <div className="flex flex-col gap-4 p-4 border-[1px] border-gray-500 group-hover:border-white items-center rounded-lg duration-300 justify-center w-full h-1/2">
              <div className="hidden pb:block">
                <Skeleton width={100} height={100} baseColor="#B3A369" />
              </div>
              <h1 className="font-semibold text-white">
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
              className={`${
                filterElement(filter, pin) ? "flex" : "hidden"
              } flex-col overflow-clip group hover:bg-mainHover2 border-[1px] 
                  border-gray-500 cursor-pointer duration-300 gap-4 p-2 items-center w-72 h-fit pb:h-96 bg-mainHover shadow-lg rounded-lg`}
            >
              <div className="flex flex-col p-4 border-[1px] border-gray-500 tb:group-hover:border-white items-center rounded-lg duration-300 justify-center w-full h-1/2">
                <div className="hidden pb:block">
                  {reactIconMatcher[pin.item ? pin.item : "miscellaneous"]}
                </div>
                <h1 className="font-semibold text-white">{pin.item}</h1>
              </div>
              <div className="flex flex-col justify-center items-center rounded-lg w-full h-[40%]">
                <p className="text-gtGold duration-300">{pin.description}</p>
              </div>
              <p className="text-gray-500 tb:group-hover:text-white duration-300 text-xs">
                Found by {pin.user_name} on {pin.created_at.slice(0, 10)}
              </p>
            </Link>
          ))
        )}
      </div>
      <FilterComponent filter={filter} />
    </div>
  );
};

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
    <div className="flex flex-col duration-300 top-20 pb:top-auto right-11 pb:right-4 absolute text-white self-start p-4 gap-4 w-52 rounded-lg bg-mainHover border-[1px] border-gray-500">
      <div className="flex flex-row w-full items-center justify-between gap-2 duration-300">
        <h1 className="text-sm">
          {`Filtered by:`} {filter}
        </h1>
        <button
          onClick={() => setHideOptions(!hideOptions)}
          className="flex p-2 rounded-lg border-gray-400 border-[1px] hover:bg-mainHover2 duration-300"
        >
          <FaFilter className="text-gtGold text-base" />
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

export default LostItems;
