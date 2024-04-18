"use client";
import React, { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/supabase";
import Link from "next/link";
import Overlay from "./Overlay";

type Pin = Database["public"]["Tables"]["pins"]["Row"];

/**
 * The search bar component.
 *
 * @returns The Searchbar component that displays the search bar.
 */
const Searchbar = () => {
  const supabase = createClient();
  const [pinsToSearch, setPinsToSearch] = useState<string>("");
  const [pinItemsVisible, setPinItemsVisible] = useState<boolean>(false);
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    const search = async (queryingPins: string) => {
      let searchString = queryingPins.trim();
      let searchArray = searchString.split(" ");
      searchString = searchArray.join(" & ");

      const { data, error } = await supabase
        .from("pins")
        .select()
        .textSearch("fts", searchString, {
          type: "websearch",
        });

      if (error) {
        return;
      }

      setPins(data.slice(0, 15));
    };

    search(pinsToSearch);
  }, [pinsToSearch, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPinsToSearch(`'${e.target.value}'`);
  };

  return (
    <div
      id="searchbar-element"
      className="flex h-10 w-full flex-col rounded-lg border-[1px] border-gray-500 text-white"
    >
      <input
        onFocus={() => setPinItemsVisible(true)}
        onChange={handleChange}
        type="text"
        className="h-full w-full bg-transparent px-2 text-sm text-white focus:outline-none"
        placeholder="Search for an item"
      />
      <div className="absolute top-[51px] z-50 flex h-fit w-[65%] flex-col self-center rounded-lg bg-mainHover shadow-lg tb:w-[40%]">
        {pinItemsVisible ? (
          <div>
            {pins.map((pin) => (
              <Link
                href={`/lostitems/${pin.item_id}`}
                onClick={() => setPinItemsVisible(false)}
                key={pin.created_at}
                className="flex h-10 w-full cursor-pointer flex-row justify-between gap-2 rounded-lg p-2 hover:bg-mainHover2"
              >
                <h1 className="w-full text-sm font-semibold text-gtGold pb:w-1/4 pb:text-base">
                  {pin.item}
                </h1>
                <p className="w-2/4 overflow-clip text-start text-sm pb:text-base">
                  {pin.description}
                </p>
                <p className="hidden items-center overflow-x-clip text-xs text-gray-400 pb:flex">
                  {pin.user_name}
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      <Overlay
        on={pinItemsVisible}
        setOn={() => setPinItemsVisible(false)}
        zIndex="z-20"
        clear={true}
      />
    </div>
  );
};

export default Searchbar;
