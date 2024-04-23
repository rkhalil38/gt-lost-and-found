"use client";
import { claimItem, fetchUser } from "@/db/database";
import { Database } from "@/supabase";
import { AuthError, User } from "@supabase/supabase-js";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ClipLoader from "react-spinners/ClipLoader";
var validator = require("validator");

type componentMap = {
  [key: string]: JSX.Element;
};

type PinRequest = Database["public"]["Tables"]["requests"]["Row"];

/**
 * Component that supplies form for user to claim an item.
 *
 * @param path The URL path
 * @param itemID The ID of the item
 * @param pin_creator_id The ID of the user who created the pin
 * @param username The username of the user who created the pin
 * @param claimStatus The status of the claim
 * @param userID The ID of the user
 * @param setClaimStatus Function that sets the claim status
 * @param user Boolean that determines if the user is signed in
 * @returns The ClaimItem component that allows the user to claim an item
 */

const ClaimItem = ({
  path,
  itemID,
  pin_creator_id,
  username,
  claimStatus,
  userID,
  setClaimStatus,
  user,
}: {
  path: string;
  itemID: string;
  pin_creator_id: string;
  username: string;
  claimStatus: string;
  userID: string;
  setClaimStatus: Function;
  user: boolean;
}) => {
  const [activeUser, setActiveUser] = useState<User>();
  const [reasoning, setReasoning] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [contactMethod, setContactMethod] = useState<string>("email");
  const [contactInfo, setContactInfo] = useState<string>("");
  const [fieldError, setFieldError] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUser();
      console.log(claimStatus);

      if (data instanceof AuthError) {
        return;
      }

      setActiveUser(data);
    };

    getUser();
  });

  useEffect(() => {
    setCharacterCount(reasoning.length);
  }, [reasoning]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReasoning(e.target.value);
  };

  const handleContactInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (contactMethod) {
      case "email":
        if (validator.isEmail(e.target.value)) {
          setFieldError(false);
          setContactInfo(e.target.value);
          console.log("valid email");
        } else {
          console.log("invalid email");
          setFieldError(true);
        }
        break;
      case "phone":
        if (validator.isMobilePhone(e.target.value)) {
          setFieldError(false);
          setContactInfo(e.target.value);
          console.log("valid phone");
        } else {
          console.log("invalid phone");
          setFieldError(true);
        }
        break;
    }
  };

  const completedForm = () => {
    return (
      reasoning.length > 0 &&
      contactInfo.length > 0 &&
      (validator.isEmail(contactInfo) || validator.isMobilePhone(contactInfo))
    );
  };

  const claimDisplayedItem = async () => {
    setClaimStatus("loading");
    const claimRequest: PinRequest = {
      description: reasoning,
      item_id: itemID,
      request_id: userID + itemID,
      creator_name: username,
      contact: contactInfo,
      pin_creator_id: pin_creator_id,
      created_at: "",
      creator_id: userID,
      status: "",
    };

    if (activeUser instanceof AuthError || !activeUser) {
      setClaimStatus("notClaimed");
      return;
    }

    const claim = await claimItem(claimRequest, activeUser, contactInfo);

    if ("message" in claim) {
      console.log(claim);
      setClaimStatus("notClaimed");
      return;
    }

    setClaimStatus("claimed");
  };

  const componentMap: componentMap = {
    notClaimed: (
      <div className="flex h-full w-full flex-col justify-between gap-4">
        <div className="flex flex-col gap-8">
          <h1 className="text-xl font-bold text-gtGold pb:text-2xl">
            You are claiming this item as
            <a className="text-white"> {username}</a>
          </h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact" className="text-white">
              Select your preferred contact method.
            </label>
            <div className="flex flex-row gap-4">
              <select
                className="h-10 w-44 rounded-lg border-[1px] bg-mainTheme p-2 text-white focus:border-gtGold focus:outline-none"
                name="contact"
                onChange={(e) => setContactMethod(e.target.value)}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
              {contactMethod === "email" ? (
                <input
                  type="email"
                  className={`h-10 w-full border-[1px] p-2 text-sm pb:w-96 pb:text-base ${
                    fieldError ? "border-red-400" : "focus:border-gtGold"
                  } rounded-lg bg-mainTheme text-white focus:outline-none`}
                  placeholder="Enter your preferred email"
                  onChange={handleContactInfo}
                />
              ) : (
                <input
                  type="tel"
                  className={`h-10 w-full border-[1px] p-2 text-sm pb:w-96 pb:text-base ${
                    fieldError ? "border-red-400" : "focus:border-gtGold"
                  } rounded-lg bg-mainTheme text-white focus:outline-none`}
                  placeholder="Enter your phone number"
                  onChange={handleContactInfo}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="reasoning" className="text-white">
              Please provide valid reasoning that this is your item.
            </label>
            <textarea
              maxLength={250}
              onChange={handleChange}
              name="reasoning"
              className="h-44 w-full resize-none rounded-lg border-[1px] bg-mainTheme p-4 text-white focus:border-gtGold focus:outline-none pb:h-64"
            ></textarea>
            <p className="self-end text-xs text-white">{characterCount}/250</p>
          </div>
        </div>
        <div className="flex flex-row items-end justify-end">
          <button
            disabled={!completedForm()}
            onClick={claimDisplayedItem}
            className={`flex h-10 w-36 items-center justify-center rounded-lg border-[1px] bg-gtGold text-xs text-white hover:bg-gtGoldHover disabled:bg-gray-700 disabled:text-gray-400`}
          >
            Submit Request
          </button>
        </div>
      </div>
    ),

    notSignedIn: (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <h1>Sign in to claim this item.</h1>
        <Link
          href="/login"
          className="flex h-10 items-center justify-center rounded-lg bg-gtGold p-4 text-sm text-white duration-300 hover:bg-gtGoldHover"
        >
          Sign in
        </Link>
      </div>
    ),

    claimed: (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <FaCheck className="text-6xl text-gtGold" />
        <h1 className="justify-center self-center text-lg text-gtGold">
          Request Submitted!
        </h1>
      </div>
    ),

    loading: (
      <div className="flex h-full w-full items-center justify-center">
        <ClipLoader color="#C29B0C" size={65} />
      </div>
    ),

    pinOwner: (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <h1 className="text-xl text-gtGold">{`You cannot claim an item you found.`}</h1>
        <Link
          className="flex w-48 items-center justify-center rounded-lg border-[1px] border-gtGoldHover bg-gtGold p-2 text-sm duration-300 hover:bg-gtGoldHover"
          href={`/${username}/myitems/${itemID}`}
        >
          Manage this item
        </Link>
      </div>
    ),

    pinOwnerSpotter: (
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="text-xl text-gtGold">{`You spotted this item.`}</h1>
      </div>
    ),

    spotting: (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-xl text-gtGold">{`You cannot claim a sighting.`}</h1>
      </div>
    ),
  };

  return (
    <div className="animate-in shaodw-lg fixed z-40 flex h-[85%] w-full flex-col gap-4 self-start rounded-lg border-[1px] border-gray-500 bg-mainTheme p-4 pb:self-center tb:h-[70%] tb:w-1/2">
      {claimStatus !== "loading" ? (
        <div className="flex h-full w-full">
          <Link
            href={path + "?claim=false"}
            className="absolute right-2 top-[9px] flex h-8 w-8 items-center justify-center rounded-lg bg-mainHover text-xl text-gray-600 duration-200 hover:text-gtGold"
          >
            <IoMdClose />
          </Link>
          {componentMap[claimStatus]}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ClipLoader color="#C29B0C" size={65} />
        </div>
      )}
    </div>
  );
};

export default ClaimItem;
