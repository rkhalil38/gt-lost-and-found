"use client";
import React, { useEffect, useState } from "react";
import { FaCheck, FaMapMarkerAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ChooseLocation from "./ChooseLocation";
import { ClipLoader } from "react-spinners";
import { updatePin } from "@/db/database";
import { MdCancel } from "react-icons/md";

type componentMap = {
  [key: string]: JSX.Element;
};

type Location = {
  lat: number;
  lng: number;
};

/**
 * Component that allows the user to edit a pin.
 *
 * @param apiKey The Google Maps API key
 * @param itemID The ID of the item
 * @param item The item that was found
 * @param oldDescription The old description of the item
 * @param x_coordinate The x-coordinate of the location
 * @param y_coordinate The y-coordinate of the location
 * @param setEditItem Function that toggles the EditItem component
 * @returns The EditItem component that allows the user to edit a pin.
 */
const EditItem = ({
  apiKey,
  itemID,
  item,
  oldDescription,
  x_coordinate,
  y_coordinate,
  setEditItem,
}: {
  apiKey: string;
  itemID: string;
  item: string;
  oldDescription: string;
  x_coordinate: number;
  y_coordinate: number;
  setEditItem: Function;
}) => {
  const [pickLocation, setPickLocation] = useState<boolean>(false);
  const [foundItem, setFoundItem] = useState<string>(item);
  const [description, setDescription] = useState<string>(oldDescription);
  const [characterCount, setCharacterCount] = useState<number>(
    oldDescription.length,
  );
  const [location, setLocation] = useState<Location>({
    lat: x_coordinate,
    lng: y_coordinate,
  });
  const [editCreationStatus, setEditCreationStatus] =
    useState<string>("editEligible");

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

  useEffect(() => {
    setCharacterCount(description.length);
  }, [description]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleUpdate = async () => {
    setEditCreationStatus("loading");
    const data = await updatePin(
      itemID,
      foundItem,
      description,
      location.lat,
      location.lng,
    );

    if ("message" in data) {
      setEditCreationStatus("editCreationFailed");
      return;
    }

    setEditCreationStatus("editCreationSuccessful");
  };

  const completedForm = () => {
    if (
      (foundItem !== "" && foundItem !== item) ||
      (description !== "" && oldDescription !== description) ||
      (location.lat !== 0 && location.lat !== x_coordinate) ||
      (location.lng !== 0 && location.lng !== y_coordinate)
    ) {
      return true;
    }

    return false;
  };

  const componentMap: componentMap = {
    editEligible: (
      <div className="flex h-full w-full">
        <div
          className={`${
            pickLocation ? "hidden" : "flex"
          } h-full w-full flex-col`}
        >
          <h1 className="px-4 pb-2 pt-4 text-lg text-white">Found Item</h1>
          <div className="flex flex-row gap-2 overflow-scroll px-4 tb:flex-wrap">
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
          <label
            htmlFor="description"
            className="px-4 pb-2 pt-4 text-lg text-white"
          >
            Description
          </label>
          <textarea
            onChange={handleChange}
            maxLength={100}
            rows={3}
            cols={50}
            id="description"
            className="mx-4 resize-none rounded-lg border-[1px] border-gray-500 bg-mainTheme px-4 py-2 text-sm text-white duration-300 focus:border-gtGold focus:outline-none"
            placeholder={oldDescription}
          />
          <div className="flex flex-row justify-end px-4">
            <p className="justify-self-end text-xs text-gray-400">
              {characterCount}/{100}
            </p>
          </div>
          <label
            htmlFor="location"
            className="px-4 pb-2 pt-4 text-lg text-white"
          >
            Location
          </label>
          {location.lat !== 0 && location.lng !== 0 ? (
            <p className="mx-4 mb-2 text-sm text-gtGold">
              Location: {location.lat}, {location.lng}
            </p>
          ) : null}
          <button
            onClick={() => setPickLocation(true)}
            className="mx-4 flex h-10 w-36 items-center justify-center rounded-lg border-[1px] border-gray-500 text-xs text-gray-400 duration-300 hover:bg-mainHover hover:text-gtGold"
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
        <button
          disabled={!completedForm()}
          onClick={handleUpdate}
          className={`${
            pickLocation ? "hidden" : "flex"
          } absolute bottom-4 right-4 h-10 w-36 items-center justify-center rounded-lg border-[1px] bg-gtGold text-xs text-white hover:bg-gtGoldHover disabled:bg-gray-700 disabled:text-gray-400`}
        >
          Update Item
        </button>
      </div>
    ),
    editCreationSuccessful: (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <FaCheck className="text-6xl text-gtGold" />
        <p className="text-xl text-white">{`Pin Updated Successfully!`}</p>
      </div>
    ),
    editCreationFailed: (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <MdCancel className="text-6xl text-red-500" />
        <p className="text-xl text-white">{`Failed to Update Pin`}</p>
      </div>
    ),
    loading: (
      <div className="flex h-full w-full items-center justify-center">
        <ClipLoader color="#C29B0C" size={65} />
      </div>
    ),
  };

  return (
    <div className="animate-in fixed left-0 top-16 z-30 flex h-[70%] w-full flex-col rounded-lg border-[1px] bg-mainTheme pb:left-[10%] pb:top-[20%] pb:h-1/2 pb:w-[80%] tb:left-1/4 tb:top-1/4 tb:h-1/2 tb:w-1/2">
      <button
        onClick={() => setEditItem(false)}
        className="absolute right-2 top-[9px] flex h-8 w-8 items-center justify-center rounded-lg bg-mainHover text-xl text-gray-600 duration-300 hover:text-gtGold"
      >
        <IoMdClose />
      </button>
      {componentMap[editCreationStatus]}
    </div>
  );
};

export default EditItem;
