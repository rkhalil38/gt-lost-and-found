"use client";
import React, { useEffect, useState } from "react";
import { fetchUserRequests, fetchUser, Pin, fetchPin, deleteRequest } from "@/db/database";
import { AuthError, User } from "@supabase/supabase-js";
import { PinRequest } from "@/db/database";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaFilter } from "react-icons/fa";
import CreateAPin from "./CreateAPin";
import Overlay from "./Overlay";
import RequestPopUp from "./RequestPopUp";

const MyRequests = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [pinToRequests, setPinToRequests] = useState<Map<string, PinRequest>>();
  const [user, setUser] = useState<User>();
  const [viewingRequest, setViewingRequest] = useState<boolean>(false);
  const [currentRequest, setCurrentRequest] = useState<PinRequest>();
  const [loading, setLoading] = useState<boolean>(true);
  const [areYouSure, setAreYouSure] = useState<boolean>(false);
  const [currentRequestID, setCurrentRequestID] = useState<string>("");

  const params = useSearchParams();
  const filter = params.get("filter") || "all";

  useEffect(() => {
    const getUserPinsAndRequests = async () => {
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

      let userPins: Pin[] = [];

      for (const request of userRequests) {
        const pin = await fetchPin(request.item_id ? request.item_id : "");

        if ("message" in pin) {
          return;
        }

        userPins.push(pin);
      }

      let pinRequests = new Map<string, PinRequest>();

      for (let i = 0; i < userPins.length; i++) {
        pinRequests.set(userPins[i].item_id, userRequests[i]);
      }

      setPins(userPins);
      setPinToRequests(pinRequests);
      setLoading(false);
    };

    getUserPinsAndRequests();
  }, []);

  const filterElement = (
    filter: string,
    request: PinRequest | undefined
  ): boolean => {
    if (!request) {
      return false;
    }

    switch (filter) {
      case "accepted":
        return request.status === "accepted";
      case "rejected":
        return request.status === "rejected";
      case "undecided":
        return request.status === "undecided";
      default:
        return true;
    }
  };

  const decideColor = (status: string | undefined) => {
    if (status === "undecided") {
      return "text-gray-400";
    } else if (status === "accepted") {
      return "text-green-400";
    } else {
      return "text-red-400";
    }
  };

  return (
    <div className="flex flex-row gap-4 w-full h-full">
      {loading ? (
        <div className="flex flex-wrap gap-4 w-full h-full py-16 pb:pt-0">
          <div className="flex flex-col bg-mainTheme border-[1px] border-gray-500 items-center justify-center w-96 h-48 shadow-lg rounded-lg">
            <div className="w-full h-full duration-300 rounded-lg bg-mainHover2 animate-pulse" />
          </div>
          <div className="flex flex-col bg-mainTheme border-[1px] border-gray-500 items-center justify-center w-96 h-48 shadow-lg rounded-lg">
            <div className="w-full h-full duration-300 rounded-lg bg-mainHover2 animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 w-full h-full py-16 pb:pt-0">
          {pins.map((pin) => (
            <div
              key={pin.item_id}
              className={`${
                filterElement(filter, pinToRequests?.get(pin.item_id))
                  ? "flex"
                  : "hidden"
              } flex-col justify-between w-96 h-48 bg-mainHover border-gray-500 ${
                pinToRequests?.get(pin.item_id)?.status === "accepted"
                  ? "hover:bg-mainHover2 cursor-pointer"
                  : ""
              } duration-300 border-[1px] border-gray-400 rounded-lg p-4 gap-4`}
              onClick={() => {
                if (pinToRequests?.get(pin.item_id)?.status === "accepted") {
                  setCurrentRequest(pinToRequests?.get(pin.item_id));
                  setViewingRequest(true);
                }
              }}
            >
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <h1 className="text-base text-gtGold font-bold">
                    {pin.item}
                  </h1>
                  <p className="text-xs text-gray-400">{pin.description}</p>
                </div>
                <p
                  className={`text-xs ${decideColor(
                    pinToRequests?.get(pin.item_id)?.status
                  )}`}
                >
                  {pinToRequests?.get(pin.item_id)?.status}
                </p>
              </div>
              <div className="flex items-end justify-between p-2 rounded-lg">
                <h2 className={`text-base`}>
                  {pinToRequests?.get(pin.item_id)?.description}
                </h2>
                {pinToRequests?.get(pin.item_id)?.status === "accepted" ? (
                  <p className="text-xs text-gray-400">
                    Click for what's next!
                  </p>
                )
                :
                (
                  <button onClick={() => {
                    setAreYouSure(true)
                    setCurrentRequestID(pinToRequests?.get(pin.item_id)?.creator_id + pin.item_id)
                    }} 
                    className="flex items-center justify-center duration-300 rounded-lg px-2 py-2 text-xs text-white border-[1px] border-red-400 bg-red-500 hover:bg-opacity-80">
                    Delete Request
                  </button>
                )
                }
              </div>
            </div>
          ))}
          <FilterComponent filter={filter} />
        </div>
      )}
      {viewingRequest && (
        <div className="flex fixed z-20 h-screen w-screen">
          <RequestPopUp
            itemOwnerID={
              currentRequest?.pin_creator_id
                ? currentRequest.pin_creator_id
                : ""
            }
            toggle={setViewingRequest}
          />
          <Overlay
            zIndex="z-20"
            on={viewingRequest}
            setOn={setViewingRequest}
            clear={false}
          />
        </div>
      )}
      {areYouSure ? (
        <div className="flex fixed items-center justify-center z-30 top-0 left-0 w-screen h-screen">
          <DeleteItemPrompt setAreYouSure={setAreYouSure} requestID={currentRequestID} />
          <Overlay on={areYouSure} setOn={setAreYouSure} zIndex="z-30" clear={false}/>
        </div>
      ) : null}
    </div>
  );
};

const FilterComponent = ({ filter }: { filter: string }) => {
  const [hideOptions, setHideOptions] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const path = usePathname();

  const options = ["All", "Accepted", "Rejected", "Undecided"];

  const handleChange = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <div className="flex flex-col duration-300 top-20 pb:top-auto right-8 pb:right-8 absolute text-white self-start p-4 gap-4 w-52 rounded-lg bg-mainHover border-[1px] border-gray-500">
      <div className="flex flex-row w-full items-center justify-between gap-2 duration-300">
        <h1 className="text-sm">Filtered by: {filter}</h1>
        <button
          onClick={() => setHideOptions(!hideOptions)}
          className="flex p-2 rounded-lg border-gray-500 border-[1px] hover:bg-mainHover2 duration-300"
        >
          <FaFilter className="text-gtGold text-base" />
        </button>
      </div>
      <div className={`${hideOptions ? "hidden" : "flex"} flex-col gap-2`}>
        <ol>
          {options.map((option) => (
            <li key={option} className="flex flex-row items-center gap-2">
              <button
                onClick={() => handleChange(option)}
                className={`${
                  selectedFilter === option ? "text-gtGold" : "text-white"
                } hover:text-gtGold duration-300`}
              >
                {option}
              </button>
            </li>
          ))}
        </ol>
        <Link
          href={`${path}?filter=${selectedFilter.toLowerCase()}`}
          onClick={() => {
            setHideOptions(true);
          }}
          className={`${
            hideOptions ? "hidden" : "flex"
          } bg-gtGold hover:bg-gtGoldHover 
          text-sm duration-500 rounded-lg items-center justify-center p-2`}
        >
          Apply
        </Link>
      </div>
    </div>
  );
};

const DeleteItemPrompt = ({setAreYouSure, requestID} : {setAreYouSure: Function, requestID: string}) => {

  const closeButton = (
    <button
      onClick={() => setAreYouSure(false)}
      className="flex absolute rounded-lg duration-300 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-gtGold text-xl"
    >
      <IoMdClose />
    </button>
  );

  return (
    <div className="flex text-gtGold items-center justify-end p-4 flex-col fixed self-center z-40 justify-self-center rounded-lg border-[1px] border-gray-500 w-[90%] tb:w-[450px] h-64 bg-mainTheme">
        {closeButton}
        <div className="flex flex-col justify-between w-full h-[60%]">
          <h1 className="text-base text-center">
            Are you sure you would like to delete this request? 
          </h1>
          <div className="flex flex-row gap-4 w-full">
            <button
              className="flex w-1/2 duration-300 items-center justify-center gap-2 rounded-lg hover:bg-mainHover2 text-sm p-2 border-[1px] border-gray-400"
              onClick={() => {
                deleteRequest(requestID)
                location.reload()
              }}
            >
              Delete Request
            </button>
            <button
              onClick={() => setAreYouSure(false)}
              className="flex w-1/2 duration-300 items-center justify-center gap-1 rounded-lg hover:bg-mainHover2 text-sm p-2 border-[1px] border-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
  );
}

export default MyRequests;
