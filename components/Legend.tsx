"use client";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

const Legend = () => {
  const [option1, setOption1] = useState(false);
  const [option2, setOption2] = useState(false);

  return (
    <div className="fixed z-10 right-4 top-20 flex w-32 flex-col rounded-lg border-[1px] border-gray-500 bg-mainHover text-gtGold shadow-lg duration-300 pb:w-52">
      <div
        onClick={() => setOption1(!option1)}
        className="flex flex-row items-center justify-between rounded-t-lg p-2 duration-300 hover:cursor-pointer hover:bg-mainHover2"
      >
        <div className="flex flex-row items-center justify-center gap-1">
          <svg
            width="15px"
            height="15px"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24,1.32c-9.92,0-18,7.8-18,17.38A16.83,16.83,0,0,0,9.57,29.09l12.84,16.8a2,2,0,0,0,3.18,0l12.84-16.8A16.84,16.84,0,0,0,42,18.7C42,9.12,33.92,1.32,24,1.32Z"
              fill="#003057"
            />
            <path
              d="M25.37,12.13a7,7,0,1,0,5.5,5.5A7,7,0,0,0,25.37,12.13Z"
              fill="#003057"
            />
          </svg>
          <p>Spotted</p>
        </div>
        <IoIosArrowBack
          className={`duration-300 group-hover:text-white ${option1 ? "-rotate-90 text-white" : "-rotate-180 text-gray-400"}`}
        />
      </div>
      {option1 && (
        <p className="p-2 text-xs text-gtGold pb:text-sm">
          These are items that were spotted but not taken by the person who saw
          them. You cannot claim sightings.
        </p>
      )}
      <div
        onClick={() => setOption2(!option2)}
        className="flex flex-row items-center justify-between rounded-b-lg p-2 duration-300 hover:cursor-pointer hover:bg-mainHover2"
      >
        <div className="flex flex-row items-center justify-center gap-1">
          <svg
            width="15px"
            height="15px"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24,1.32c-9.92,0-18,7.8-18,17.38A16.83,16.83,0,0,0,9.57,29.09l12.84,16.8a2,2,0,0,0,3.18,0l12.84-16.8A16.84,16.84,0,0,0,42,18.7C42,9.12,33.92,1.32,24,1.32Z"
              fill="#FFFFFF"
            />
            <path
              d="M25.37,12.13a7,7,0,1,0,5.5,5.5A7,7,0,0,0,25.37,12.13Z"
              fill="#FFFFFF"
            />
          </svg>
          <p>Held</p>
        </div>
        <IoIosArrowBack
          className={`duration-300 group-hover:text-white ${option2 ? "-rotate-90 text-white" : "-rotate-180 text-gray-400"}`}
        />
      </div>
      {option2 && (
        <p className="p-2 text-xs text-gtGold pb:text-sm">
          These are items that are currently being held by the person who found
          them. These items can be claimed.
        </p>
      )}
    </div>
  );
};

export default Legend;
