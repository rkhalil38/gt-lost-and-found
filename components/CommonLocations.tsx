"use client";
import { CommonLocation, getCommonLocations } from "@/db/database";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { ClipLoader } from "react-spinners";

type componentMap = {
  [key: string]: JSX.Element;
};

const CommonLocations = ({
  apiKey,
  setToggled,
  setLocation,
}: {
  apiKey: string;
  setToggled: Function;
  setLocation: Function;
}) => {
  const [componentState, setComponentState] = useState<string>("loading");
  const [commonLocations, setCommonLocations] = useState<CommonLocation[]>([]);

  useEffect(() => {
    const retrieveCommonLocations = async () => {
      const data = await getCommonLocations();
      if ("message" in data) {
        setComponentState("error");
        return;
      }
      setCommonLocations(data);
      setComponentState("successful");
    };

    retrieveCommonLocations();
  }, []);

  const componentStates: componentMap = {
    loading: (
      <div className="flex h-full w-full items-center justify-center">
        <ClipLoader color="#C29B0C" size={65} />
      </div>
    ),
    error: (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gtGold">
          There was an error retrieving common locations. Please try again.
        </p>
      </div>
    ),
    successful: (
      <div className="flex w-full flex-col p-6">
        <div
          onClick={() => setToggled(false)}
          className="group flex cursor-pointer flex-row items-center text-sm text-gray-400 duration-300 hover:text-gtGold"
        >
          <IoIosArrowBack className="duration-300 group-hover:-translate-x-1" />
          <a>Back to Creation Screen</a>
        </div>
        {commonLocations.map((location) => (
          <div
            key={location.location_id}
            className="flex flex-row justify-between border-b-[1px] py-8"
          >
            <div className="flex flex-col">
              <h1 className="text-sm text-gtGold pb:text-base">
                {location.name}
              </h1>
              <p className="text-xxs text-gray-400 pb:text-xs">
                {location.address}
              </p>
            </div>
            <button
              className="flex h-10 w-20 items-center justify-center rounded-lg border-[1px] border-gtGold bg-gtGoldHover text-xs text-white duration-300 hover:opacity-70 pb:w-32"
              onClick={() => {
                setLocation({
                  lat: location.x_coordinate,
                  lng: location.y_coordinate,
                });
                setToggled(false);
              }}
            >
              Select
            </button>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div className="animate-in absolute flex h-full w-full overflow-y-scroll rounded-lg bg-mainTheme">
      {componentStates[componentState]}
    </div>
  );
};

export default CommonLocations;
