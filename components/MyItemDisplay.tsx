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
} from "@/db/database";
import { ClipLoader } from "react-spinners";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { createClient } from "@/utils/supabase/client";

type Pin = Database["public"]["Tables"]["pins"]["Row"];
type PinRequest = Database["public"]["Tables"]["requests"]["Row"];
type ComponentMap = {
  [key: string]: JSX.Element;
};
type requestStatus = {
  [key: string]: any;
};

const MyItemDisplay = () => {
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
          replaceOldRequest(payload.new as Database["public"]["Tables"]["requests"]["Row"])
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
  }

  
  const requestStatus: requestStatus = {
    undecided: "border-gray-500",
    accepted: "border-green-400 text-white",
    rejected: "border-red-400 text-white",
  };

  return (
    <div className="flex flex-col tb:flex-row py-28 tb:pt-0 gap-4 text-gtGold w-screen h-screen items-center justify-center">
      <div className="flex flex-col gap-4 rounded-lg items-center w-[80%] tb:w-[40%] h-3/4">
        <ItemDisplay itemID={itemID} />
        <div className="flex flex-row overflow-x-scroll tb:flex-col tb:overflow-y-scroll gap-4 rounded-lg tb:items-center w-full h-1/2">
          {requests ? (
            requests?.map((request) => (
              <button
                onClick={() => setCurrentRequest(request)}
                key={request.request_id}
                className={`flex flex-row hover:bg-mainHover2 cursor-pointer bg-mainHover group w-full h-28 justify-between border-[1px] ${
                  requestStatus[request.status]
                } p-4 gap-4 duration-300 rounded-lg`}
              >
                <div className="flex flex-col items-start gap-1 w-[60%]">
                  <p className="text-sm">{request.creator_name}</p>
                  <p className="text-xs text-start h-12 overflow-clip text-gray-400">
                    {request.description}
                  </p>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <IoIosArrowBack className="rotate-180 text-gray-500 group-hover:text-white group-hover:translate-x-1 duration-300" />
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
        status={currentRequest ? currentRequest.status : ""}
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
    accepted: <h1 className="text-green-400 text-xs">Claim Accepted</h1>,
    rejected: <h1 className="text-red-400 text-xs">Claim Rejected</h1>,
  };

  return (
    <div className="flex flex-col justify-between w-[80%] tb:w-1/4 h-3/4 rounded-lg bg-mainHover border-[1px] border-gray-500">
      {areYouSure ? (
        <div className="flex fixed items-center justify-center z-30 top-0 left-0 w-screen h-screen">
          <AreYouSure
            setAreYouSure={setAreYouSure}
            action={action}
            status={status}
            itemID={itemID}
            creatorID={creatorID}
          />
          <Overlay on={areYouSure} setOn={setAreYouSure} zIndex="z-30" clear={false}/>
        </div>
      ) : null}

      {creator ? (
        <div className="flex flex-col gap-4 m-4">
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
        <div className="flex flex-row w-full">
          <button
            disabled={status !== "undecided"}
            onClick={handleAcceptButton}
            className={`flex w-1/2 items-center justify-center ${
              status !== "undecided"
                ? "bg-gray-700 text-gray-500"
                : "hover:bg-green-400 hover:text-white"
            } gap-2 rounded-bl-lg duration-300 text-sm p-4 border-t-[1px] border-r-[1px] border-gray-400`}
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
            } gap-1 rounded-br-lg duration-300 text-sm p-4 border-t-[1px] border-gray-400`}
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
          setItem(payload.new as Database["public"]["Tables"]["pins"]["Row"])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setItem, item]);

  return (
    <div className="flex flex-col justify-between p-4 bg-mainHover rounded-lg border-[1px] border-gray-500 gap-2 w-full h-1/2">
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
          <div className="flex flex-row justify-end self-start w-44 gap-2 text-xl text-green-400 font-semibold items-center">
            <FaCheck />
            Owner Found
          </div>
        )}
      </div>
      <h1 className="text-xs flex flex-row items-center gap-2">
        {item?.claim_requests != null ? (
          item?.claim_requests
        ) : (
          <Skeleton height={20} width={20} baseColor="#B3A369" />
        )}
        {" "}claim requests
      </h1>
    </div>
  );
};

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
      itemID ? itemID : ""
    );
    console.log(data);
    setDecisionState("true");
  };

  const rejectThisClaim = async (): Promise<void> => {
    setDecisionState("loading");
    const data = await rejectClaim(
      creatorID ? creatorID : "",
      itemID ? itemID : ""
    );
    console.log(data);
    setDecisionState("true");
  };

  const closeButton = (
    <button
      onClick={() => setAreYouSure(false)}
      className="flex absolute rounded-lg duration-300 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-gtGold text-xl"
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
      <div className="flex items-center justify-between p-4 flex-col fixed self-center z-40 justify-self-center rounded-lg border-[1px] border-gray-500 w-[90%] tb:w-[450px] h-64 bg-mainTheme">
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
            className="flex w-1/2 duration-300 items-center justify-center gap-2 rounded-lg hover:bg-mainHover2 text-sm p-2 border-[1px] border-gray-400"
            onClick={action === "accept" ? acceptThisClaim : rejectThisClaim}
          >
            {action.toUpperCase().slice(0, 1) + action.slice(1)} Claim
          </button>
          <button
            onClick={() => setAreYouSure(false)}
            className="flex w-1/2 duration-300 items-center justify-center gap-1 rounded-lg hover:bg-mainHover2 text-sm p-2 border-[1px] border-gray-400"
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
