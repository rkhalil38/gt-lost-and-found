"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ChooseLocation from "./ChooseLocation";
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { AuthApiError, AuthError, User } from "@supabase/supabase-js";
import Link from "next/link";
import { createPin, fetchProfile, fetchUser } from "@/db/database";
import { Pin } from "@/db/database";

type Location = {
  lat: number;
  lng: number;
};

type componentMap = {
  [key: string]: JSX.Element;
};

/*
Create a pin component that allows the users to create a pin on the map
User selects item, gives description, and chooses the location via ChooseLocation component when 
select button is pressed
*/

interface CreateAPinProps {
  apiKey: string;
  toggle: Function;
  lat?: number;
  lng?: number;
}

const CreateAPin = ({ apiKey, toggle, lat, lng }: CreateAPinProps) => {
  const [user, setUser] = useState<User>();
  const [pickLocation, setPickLocation] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [foundItem, setFoundItem] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<Location>({
    lat: lat ? lat : 0,
    lng: lng ? lng : 0,
  });
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [pinCreationStatus, setPinCreationStatus] = useState<string>("loading");
  const [dailyCount, setDailyCount] = useState<number>(0);

  const itemOptions = [
    "iphone",
    "ipad",
    "laptop",
    "buzzcard",
    "android phone",
    "backpack",
    "jacket",
    "miscellaneous",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    const fetchActiveUser = async () => {
      const data = await fetchUser();

      if (data instanceof AuthError) {
        setPinCreationStatus("notSignedIn");
        return;
      }

      if (data === undefined) {
        setPinCreationStatus("notSignedIn");
        return;
      }

      setUser(data);

      const profile = await fetchProfile(data.id);

      if ("message" in profile || profile.username === null) {
        setPinCreationStatus("notSignedIn");
        return;
      }

      setUsername(profile.username);

      if (profile.daily_pin_count >= 5) {
        setPinCreationStatus("exceededDailyLimit");
        return;
      }

      setDailyCount(profile.daily_pin_count)
      setPinCreationStatus("creationEligible");
    };

    fetchActiveUser();
  }, []);

  useEffect(() => {
    setCharacterCount(description.length);
  }, [description]);

  const createNewPin = async () => {
    if (user instanceof AuthError || user === undefined) {
      return;
    }

    const uuid = user.id;
    setPinCreationStatus("loading");

    const pin: Pin = {
      creator_id: uuid,
      user_name: username,
      x_coordinate: location.lat,
      y_coordinate: location.lng,
      item: foundItem,
      description: description,
      claim_requests: null,
      created_at: "",
      item_id: "",
      fts: undefined,
      item_description_username: null,
      resolved: false,
      days_resolved: 0,
    };

    const data = await createPin(pin, user);

    if ("message" in data) {
      setPinCreationStatus("pinCreationFailed");
    } else {
      setPinCreationStatus("pinCreatedSuccessfully");
    }
  };

  const completedForm = () => {
    if (
      foundItem !== "" &&
      description !== "" &&
      location.lat !== 0 &&
      location.lng !== 0
    ) {
      return true;
    }

    return false;
  };

  const componentMap: componentMap = {
    loading: (
      <div className="flex w-full h-full items-center justify-center">
        <ClipLoader color="#C29B0C" size={65} />
      </div>
    ),
    pinCreatedSuccessfully: (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <FaCheck className="text-gtGold text-6xl" />
        <p className="text-white text-xl">{`Pin Created Successfully!`}</p>
      </div>
    ),
    pinCreationFailed: (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <MdCancel className="text-red-500 text-6xl" />
        <p className="text-white text-xl">{`Failed to Create Pin`}</p>
      </div>
    ),
    notSignedIn: (
      <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
        <p className="text-gtGold text-xl">Please sign in to create a pin.</p>
        <Link
          href={"/login"}
          className="flex w-36 h-10 duration-300 text-xs rounded-lg border-[1px] items-center justify-center bg-gtGold text-white hover:bg-gtGoldHover"
        >
          Sign In
        </Link>
      </div>
    ),
    exceededDailyLimit: (
      <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
        <p className="text-gtGold text-xl">
          You have exceeded the daily pin limit.
        </p>
        <Link
          href={`/${username.toLowerCase().replace(" ", "")}/myitems`}
          className="flex w-36 h-10 duration-300 text-xs rounded-lg border-[1px] items-center justify-center bg-gtGold text-white hover:bg-gtGoldHover"
        >
          Manage Pins
        </Link>
      </div>
    ),
    creationEligible: (
      <div className="flex w-full h-full">
        <div
          className={`${
            pickLocation ? "hidden" : "flex"
          } flex-col w-full h-full`}
        >
          <h1 className="text-white pt-4 pb-2 px-4 text-lg">Found Item</h1>
          <div className="flex flex-row px-4 gap-2 overflow-scroll tb:flex-wrap">
            {itemOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => setFoundItem(item)}
                className={`flex text-xs p-2 justify-center items-center rounded-lg border-[1px] border-gray-500 duration-300 hover:text-gtGold hover:border-gtGold ${
                  foundItem === item
                    ? "border-gtGold text-gtGold"
                    : "text-gray-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <label
            htmlFor="description"
            className="text-white px-4 pb-2 pt-4 text-lg"
          >
            Description
          </label>
          <textarea
            onChange={handleChange}
            maxLength={100}
            rows={3}
            cols={50}
            id="description"
            className="text-white text-sm focus:border-gtGold focus:outline-none duration-300 resize-none mx-4 px-4 py-2 bg-mainTheme border-[1px] border-gray-500 rounded-lg"
            placeholder="Describe the item"
          />
          <div className="flex flex-row justify-end px-4">
            <p className="justify-self-end text-gray-400 text-xs">
              {characterCount}/{100}
            </p>
          </div>
          <label
            htmlFor="location"
            className="text-white px-4 pb-2 pt-4 text-lg"
          >
            Location
          </label>
          {location.lat !== 0 && location.lng !== 0 ? (
            <p className="text-sm text-gtGold mx-4 mb-2">
              Location: {location.lat}, {location.lng}
            </p>
          ) : null}
          <button
            onClick={() => setPickLocation(true)}
            className="flex w-36 h-10 mx-4 text-xs justify-center items-center rounded-lg border-[1px] border-gray-500 duration-300 hover:text-gtGold hover:bg-mainHover text-gray-400"
          >
            <FaMapMarkerAlt className="mr-1" />
            {location.lat !== 0 && location.lng !== 0
              ? "Change Location"
              : "Pick Location"}
          </button>
        </div>
        {pickLocation ? (
          <ChooseLocation
            apiKey={apiKey}
            setToggled={setPickLocation}
            setLocation={setLocation}
          />
        ) : null}
        <p className="flex absolute left-4 bottom-4 text-sm text-gtGold">
          { 5 - dailyCount + ' pins left today'}
        </p>
        <button
          disabled={!completedForm()}
          onClick={createNewPin}
          className={`${
            pickLocation ? "hidden" : "flex"
          } disabled:bg-gray-700 disabled:text-gray-400 w-36 h-10 absolute bottom-4 right-4 text-xs rounded-lg border-[1px] items-center justify-center bg-gtGold text-white hover:bg-gtGoldHover`}
        >
          Create Found Item
        </button>
      </div>
    ),
  };

  return (
    <div className="flex flex-col z-30 animate-in fixed top-16 left-0 pb:top-[20%] pb:left-[10%] tb:top-1/4 tb:left-1/4 bg-mainTheme w-full h-[70%] pb:w-[80%] pb:h-1/2 tb:w-1/2 tb:h-1/2 rounded-lg border-[1px]">
      <button
          onClick={() => toggle(false)}
          className="flex absolute rounded-lg duration-300 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-gtGold text-xl"
        >
          <IoMdClose />
        </button>
      {componentMap[pinCreationStatus]}
    </div>
  );
};

export default CreateAPin;
