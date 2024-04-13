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
    <div className="fixed top-0 z-10 flex h-16 w-screen flex-row items-center justify-between border-b-[1px] border-gray-500 bg-mainHover px-4 shadow-lg">
      <div className="flex w-[20%] items-center justify-start">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg border-[1px] border-gray-500 text-2xl text-gray-500 duration-200 tb:hover:border-gtGold tb:hover:text-gtGold"
          onClick={() => {
            setToggled(true);
          }}
        >
          <IoIosMenu />
        </button>
        <h1 className="hidden pl-4 text-xl font-semibold text-gtGold tb:block">
          GT Lost and Gay
        </h1>
      </div>
      <div className="flex w-[80%] items-center justify-center tb:w-[40%]">
        <Searchbar />
      </div>
      <div className="flex w-[20%] items-center justify-end"></div>
      <NavigationBar apiKey={apiKey} toggle={setToggled} toggled={toggled} />
      <Overlay zIndex="z-10" on={toggled} setOn={setToggled} clear={false} />
    </div>
  );
};

export default UnivHeader;
