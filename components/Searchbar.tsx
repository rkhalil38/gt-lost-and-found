"use client";
import React, { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/supabase";
import Link from "next/link";
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

  const defaultPin: Pin = {
    created_at: "",
    x_coordinate: 0,
    y_coordinate: 0,
    item: "",
    description: "",
    user_name: "",
    creator_id: "",
    item_id: "",
    item_description_username: "",
    claim_requests: 0,
    fts: "",
  };

  const search = async (queryingPins: string) => {
    let searchString = queryingPins.trim();
    searchString = searchString.split(" ").join(" | ");

    const { data, error } = await supabase
      .from("pins")
      .select()
      .textSearch("fts", searchString);

    setPins(data ? data.slice(0, 15) : []);
  };

  useEffect(() => {
    search(pinsToSearch);
  }, [pinsToSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPinsToSearch(`'${e.target.value}'`);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    e.relatedTarget instanceof HTMLAnchorElement
      ? null
      : setPinItemsVisible(false);
  };

  return (
    <div
      onBlur={handleBlur}
      id="searchbar-element"
      className="flex flex-col w-[40%] h-10 border-[1px] bg-mainHover border-gray-600 rounded-lg fixed left-[30%]"
    >
      <input
        onFocus={() => setPinItemsVisible(true)}
        onChange={handleChange}
        type="text"
        className="absolute px-2 bg-transparent w-full h-full focus:outline-none"
        placeholder="Search for an item"
      />
      <div className="flex flex-col shadow-lg absolute top-10 w-full rounded-lg h-fit bg-mainHover">
        {pinItemsVisible
          ? pins.map((pin) => (
              <Link
                href={`/lostitems/${pin.item_id}`}
                key={pin.created_at}
                className="flex flex-row cursor-pointer rounded-lg hover:bg-slate-700 h-10 p-2 w-full gap-2"
              >
                <h1 className="w-1/4 font-semibold text-gtGold">{pin.item}</h1>
                <p className="w-2/4 overflow-clip">{pin.description}</p>
                <p className="flex text-gray-500 items-center text-xs overflow-x-clip">
                  {pin.user_name}
                </p>
              </Link>
            ))
          : null}
      </div>
    </div>
  );
};

export default Searchbar;
