"use client";
import React, { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/supabase";
import Link from "next/link";
import Overlay from "./Overlay";
/*

Searchbar component that allows users to search through pins in database

TO BE ADDED

*/
type Pin = Database["public"]["Tables"]["pins"]["Row"];

const Searchbar = () => {
  const supabase = createClient();
  const [pinsToSearch, setPinsToSearch] = useState<string>("");
  const [pinItemsVisible, setPinItemsVisible] = useState<boolean>(false);
  const [pins, setPins] = useState<Pin[]>([]);

  const search = async (queryingPins: string) => {
    let searchString = queryingPins.trim();
    let searchArray = searchString.split(" ");
    searchString = searchArray.join(" & ");

    console.log(searchString);
     
    const { data, error } = await supabase
      .from("pins")
      .select()
      .textSearch("fts", searchString, {
        type: "websearch"
      });

    if (error) {
      return;
    }

    setPins(data.slice(0, 15));
  };

  useEffect(() => {
    search(pinsToSearch);
  }, [pinsToSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPinsToSearch(`'${e.target.value}'`);
  };

  return (
    <div
      id="searchbar-element"
      className="flex flex-col text-white w-full h-10 border-[1px] border-gray-500 rounded-lg"
    >
      <input
        onFocus={() => setPinItemsVisible(true)}
        onChange={handleChange}
        type="text"
        className="text-white text-sm px-2 bg-transparent w-full h-full focus:outline-none"
        placeholder="Search for an item"
      />
      <div className="flex flex-col self-center z-50 absolute shadow-lg top-[51px] w-[65%] tb:w-[40%] rounded-lg h-fit bg-mainHover">
        {pinItemsVisible
          ?
          <div>
            {pins.map((pin) => (
              <Link
                href={`/lostitems/${pin.item_id}`}
                onClick={() => setPinItemsVisible(false)}
                key={pin.created_at}
                className="flex flex-row justify-between cursor-pointer rounded-lg hover:bg-mainHover2 h-10 p-2 w-full gap-2"
              >
                <h1 className="w-full pb:w-1/4 text-sm pb:text-base font-semibold text-gtGold">{pin.item}</h1>
                <p className="w-2/4 text-sm pb:text-base overflow-clip text-start">{pin.description}</p>
                <p className="hidden pb:flex text-gray-400 items-center text-xs overflow-x-clip">
                  {pin.user_name}
                </p>
              </Link>
            ))}
          </div>

          : null}
      </div>
      <Overlay on={pinItemsVisible} setOn={() => setPinItemsVisible(false)} zIndex="z-20" clear={true} />
    </div>
  );
};

export default Searchbar;
