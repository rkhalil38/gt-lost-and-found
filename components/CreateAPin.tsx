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

interface CreateAPinProps {
  apiKey: string;
  toggle: Function;
  lat?: number;
  lng?: number;
}

/**
 * Component that allows the user to create a pin.
 *
 * @param apiKey The Google Maps API key
 * @param toggle Function that toggles the CreateAPin component
 * @param lat The latitude of the location
 * @param lng The longitude of the location
 * @returns The CreateAPin component that allows the user to create a pin.
 */
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
  const [inPossesion, setInPossesion] = useState<boolean>(false);
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
    "airpods",
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

      setDailyCount(profile.daily_pin_count);
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
      in_posession: inPossesion,
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
      <div className="flex h-full w-full items-center justify-center">
        <ClipLoader color="#C29B0C" size={65} />
      </div>
    ),
    pinCreatedSuccessfully: (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <FaCheck className="text-6xl text-gtGold" />
        <p className="text-xl text-white">{`Pin Created Successfully!`}</p>
      </div>
    ),
    pinCreationFailed: (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <MdCancel className="text-6xl text-red-500" />
        <p className="text-xl text-white">{`Failed to Create Pin`}</p>
      </div>
    ),
    notSignedIn: (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <p className="text-xl text-gtGold">Please sign in to create a pin.</p>
        <Link
          href={"/login"}
          className="flex h-10 w-36 items-center justify-center rounded-lg border-[1px] bg-gtGold text-xs text-white duration-300 hover:bg-gtGoldHover"
        >
          Sign In
        </Link>
      </div>
    ),
    exceededDailyLimit: (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <p className="text-xl text-gtGold">
          You have exceeded the daily pin limit.
        </p>
        <Link
          href={`/${username.toLowerCase().replace(" ", "")}/myitems`}
          className="flex h-10 w-36 items-center justify-center rounded-lg border-[1px] bg-gtGold text-xs text-white duration-300 hover:bg-gtGoldHover"
        >
          Manage Pins
        </Link>
      </div>
    ),
    creationEligible: (
      <div className="flex h-full w-full">
        <div
          className={`${
            pickLocation ? "hidden" : "flex"
          } h-full w-full flex-col justify-between px-4 py-4`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h1 className="pb-2 text-lg text-white">Found Item</h1>
              <div className="flex flex-row gap-2 overflow-scroll tb:flex-wrap">
                {itemOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setFoundItem(item)}
                    className={`flex items-center justify-center rounded-lg border-[1px] border-gray-500 p-2 text-xs duration-300 hover:border-gtGold hover:text-gtGold ${
                      foundItem === item
                        ? "border-gtGold text-gtGold"
                        : "text-gray-400"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="pb-2 text-lg text-white">
                Description
              </label>
              <textarea
                onChange={handleChange}
                maxLength={100}
                rows={3}
                cols={50}
                id="description"
                className="resize-none rounded-lg border-[1px] border-gray-500 bg-mainTheme px-4 py-2 text-sm text-white duration-300 focus:border-gtGold focus:outline-none"
                placeholder="Describe the item"
              />
              <div className="flex flex-row justify-end pt-2">
                <p className="justify-self-end text-xs text-gray-400">
                  {characterCount}/{100}
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="inPossession" className="pb-2 text-lg text-white">
                Are you currently in possession of this item?
              </label>
              <div className="flex flex-row gap-2">
                <button
                  onClick={() => setInPossesion(true)}
                  className={`flex h-8 w-24 items-center justify-center rounded-lg border-[1px] border-gray-500 text-xs text-gray-400 duration-300 ${
                    inPossesion ? "bg-gtGold text-white" : "hover:bg-mainHover hover:text-gtGold"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setInPossesion(false)}
                  className={`flex h-8 w-24 items-center justify-center rounded-lg border-[1px] border-gray-500 text-xs text-gray-400 duration-300 ${
                    !inPossesion ? "bg-gtGold text-white" : "hover:bg-mainHover hover:text-gtGold"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            <div className="flex flex-col pt-4">
              <label htmlFor="location" className="pb-2 text-lg text-white">
                Location
              </label>
              {location.lat !== 0 && location.lng !== 0 ? (
                <p className="pb-2 text-xs pb:text-sm text-gtGold">
                  Location: {location.lat}, {location.lng}
                </p>
              ) : null}
              <button
                onClick={() => setPickLocation(true)}
                className="flex h-10 w-36 items-center justify-center gap-1 rounded-lg border-[1px] border-gray-500 text-xs text-gray-400 duration-300 hover:bg-mainHover hover:text-gtGold"
              >
                <FaMapMarkerAlt />
                {location.lat !== 0 && location.lng !== 0
                  ? "Change Location"
                  : "Pick Location"}
              </button>
            </div>
          </div>
          <div className="flex flex-row w-full items-center justify-between">
            <p className="flex text-sm text-gtGold">
              {5 - dailyCount + " pins left today"}
            </p>
            <button
              disabled={!completedForm()}
              onClick={createNewPin}
              className={`${
                pickLocation ? "hidden" : "flex"
              } h-10 w-36 items-center justify-center rounded-lg border-[1px] bg-gtGold text-xs text-white hover:bg-gtGoldHover disabled:bg-gray-700 disabled:text-gray-400`}
            >
              Create Found Item
            </button>
          </div>
        </div>
        {pickLocation ? (
          <ChooseLocation
            apiKey={apiKey}
            setToggled={setPickLocation}
            setLocation={setLocation}
          />
        ) : null}
      </div>
    ),
  };

  return (
    <div className="animate-in fixed left-0 top-16 z-30 flex h-[80%] w-full flex-col rounded-lg border-[1px] bg-mainTheme pb:left-[10%] pb:top-[20%] pb:h-1/2 pb:w-[80%] tb:left-1/4 tb:top-[15%] tb:h-[70%] tb:w-1/2">
      <button
        onClick={() => toggle(false)}
        className="absolute right-2 top-[9px] flex h-8 w-8 items-center justify-center rounded-lg bg-mainHover text-xl text-gray-600 duration-300 hover:text-gtGold"
      >
        <IoMdClose />
      </button>
      {componentMap[pinCreationStatus]}
    </div>
  );
};

export default CreateAPin;
