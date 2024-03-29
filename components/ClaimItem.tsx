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

      if (data instanceof AuthError || "message" in data) {
        console.log(data);
        return;
      }

      setActiveUser(data);
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
      setClaimStatus("Claim Item");
      return;
    }

    const claim = await claimItem(claimRequest, activeUser, contactInfo);
   
    if ('message' in claim) {
      console.log(claim);
      setClaimStatus("Claim Item");
      return;
    }

    setClaimStatus("Fresh Request Submitted");
  };

  const componentMap: componentMap = {
    "Claim Item": (
      <div className="flex flex-col gap-4 w-full h-full">
        <h1 className="font-bold text-2xl text-gtGold">
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
              className={`w-96 h-10 p-2 border-[1px] ${
                fieldError ? "border-red-400" : "focus:border-gtGold"
              } focus:outline-none bg-mainTheme text-white rounded-lg`}
              placeholder="Enter your preferred email"
              onChange={handleContactInfo}
            />
          ) : (
            <input
              type="tel"
              className={`w-96 h-10 p-2 border-[1px] ${
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
        <p className="text-white text-xs">{characterCount}/250</p>
        <button
          disabled={!completedForm()}
          onClick={claimDisplayedItem}
          className={`flex disabled:bg-gray-700 disabled:text-gray-400 w-36 h-10 absolute bottom-4 right-4 text-xs rounded-lg border-[1px] items-center justify-center bg-gtGold text-white hover:bg-gtGoldHover`}
        >
          Submit Request
        </button>
      </div>
    ),

    "Sign In to Claim": (
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

    "Request Submitted": (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
        <h1>You have already submitted a request for this item.</h1>
        <Link
          href="/lostitems"
          className="flex h-10 text-sm duration-300 p-4 items-center justify-center bg-gtGold text-white rounded-lg hover:bg-gtGoldHover"
        >
          Find another item
        </Link>
      </div>
    ),

    "Fresh Request Submitted": (
      <div className="flex flex-col gap-2 h-full w-full items-center justify-center">
        <FaCheck className="text-gtGold text-6xl" />
        <h1 className="text-lg text-gtGold self-center justify-center">
          Request Submitted!
        </h1>
      </div>
    ),
  };

  return (
    <div className="flex flex-col p-4 animate-in fixed gap-4 border-[1px] border-gray-500 w-1/2 h-[70%] rounded-lg bg-mainTheme shaodw-lg z-40">
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
