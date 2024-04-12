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
    oldDescription.length
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
      location.lng
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
            placeholder={oldDescription}
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
        <button
          disabled={!completedForm()}
          onClick={handleUpdate}
          className={`${
            pickLocation ? "hidden" : "flex"
          } disabled:bg-gray-700 disabled:text-gray-400 w-36 h-10 absolute bottom-4 right-4 text-xs rounded-lg border-[1px] items-center justify-center bg-gtGold text-white hover:bg-gtGoldHover`}
        >
          Update Item
        </button>
      </div>
    ),
    editCreationSuccessful: (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <FaCheck className="text-gtGold text-6xl" />
        <p className="text-white text-xl">{`Pin Updated Successfully!`}</p>
      </div>
    ),
    editCreationFailed: (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <MdCancel className="text-red-500 text-6xl" />
        <p className="text-white text-xl">{`Failed to Update Pin`}</p>
      </div>
    ),
    loading: (
      <div className="flex w-full h-full items-center justify-center">
        <ClipLoader color="#C29B0C" size={65} />
      </div>
    ),
  };

  return (
    <div className="flex flex-col z-30 animate-in fixed top-16 left-0 pb:top-[20%] pb:left-[10%] tb:top-1/4 tb:left-1/4 bg-mainTheme w-full h-[70%] pb:w-[80%] pb:h-1/2 tb:w-1/2 tb:h-1/2 rounded-lg border-[1px]">
      <button
        onClick={() => setEditItem(false)}
        className="flex absolute rounded-lg duration-300 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-gtGold text-xl"
      >
        <IoMdClose />
      </button>
      {componentMap[editCreationStatus]}
    </div>
  );
};

export default EditItem;
