"use client";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import { IoIosMenu } from "react-icons/io";
import Overlay from "./Overlay";
import Searchbar from "./Searchbar";

/*

Header that displays at the top of screen
Allows users to call upon navigation bar and search through database

*/

const UnivHeader = ({ apiKey }: { apiKey: string }) => {
  const [toggled, setToggled] = useState(false);

  return (
    <div className="flex flex-row bg-mainTheme z-10 w-screen items-center h-16 fixed top-0 border-b-[1px] border-gray-700 shadow-lg">
      <button
        className="flex items-center justify-center rounded-lg border-[1px] text-2xl ml-4 text-gray-700 w-8 h-8 hover:border-gtGold hover:text-gtGold duration-200"
        onClick={() => setToggled(true)}
      >
        <IoIosMenu />
      </button>
      <NavigationBar apiKey={apiKey} toggle={setToggled} toggled={toggled} />
      <h1 className="bg-gradient-to-b from-gtGold to-white text-transparent bg-clip-text text-xl font-semibold pl-4">
        GT Lost and Found
      </h1>
      <Overlay zIndex="z-10" on={toggled} />
      <Searchbar />
    </div>
  );
};

export default UnivHeader;
