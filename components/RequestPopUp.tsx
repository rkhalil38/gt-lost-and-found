"use client";
import { PinRequest, Profile, fetchProfile } from "@/db/database";
import { User } from "@supabase/supabase-js";
import React, { use, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RequestPopUp = ({
  toggle,
  itemOwnerID,
}: {
  toggle: Function;
  itemOwnerID: string;
}) => {
  const [ priorityData, setPriorityData ] = useState<Profile>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchProfile(itemOwnerID);
      
      if ("message" in user) {
        console.error(user.message);
        return;
      }

      
      setPriorityData(user);
      
    }

    fetchUser();
  }, [itemOwnerID]);

  return (
    <div className="flex flex-col justify-between z-30 p-4 animate-in fixed top-16 left-0 tb:top-1/4 tb:left-1/4 bg-mainTheme w-full h-[65%] tb:w-1/2 tb:h-1/2 rounded-lg border-[1px]">
      <button
        onClick={() => toggle(false)}
        className="flex absolute rounded-lg duration-200 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-gtGold text-xl"
      >
        <IoMdClose />
      </button>
      <div className="flex flex-col">
        <div>
          <h1 className="text-xl text-gtGold font-bold">{`Congratulations! Your item has been confirmed as yours!`}</h1>
          <p className="text-gray-400 text-xs">
            The user who found your item is {priorityData?.username || <Skeleton height={10} width={80} baseColor="#B3A369" />}. 
            They will be in touch with you soon&#33;
          </p>
        </div>      
      </div>
      <div>
          <p className="text-white text-base">
            <a className="text-gtGold">{`Finder Username: `}</a>
            {priorityData?.username || <Skeleton height={20} width={100} baseColor="#B3A369" />}
          </p>
          <p className="text-white text-base">
            <a className="text-gtGold">{`Past Items Found: `}</a>
            {priorityData?.items_found || <Skeleton height={20} width={20} baseColor="#B3A369" />}
          </p>

      </div>
      <p className="text-gtGold text-sm">{`Thank you for using GT Lost and Found!`}</p>
    </div>
  );
};

export default RequestPopUp;
