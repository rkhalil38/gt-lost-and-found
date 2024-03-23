"use client";
import React, { useEffect, useState } from "react";
import { fetchUserRequests, fetchUser } from "@/db/database";
import { AuthError, User } from "@supabase/supabase-js";
import { PinRequest } from "@/db/database";
import { IoIosArrowBack } from "react-icons/io";

const MyRequests = () => {
  const [requests, setRequests] = useState<PinRequest[]>([]);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getUserPins = async () => {
      const data = await fetchUser();

      if (data instanceof AuthError) {
        console.error(data);
        return;
      }

      setUser(data);

      const userRequests = await fetchUserRequests(data.id);

      if ("message" in userRequests) {
        return;
      }

      setRequests(userRequests);
    };

    getUserPins();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-1/2 h-1/2">
      {requests.map((request) => (
        <div className="flex flex-col group cursor-pointer p-4 w-full bg-mainHover hover:bg-mainHover2 duration-300 rounded-lg border-[1px] border-gray-500" key={request.item_id}>
          <div className="flex flex-row w-full justify-between items-center">
            <p>{request.description}</p>
            <IoIosArrowBack className="group-hover:text-white group-hover:translate-x-1 text-gray-500 duration-300 rotate-180" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyRequests;
