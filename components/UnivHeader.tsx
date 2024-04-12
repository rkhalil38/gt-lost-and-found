"use client";
import React, { use, useEffect, useRef, useState } from "react";
import NavigationBar from "./NavigationBar";
import { IoIosMenu } from "react-icons/io";
import Overlay from "./Overlay";
import Searchbar from "./Searchbar";

/**
 * The header component for the application.
 *
 * @param apiKey The Google Maps API key
 * @returns The UnivHeader component that displays the header for the application.
 */
const UnivHeader = ({ apiKey }: { apiKey: string }) => {
  const [toggled, setToggled] = useState(false);

  return (
    <div className="flex flex-row px-4 bg-mainHover z-10 w-screen justify-between items-center h-16 fixed top-0 border-b-[1px] border-gray-500 shadow-lg">
      <div className="flex items-center justify-start w-[20%]">
        <button
          className="flex items-center justify-center rounded-lg border-[1px] text-2xl border-gray-500 text-gray-500 w-8 h-8 tb:hover:border-gtGold tb:hover:text-gtGold duration-200"
          onClick={() => {
            setToggled(true);
          }}
        >
          <IoIosMenu />
        </button>
        <h1 className="hidden tb:block text-gtGold text-xl font-semibold pl-4">
          GT Lost and Found
        </h1>
      </div>
      <div className="flex items-center justify-center w-[80%] tb:w-[40%]">
        <Searchbar />
      </div>
      <div className="flex items-center justify-end w-[20%]"></div>
      <NavigationBar apiKey={apiKey} toggle={setToggled} toggled={toggled} />
      <Overlay zIndex="z-10" on={toggled} setOn={setToggled} clear={false} />
    </div>
  );
};

export default UnivHeader;
