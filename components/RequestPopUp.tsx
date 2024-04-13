"use client";
import { PinRequest, Profile, fetchProfile } from "@/db/database";
import { User } from "@supabase/supabase-js";
import React, { use, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Component that displays the request pop-up.
 *
 * @param toggle The toggle function
 * @return The RequestPopUp component that displays the request pop-up.
 */
const RequestPopUp = ({
  toggle,
  itemOwnerID,
}: {
  toggle: Function;
  itemOwnerID: string;
}) => {
  const [priorityData, setPriorityData] = useState<Profile>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchProfile(itemOwnerID);

      if ("message" in user) {
        console.error(user.message);
        return;
      }

      setPriorityData(user);
    };

    fetchUser();
  }, [itemOwnerID]);

  return (
    <div className="animate-in fixed left-0 top-16 z-30 flex h-[65%] w-full flex-col justify-between rounded-lg border-[1px] bg-mainTheme p-4 tb:left-1/4 tb:top-1/4 tb:h-1/2 tb:w-1/2">
      <button
        onClick={() => toggle(false)}
        className="absolute right-2 top-[9px] flex h-8 w-8 items-center justify-center rounded-lg bg-mainHover text-xl text-gray-600 duration-200 hover:text-gtGold"
      >
        <IoMdClose />
      </button>
      <div className="flex flex-col">
        <div>
          <h1 className="text-xl font-bold text-gtGold">{`Congratulations! Your item has been confirmed as yours!`}</h1>
          <p className="text-xs text-gray-400">
            The user who found your item is{" "}
            {priorityData?.username || (
              <Skeleton height={10} width={80} baseColor="#B3A369" />
            )}
            . They will be in touch with you soon&#33;
          </p>
        </div>
      </div>
      <div>
        <p className="text-base text-white">
          <a className="text-gtGold">{`Finder Username: `}</a>
          {priorityData?.username || (
            <Skeleton height={20} width={100} baseColor="#B3A369" />
          )}
        </p>
        <p className="text-base text-white">
          <a className="text-gtGold">{`Past Items Found: `}</a>
          {priorityData?.items_found || (
            <Skeleton height={20} width={20} baseColor="#B3A369" />
          )}
        </p>
      </div>
      <p className="text-sm text-gtGold">{`Thank you for using GT Lost and Found!`}</p>
    </div>
  );
};

export default RequestPopUp;
