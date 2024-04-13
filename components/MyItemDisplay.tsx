"use client";
import { Database } from "@/supabase";
import React, { use, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import Overlay from "./Overlay";
import { AuthError } from "@supabase/supabase-js";
import {
  acceptClaim,
  fetchPin,
  fetchRequests,
  fetchUser,
  fetchUserItems,
  fetchProfile,
  rejectClaim,
  deletePin,
} from "@/db/database";
import { ClipLoader } from "react-spinners";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import EditItem from "./EditItem";

type Pin = Database["public"]["Tables"]["pins"]["Row"];
type PinRequest = Database["public"]["Tables"]["requests"]["Row"];
type ComponentMap = {
  [key: string]: JSX.Element;
};
type requestStatus = {
  [key: string]: any;
};

/**
 * Component that displays the user's found item.
 *
 * @param apiKey The Google Maps API key
 * @returns The MyItemDisplay component that displays the user's found item.
 */
const MyItemDisplay = ({ apiKey }: { apiKey: string }) => {
  const [myItem, setMyItem] = useState<Pin>();
  const [requests, setRequests] = useState<PinRequest[]>();
  const [itemID, setItemID] = useState<string>("");
  const [getRequests, setGetRequests] = useState<boolean>(false);
  const [currentRequest, setCurrentRequest] = useState<PinRequest>();
  const [username, setUserName] = useState<string | null>();
  const supabase = createClient();

  useEffect(() => {
    const fetchComponentData = async () => {
      const data = await fetchUser();
      const itemID = window.location.pathname.split("/")[3];
      setItemID(itemID);

      if (data instanceof AuthError || "message" in data) {
        return;
      }

      const items = await fetchUserItems(data);

      if ("message" in items) {
        return;
      }

      setMyItem(items[0]);
      setGetRequests(true);

      const profile = await fetchProfile(data.id);

      if ("message" in profile || profile.username === null) {
        return;
      }

      setUserName(profile.username);
    };

    fetchComponentData();
  }, []);

  useEffect(() => {
    const fetchPinRequests = async () => {
      const data = await fetchRequests(itemID);

      if ("message" in data) {
        return;
      }

      setRequests(data);
    };

    fetchPinRequests();
  }, [getRequests]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "requests" },
        (payload) =>
          replaceOldRequest(
            payload.new as Database["public"]["Tables"]["requests"]["Row"],
          ),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setRequests, requests]);

  const replaceOldRequest = (request: PinRequest) => {
    const newRequests = requests?.map((req) => {
      if (req.request_id === request.request_id) {
        return request;
      }

      return req;
    });

    setRequests(newRequests);
    setCurrentRequest(request);
  };

  const requestStatus: requestStatus = {
    undecided: "border-gray-500",
    accepted: "border-green-400 text-white",
    rejected: "border-red-400 text-white",
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 py-28 text-gtGold tb:flex-row tb:pt-0">
      <div className="flex h-3/4 w-[80%] flex-col items-center gap-4 rounded-lg tb:w-[40%]">
        <ItemDisplay
          apiKey={apiKey}
          itemID={itemID}
          username={username ? username : ""}
        />
        <div className="flex h-1/2 w-full flex-row gap-4 overflow-x-scroll rounded-lg tb:flex-col tb:items-center tb:overflow-y-scroll">
          {requests ? (
            requests?.map((request) => (
              <button
                onClick={() => setCurrentRequest(request)}
                key={request.request_id}
                className={`group flex h-28 w-full cursor-pointer flex-row justify-between border-[1px] bg-mainHover hover:bg-mainHover2 ${
                  requestStatus[request.status]
                } gap-4 rounded-lg p-4 duration-300`}
              >
                <div className="flex w-[60%] flex-col items-start gap-1">
                  <p className="text-sm">{request.creator_name}</p>
                  <p className="h-12 overflow-clip text-start text-xs text-gray-400">
                    {request.description}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <IoIosArrowBack className="rotate-180 text-gray-500 duration-300 group-hover:translate-x-1 group-hover:text-white" />
                  <p className="text-xs text-gray-400">
                    {request.created_at.substring(0, 10)}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="group flex h-28 w-full flex-row justify-between rounded-lg border-[1px] border-gray-500 bg-mainTheme">
              <div className="h-full w-full animate-pulse rounded-lg bg-mainHover" />
            </div>
          )}
        </div>
      </div>
      <CurrentRequestDock
        creator={currentRequest ? currentRequest.creator_name : ""}
        description={currentRequest ? currentRequest.description : ""}
        itemID={currentRequest ? currentRequest.item_id : ""}
        creatorID={currentRequest ? currentRequest.creator_id : ""}
        status={currentRequest ? currentRequest.status : ""}
        contact={currentRequest ? currentRequest.contact : ""}
      />
    </div>
  );
};

/**
 * Component that displays the current request dock.
 *
 * @param creator The name of the creator of the request
 * @param description The description of the request
 * @param itemID The ID of the item associated with the request
 * @param creatorID The ID of the creator of the request
 * @param status The status of the request
 * @param contact The contact information of the creator of the request
 * @returns The CurrentRequestDock component that displays the current request dock.
 */
const CurrentRequestDock = ({
  creator,
  description,
  itemID,
  creatorID,
  status,
  contact,
}: {
  creator: string | null;
  description: string | null;
  itemID: string | null;
  creatorID: string | null;
  status: string;
  contact: string | null;
}) => {
  const [areYouSure, setAreYouSure] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");

  const handleAcceptButton = () => {
    setAreYouSure(true);
    setAction("accept");
  };

  const handleRejectButton = () => {
    setAreYouSure(true);
    setAction("reject");
  };

  const requestStatus: requestStatus = {
    accepted: <h1 className="text-xs text-green-400">Claim Accepted</h1>,
    rejected: <h1 className="text-xs text-red-400">Claim Rejected</h1>,
  };

  return (
    <div className="flex h-3/4 w-[80%] flex-col justify-between rounded-lg border-[1px] border-gray-500 bg-mainHover tb:w-1/4">
      {areYouSure ? (
        <div className="fixed left-0 top-0 z-30 flex h-screen w-screen items-center justify-center">
          <AreYouSure
            setAreYouSure={setAreYouSure}
            action={action}
            status={status}
            itemID={itemID}
            creatorID={creatorID}
          />
          <Overlay
            on={areYouSure}
            setOn={setAreYouSure}
            zIndex="z-30"
            clear={false}
          />
        </div>
      ) : null}

      {creator ? (
        <div className="m-4 flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold">{creator}</h1>
              <p className="text-xs text-gray-400">{contact}</p>
            </div>
            {status !== "undecided" && requestStatus[status]}
          </div>
          <p className="text-base text-white">{description}</p>
        </div>
      ) : null}

      {creator ? (
        <div className="flex w-full flex-row">
          <button
            disabled={status !== "undecided"}
            onClick={handleAcceptButton}
            className={`flex w-1/2 items-center justify-center ${
              status !== "undecided"
                ? "bg-gray-700 text-gray-500"
                : "hover:bg-green-400 hover:text-white"
            } gap-2 rounded-bl-lg border-r-[1px] border-t-[1px] border-gray-400 p-4 text-sm duration-300`}
          >
            <FaCheck />
            Accept Claim
          </button>
          <button
            disabled={status !== "undecided"}
            onClick={handleRejectButton}
            className={`flex w-1/2 items-center justify-center ${
              status !== "undecided"
                ? "bg-gray-700 text-gray-500"
                : "hover:bg-red-400 hover:text-white"
            } gap-1 rounded-br-lg border-t-[1px] border-gray-400 p-4 text-sm duration-300`}
          >
            <IoClose className="text-lg" />
            Reject Claim
          </button>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <h1>Select a request to get started.</h1>
        </div>
      )}
    </div>
  );
};

const ItemDisplay = ({
  apiKey,
  itemID,
  username,
}: {
  apiKey: string;
  itemID: string;
  username: string;
}) => {
  const [item, setItem] = useState<Pin>();
  const [areYouSure, setAreYouSure] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<boolean>(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchItem = async () => {
      const data = await fetchPin(itemID);

      if ("message" in data) {
        return;
      }

      setItem(data);
    };

    fetchItem();
  }, [itemID]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-pins")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pins" },
        (payload) =>
          setItem(payload.new as Database["public"]["Tables"]["pins"]["Row"]),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setItem, item]);

  return (
    <div className="flex h-1/2 w-full flex-col justify-between gap-2 rounded-lg border-[1px] border-gray-500 bg-mainHover p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">
            {item?.item || (
              <Skeleton height={20} width={120} baseColor="#B3A369" />
            )}
          </h1>
          <p className="text-xs text-gray-400">
            {item?.description || (
              <Skeleton height={15} width={150} baseColor="#B3A369" />
            )}
          </p>
        </div>
        {item?.resolved && (
          <div className="flex w-44 flex-row items-center justify-end gap-2 self-start text-xl font-semibold text-green-400">
            <FaCheck />
            Owner Found
          </div>
        )}
      </div>
      <div className="flex w-full flex-row justify-between">
        <h1 className="flex flex-row items-center gap-2 text-xs">
          {item?.claim_requests != null ? (
            item?.claim_requests
          ) : (
            <Skeleton height={20} width={20} baseColor="#B3A369" />
          )}{" "}
          claim requests
        </h1>
        <div className="flex flex-row gap-2">
          <button
            onClick={() => setEditItem(true)}
            className="flex items-center justify-center rounded-lg border-[1px] border-gray-500 bg-mainHover2 px-2 py-2 text-xs text-gtGold duration-300 hover:bg-opacity-60 pb:px-4"
          >
            Edit Item
          </button>
          <button
            onClick={() => setAreYouSure(true)}
            className="flex items-center justify-center rounded-lg border-[1px] border-red-400 bg-red-500 px-2 py-2 text-xs text-white duration-300 hover:bg-opacity-80 pb:px-4"
          >
            Delete Item
          </button>
        </div>
      </div>
      {areYouSure ? (
        <div className="fixed left-0 top-0 z-30 flex h-screen w-screen items-center justify-center">
          <DeleteItemPrompt
            setAreYouSure={setAreYouSure}
            itemID={itemID}
            username={username}
          />
          <Overlay
            on={areYouSure}
            setOn={setAreYouSure}
            zIndex="z-30"
            clear={false}
          />
        </div>
      ) : null}
      {editItem ? (
        <div className="fixed left-0 top-0 z-30 flex h-screen w-screen items-center justify-center">
          <EditItem
            apiKey={apiKey}
            itemID={itemID}
            item={item?.item ? item?.item : ""}
            oldDescription={item?.description ? item?.description : ""}
            x_coordinate={item?.x_coordinate ? item?.x_coordinate : 0}
            y_coordinate={item?.y_coordinate ? item?.y_coordinate : 0}
            setEditItem={setEditItem}
          />
          <Overlay
            on={editItem}
            setOn={setEditItem}
            zIndex="z-20"
            clear={false}
          />
        </div>
      ) : null}
    </div>
  );
};

/**
 * Component that displays the AreYouSure prompt.
 *
 * @param setAreYouSure The function to set the AreYouSure state
 * @param action The action to be taken
 * @param status The status of the action
 * @param itemID The ID of the item
 * @param creatorID The ID of the creator of the item
 * @returns The AreYouSure component that displays the AreYouSure prompt.
 */
const AreYouSure = ({
  setAreYouSure,
  action,
  status,
  itemID,
  creatorID,
}: {
  setAreYouSure: Function;
  action: string;
  status: string;
  itemID: string | null;
  creatorID: string | null;
}) => {
  const [decisionState, setDecisionState] = useState<string>("false");

  const acceptThisClaim = async (): Promise<void> => {
    setDecisionState("loading");
    const data = await acceptClaim(
      creatorID ? creatorID : "",
      itemID ? itemID : "",
    );
    console.log(data);
    setDecisionState("true");
  };

  const rejectThisClaim = async (): Promise<void> => {
    setDecisionState("loading");
    const data = await rejectClaim(
      creatorID ? creatorID : "",
      itemID ? itemID : "",
    );
    console.log(data);
    setDecisionState("true");
  };

  const closeButton = (
    <button
      onClick={() => setAreYouSure(false)}
      className="absolute right-2 top-[9px] flex h-8 w-8 items-center justify-center rounded-lg bg-mainHover text-xl text-gray-600 duration-300 hover:text-gtGold"
    >
      <IoMdClose />
    </button>
  );

  const activeComponent: ComponentMap = {
    true: (
      <div className="fixed z-40 flex h-64 w-[450px] flex-col items-center justify-center self-center justify-self-center rounded-lg border-[1px] border-gray-500 bg-mainTheme">
        {closeButton}
        <FaCheck className="text-6xl text-green-400" />
        <h1 className="text-center text-base font-semibold text-green-400">
          Claim {action}ed successfully!
        </h1>
      </div>
    ),

    loading: (
      <div className="fixed z-40 flex h-64 w-[450px] flex-col items-center justify-center self-center justify-self-center rounded-lg border-[1px] border-gray-500 bg-mainTheme">
        {closeButton}
        <ClipLoader color="#B3A369" size={50} />
      </div>
    ),

    false: (
      <div className="fixed z-40 flex h-64 w-[90%] flex-col items-center justify-between self-center justify-self-center rounded-lg border-[1px] border-gray-500 bg-mainTheme p-4 tb:w-[450px]">
        {closeButton}
        <div className="h-6 w-full" />
        {action === "accept" ? (
          <h1 className="text-center text-base">
            Are you sure you would like to {action} this claim? All other claims
            will be rejected.
          </h1>
        ) : (
          <h1 className="text-center text-base">
            Are you sure you would like to {action} this claim?
          </h1>
        )}
        <div className="flex w-full flex-row gap-4">
          <button
            className="flex w-1/2 items-center justify-center gap-2 rounded-lg border-[1px] border-gray-400 p-2 text-sm duration-300 hover:bg-mainHover2"
            onClick={action === "accept" ? acceptThisClaim : rejectThisClaim}
          >
            {action.toUpperCase().slice(0, 1) + action.slice(1)} Claim
          </button>
          <button
            onClick={() => setAreYouSure(false)}
            className="flex w-1/2 items-center justify-center gap-1 rounded-lg border-[1px] border-gray-400 p-2 text-sm duration-300 hover:bg-mainHover2"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
  };

  return activeComponent[decisionState];
};

/**
 * Component that displays the DeleteItemPrompt.
 *
 * @param setAreYouSure The function to set the AreYouSure state
 * @param itemID The ID of the item
 * @param username The username of the user
 * @returns The DeleteItemPrompt component that displays the DeleteItemPrompt.
 */
const DeleteItemPrompt = ({
  setAreYouSure,
  itemID,
  username,
}: {
  setAreYouSure: Function;
  itemID: string;
  username: string;
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
    <div className="fixed z-40 flex h-64 w-[90%] flex-col items-center justify-end self-center justify-self-center rounded-lg border-[1px] border-gray-500 bg-mainTheme p-4 tb:w-[450px]">
      {closeButton}
      <div className="flex h-[65%] w-full flex-col justify-between">
        <h1 className="text-center text-base">
          Are you sure you would like to delete this item? All claims associated
          with the item will be deleted as well.
        </h1>
        <div className="flex w-full flex-row gap-4">
          <Link
            className="flex w-1/2 items-center justify-center gap-2 rounded-lg border-[1px] border-gray-400 p-2 text-sm duration-300 hover:bg-mainHover2"
            onClick={() => deletePin(itemID)}
            href={`/${username.toLowerCase().replace(" ", "")}/myitems`}
          >
            Delete Item
          </Link>
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

export default MyItemDisplay;
