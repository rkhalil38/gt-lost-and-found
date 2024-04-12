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
    setClaimStatus("loading");
    const getUser = async () => {
      const data = await fetchUser();

      if (data instanceof AuthError) {
        return;
      }

      setActiveUser(data);
      setClaimStatus("notClaimed");
    };

    getUser();
  }, []);

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
      <div className="flex flex-col gap-4 w-full h-full">
        <h1 className="font-bold text-xl pb:text-2xl text-gtGold">
          You are claiming this item as
          <a className="text-white"> {username}</a>
        </h1>
        <label htmlFor="contact" className="text-white">
          Select your preferred contact method.
        </label>
        <div className="flex flex-row gap-4">
          <select
            className="w-44 h-10 p-2 border-[1px] focus:border-gtGold focus:outline-none bg-mainTheme text-white rounded-lg"
            name="contact"
            onChange={(e) => setContactMethod(e.target.value)}
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
          {contactMethod === "email" ? (
            <input
              type="email"
              className={`w-full text-sm pb:text-base pb:w-96 h-10 p-2 border-[1px] ${
                fieldError ? "border-red-400" : "focus:border-gtGold"
              } focus:outline-none bg-mainTheme text-white rounded-lg`}
              placeholder="Enter your preferred email"
              onChange={handleContactInfo}
            />
          ) : (
            <input
              type="tel"
              className={`w-full text-sm pb:text-base pb:w-96 h-10 p-2 border-[1px] ${
                fieldError ? "border-red-400" : "focus:border-gtGold"
              } focus:outline-none bg-mainTheme text-white rounded-lg`}
              placeholder="Enter your phone number"
              onChange={handleContactInfo}
            />
          )}
        </div>
        <label htmlFor="reasoning" className="text-white">
          Please provide valid reasoning that this is your item.
        </label>
        <textarea
          maxLength={250}
          onChange={handleChange}
          name="reasoning"
          className="w-full h-64 resize-none border-[1px] focus:border-gtGold focus:outline-none bg-mainTheme text-white rounded-lg p-4"
        ></textarea>
        <p className="text-white text-xs self-end">{characterCount}/250</p>
        <button
          disabled={!completedForm()}
          onClick={claimDisplayedItem}
          className={`flex disabled:bg-gray-700 disabled:text-gray-400 w-36 h-10 absolute bottom-4 right-4 text-xs rounded-lg border-[1px] items-center justify-center bg-gtGold text-white hover:bg-gtGoldHover`}
        >
          Submit Request
        </button>
      </div>
    ),

    notSignedIn: (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
        <h1>Sign in to claim this item.</h1>
        <Link
          href="/login"
          className="flex h-10 text-sm duration-300 p-4 items-center justify-center bg-gtGold text-white rounded-lg hover:bg-gtGoldHover"
        >
          Sign in
        </Link>
      </div>
    ),

    claimed: (
      <div className="flex flex-col gap-2 h-full w-full items-center justify-center">
        <FaCheck className="text-gtGold text-6xl" />
        <h1 className="text-lg text-gtGold self-center justify-center">
          Request Submitted!
        </h1>
      </div>
    ),

    loading: (
      <div className="flex w-full h-full items-center justify-center">
        <ClipLoader color="#C29B0C" size={65} />
      </div>
    ),

    pinOwner: (
      <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
        <h1 className="text-gtGold text-xl">{`You cannot claim an item you found.`}</h1>
        <Link
          className="flex items-center justify-center w-48 text-sm p-2 bg-gtGold hover:bg-gtGoldHover rounded-lg duration-300 border-[1px] border-gtGoldHover"
          href={`/${username}/myitems/${itemID}`}
        >
          Manage this item
        </Link>
      </div>
    ),
  };

  return (
    <div className="flex flex-col self-start pb:self-center p-4 animate-in fixed gap-4 border-[1px] border-gray-500 w-full h-3/4 tb:w-1/2 tb:h-[70%] rounded-lg bg-mainTheme shaodw-lg z-40">
      {claimStatus !== "loading" ? (
        <div className="flex w-full h-full">
          <Link
            href={path + "?claim=false"}
            className="flex absolute rounded-lg duration-200 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-gtGold text-xl"
          >
            <IoMdClose />
          </Link>
          {user ? componentMap[claimStatus] : componentMap["Sign In to Claim"]}
        </div>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <ClipLoader color="#C29B0C" size={65} />
        </div>
      )}
    </div>
  );
};

export default ClaimItem;
