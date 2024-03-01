"use client";
import { Database } from "@/supabase";
import React, { useEffect, useState } from "react";
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
  getUserName,
  rejectClaim,
} from "@/db/database";
import { ClipLoader } from "react-spinners";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Pin = Database["public"]["Tables"]["pins"]["Row"];
type PinRequest = Database["public"]["Tables"]["requests"]["Row"];
type ComponentMap = {
  [key: string]: JSX.Element;
};

const MyItemDisplay = () => {
  const [myItem, setMyItem] = useState<Pin>();
  const [requests, setRequests] = useState<PinRequest[]>();
  const [itemID, setItemID] = useState<string>("");
  const [getRequests, setGetRequests] = useState<boolean>(false);
  const [currentRequest, setCurrentRequest] = useState<PinRequest>();
  const [username, setUserName] = useState<string | null>();

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

      const user_name = await getUserName(data);
      setUserName(user_name);
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

  return (
    <div className="flex flex-row gap-4 text-gtGold w-screen h-screen items-center justify-center">
      <div className="flex flex-col gap-4 rounded-lg items-center w-1/4 h-3/4">
        <ItemDisplay itemID={itemID} />
        <div className="flex flex-col overflow-y-scroll gap-4 rounded-lg items-center w-full h-1/2">
          {requests ? (
            requests?.map((request) => (
              <button
                onClick={() => setCurrentRequest(request)}
                key={request.request_id}
                className="flex flex-row group w-full h-28 justify-between border-[1px] p-4 overflow-scroll gap-4 duration-300 cursor-pointer bg-mainHover hover:bg-mainHover2 border-gray-500 rounded-lg"
              >
                <div className="flex flex-col items-start gap-1 w-[60%]">
                  <p className="text-sm">{request.creator_name}</p>
                  <p className="text-xs text-start h-12 overflow-clip text-gray-400">
                    {request.description}
                  </p>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <IoIosArrowBack className="group-hover:text-white group-hover:translate-x-1 text-gray-500 duration-300 rotate-180" />
                  <p className="text-xs text-gray-400">
                    {request.created_at.substring(0, 10)}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-row group w-full h-28 justify-between border-[1px] bg-mainTheme border-gray-500 rounded-lg">
              <div className="w-full h-full rounded-lg animate-pulse bg-mainHover" />
            </div>
          )}
        </div>
      </div>
      <CurrentRequestDock
        creator={currentRequest ? currentRequest.creator_name : ""}
        description={currentRequest ? currentRequest.description : ""}
        itemID={currentRequest ? currentRequest.item_id : ""}
        creatorID={currentRequest ? currentRequest.creator_id : ""}
        date={currentRequest ? currentRequest.created_at.substring(1, 9) : ""}
        contact={currentRequest ? currentRequest.contact : ""}
      />
    </div>
  );
};

const CurrentRequestDock = ({
  creator,
  description,
  itemID,
  creatorID,
  date,
  contact,
}: {
  creator: string | null;
  description: string | null;
  itemID: string | null;
  creatorID: string | null;
  date: string | null;
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

  return (
    <div className="flex flex-col justify-between w-1/4 h-3/4 rounded-lg bg-mainHover border-[1px] border-gray-500">
      {areYouSure ? (
        <div className="flex fixed items-center justify-center z-30 top-0 left-0 w-screen h-screen">
          <AreYouSure
            setAreYouSure={setAreYouSure}
            action={action}
            creator={creator}
            itemID={itemID}
            creatorID={creatorID}
          />
          <Overlay on={areYouSure} zIndex="z-30" />
        </div>
      ) : null}

      {creator ? (
        <div className="flex flex-col gap-4 m-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">{creator}</h1>
            <p className="text-xs text-gray-400">{contact}</p>
          </div>
          <p className="text-base text-white">{description}</p>
        </div>
      ) : null}

      {creator ? (
        <div className="flex flex-row w-full">
          <button
            onClick={handleAcceptButton}
            className="flex w-1/2 items-center justify-center gap-2 rounded-bl-lg duration-100 hover:bg-green-400 hover:text-white text-sm p-4 border-t-[1px] border-r-[1px] border-gray-400"
          >
            <FaCheck />
            Accept Claim
          </button>
          <button
            onClick={handleRejectButton}
            className="flex w-1/2 items-center justify-center gap-1 rounded-br-lg duration-100 hover:bg-red-400 hover:text-white text-sm p-4 border-t-[1px] border-gray-400"
          >
            <IoClose className="text-lg" />
            Reject Claim
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <h1>Select a request to get started.</h1>
        </div>
      )}
    </div>
  );
};

const ItemDisplay = ({ itemID }: { itemID: string }) => {
  const [item, setItem] = useState<Pin>();

  useEffect(() => {
    const fetchItem = async () => {
      const data = await fetchPin(itemID);

      if ("message" in data) {
        console.log(data);
        return;
      }

      setItem(data);
    };

    fetchItem();
  }, [itemID]);

  return (
    <div className="flex flex-col p-4 bg-mainHover rounded-lg border-[1px] border-gray-500 gap-2 w-full h-1/2">
      <h1 className="text-2xl font-semibold">
        {item?.item || <Skeleton height={20} width={120} baseColor="#B3A369" />}
      </h1>
      <p className="text-xs text-gray-400">
        {item?.description || (
          <Skeleton height={15} width={150} baseColor="#B3A369" />
        )}
      </p>
    </div>
  );
};

const AreYouSure = ({
  setAreYouSure,
  action,
  creator,
  itemID,
  creatorID,
}: {
  setAreYouSure: Function;
  action: string;
  creator: string | null;
  itemID: string | null;
  creatorID: string | null;
}) => {
  const [decisionState, setDecisionState] = useState<string>("false");

  const acceptThisClaim = async (): Promise<void> => {
    setDecisionState("loading");
    const data = await acceptClaim(
      creatorID ? creatorID : "",
      itemID ? itemID : ""
    );
    setDecisionState("true");
  };

  const rejectThisClaim = async (): Promise<void> => {
    setDecisionState("loading");
    const data = await rejectClaim(
      creatorID ? creatorID : "",
      itemID ? itemID : ""
    );
    setDecisionState("true");
  };

  const closeButton = (
    <button
      onClick={() => setAreYouSure(false)}
      className="flex absolute rounded-lg duration-100 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-gtGold text-xl"
    >
      <IoMdClose />
    </button>
  );

  const activeComponent: ComponentMap = {
    true: (
      <div className="flex items-center justify-center flex-col fixed self-center z-40 justify-self-center rounded-lg border-[1px] border-gray-500 w-[450px] h-64 bg-mainTheme">
        {closeButton}
        <FaCheck className="text-green-400 text-6xl" />
        <h1 className="text-base text-green-400 font-semibold text-center">
          Claim {action}ed successfully!
        </h1>
      </div>
    ),

    loading: (
      <div className="flex items-center justify-center flex-col fixed self-center z-40 justify-self-center rounded-lg border-[1px] border-gray-500 w-[450px] h-64 bg-mainTheme">
        {closeButton}
        <ClipLoader color="#B3A369" size={50} />
      </div>
    ),

    false: (
      <div className="flex items-center justify-between p-4 flex-col fixed self-center z-40 justify-self-center rounded-lg border-[1px] border-gray-500 w-[450px] h-64 bg-mainTheme">
        {closeButton}
        <div className="w-full h-6" />
        {action === "accept" ? (
          <h1 className="text-base text-center">
            Are you sure you would like to {action} this claim? All other claims
            will be rejected.
          </h1>
        ) : (
          <h1 className="text-base text-center">
            Are you sure you would like to {action} this claim?
          </h1>
        )}
        <div className="flex flex-row gap-4 w-full">
          <button
            className="flex w-1/2 duration-100 items-center justify-center gap-2 rounded-lg hover:bg-mainHover2 text-sm p-2 border-[1px] border-gray-400"
            onClick={action === "accept" ? acceptThisClaim : rejectThisClaim}
          >
            {action.toUpperCase().slice(0, 1) + action.slice(1)} Claim
          </button>
          <button
            onClick={() => setAreYouSure(false)}
            className="flex w-1/2 duration-100 items-center justify-center gap-1 rounded-lg hover:bg-mainHover2 text-sm p-2 border-[1px] border-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
  };

  return activeComponent[decisionState];
};

export default MyItemDisplay;
