"use client";
import React, { useEffect, useState } from "react";
import {
  fetchUserRequests,
  fetchUser,
  Pin,
  fetchPin,
  deleteRequest,
} from "@/db/database";
import { AuthError, User } from "@supabase/supabase-js";
import { PinRequest } from "@/db/database";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaFilter } from "react-icons/fa";
import CreateAPin from "./CreateAPin";
import Overlay from "./Overlay";
import RequestPopUp from "./RequestPopUp";

/**
 * Component that displays the user's requests.
 *
 * @returns The MyRequests component that displays the user's requests.
 */
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
    request: PinRequest | undefined,
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
    <div className="flex h-full w-full flex-row gap-4">
      {loading ? (
        <div className="flex h-full w-full flex-wrap gap-4 py-16 pb:pt-0">
          <div className="flex h-48 w-96 flex-col items-center justify-center rounded-lg border-[1px] border-gray-500 bg-mainTheme shadow-lg">
            <div className="h-full w-full animate-pulse rounded-lg bg-mainHover2 duration-300" />
          </div>
          <div className="flex h-48 w-96 flex-col items-center justify-center rounded-lg border-[1px] border-gray-500 bg-mainTheme shadow-lg">
            <div className="h-full w-full animate-pulse rounded-lg bg-mainHover2 duration-300" />
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-wrap gap-4 py-16 pb:pt-0">
          {pins.map((pin) => (
            <div
              key={pin.item_id}
              className={`${
                filterElement(filter, pinToRequests?.get(pin.item_id))
                  ? "flex"
                  : "hidden"
              } h-48 w-96 flex-col justify-between border-gray-500 bg-mainHover ${
                pinToRequests?.get(pin.item_id)?.status === "accepted"
                  ? "cursor-pointer hover:bg-mainHover2"
                  : ""
              } gap-4 rounded-lg border-[1px] border-gray-400 p-4 duration-300`}
              onClick={() => {
                if (pinToRequests?.get(pin.item_id)?.status === "accepted") {
                  setCurrentRequest(pinToRequests?.get(pin.item_id));
                  setViewingRequest(true);
                }
              }}
            >
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <h1 className="text-base font-bold text-gtGold">
                    {pin.item}
                  </h1>
                  <p className="text-xs text-gray-400">{pin.description}</p>
                </div>
                <p
                  className={`text-xs ${decideColor(
                    pinToRequests?.get(pin.item_id)?.status,
                  )}`}
                >
                  {pinToRequests?.get(pin.item_id)?.status}
                </p>
              </div>
              <div className="flex items-end justify-between rounded-lg p-2">
                <h2 className={`text-base`}>
                  {pinToRequests?.get(pin.item_id)?.description}
                </h2>
                {pinToRequests?.get(pin.item_id)?.status === "accepted" ? (
                  <p className="text-xs text-gray-400">
                    {`Click for what's next!`}
                  </p>
                ) : (
                  <button
                    onClick={() => {
                      setAreYouSure(true);
                      setCurrentRequestID(
                        pinToRequests?.get(pin.item_id)?.creator_id +
                          pin.item_id,
                      );
                    }}
                    className="flex items-center justify-center rounded-lg border-[1px] border-red-400 bg-red-500 px-2 py-2 text-xs text-white duration-300 hover:bg-opacity-80"
                  >
                    Delete Request
                  </button>
                )}
              </div>
            </div>
          ))}
          <FilterComponent filter={filter} />
        </div>
      )}
      {viewingRequest && (
        <div className="fixed z-20 flex h-screen w-screen">
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
        <div className="fixed left-0 top-0 z-30 flex h-screen w-screen items-center justify-center">
          <DeleteItemPrompt
            setAreYouSure={setAreYouSure}
            requestID={currentRequestID}
          />
          <Overlay
            on={areYouSure}
            setOn={setAreYouSure}
            zIndex="z-30"
            clear={false}
          />
        </div>
      ) : null}
    </div>
  );
};

/**
 * Component that filters the user's requests.
 *
 * @param filter The current filter.
 * @returns The FilterComponent that filters the user's requests.
 */
const FilterComponent = ({ filter }: { filter: string }) => {
  const [hideOptions, setHideOptions] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const path = usePathname();

  const options = ["All", "Accepted", "Rejected", "Undecided"];

  const handleChange = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <div className="absolute right-8 top-20 flex w-52 flex-col gap-4 self-start rounded-lg border-[1px] border-gray-500 bg-mainHover p-4 text-white duration-300 pb:right-8 pb:top-auto">
      <div className="flex w-full flex-row items-center justify-between gap-2 duration-300">
        <h1 className="text-sm">Filtered by: {filter}</h1>
        <button
          onClick={() => setHideOptions(!hideOptions)}
          className="flex rounded-lg border-[1px] border-gray-500 p-2 duration-300 hover:bg-mainHover2"
        >
          <FaFilter className="text-base text-gtGold" />
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
                } duration-300 hover:text-gtGold`}
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
          } items-center justify-center 
          rounded-lg bg-gtGold p-2 text-sm duration-500 hover:bg-gtGoldHover`}
        >
          Apply
        </Link>
      </div>
    </div>
  );
};

/**
 * Component that prompts the user to delete a request.
 *
 * @param setAreYouSure The function that sets the areYouSure state.
 * @param requestID The ID of the request to delete.
 * @returns The DeleteItemPrompt component that prompts the user to delete a request.
 */
const DeleteItemPrompt = ({
  setAreYouSure,
  requestID,
}: {
  setAreYouSure: Function;
  requestID: string;
}) => {
  const closeButton = (
    <button
      onClick={() => setAreYouSure(false)}
      className="absolute right-2 top-[9px] flex h-8 w-8 items-center justify-center rounded-lg bg-mainHover text-xl text-gray-600 duration-300 hover:text-gtGold"
    >
      <IoMdClose />
    </button>
  );

  return (
    <div className="fixed z-40 flex h-64 w-[90%] flex-col items-center justify-end self-center justify-self-center rounded-lg border-[1px] border-gray-500 bg-mainTheme p-4 text-gtGold tb:w-[450px]">
      {closeButton}
      <div className="flex h-[60%] w-full flex-col justify-between">
        <h1 className="text-center text-base">
          Are you sure you would like to delete this request?
        </h1>
        <div className="flex w-full flex-row gap-4">
          <button
            className="flex w-1/2 items-center justify-center gap-2 rounded-lg border-[1px] border-gray-400 p-2 text-sm duration-300 hover:bg-mainHover2"
            onClick={() => {
              deleteRequest(requestID);
              location.reload();
            }}
          >
            Delete Request
          </button>
          <button
            onClick={() => setAreYouSure(false)}
            className="flex w-1/2 items-center justify-center gap-1 rounded-lg border-[1px] border-gray-400 p-2 text-sm duration-300 hover:bg-mainHover2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
