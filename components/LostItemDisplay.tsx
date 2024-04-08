"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/supabase";
import DisplayMap from "./DisplayMap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AuthError, PostgrestError, User } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import ClaimItem from "./ClaimItem";
import Overlay from "./Overlay";
import { usePathname } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { notFound } from "next/navigation";
import {
  Pin,
  fetchClaims,
  fetchPin,
  fetchUser,
  getUserName,
} from "@/db/database";
import { PinRequest } from "@/db/database";

const LostItemDisplay = ({ apiKey }: { apiKey: string }) => {
  const supabase = createClient();

  const [item, setItem] = useState<Pin>();
  const [loadMap, setLoadMap] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [username, setUsername] = useState<string>("");
  const [claimState, setClaimState] = useState<string>("loading");
  const [retrieveClaims, setRetrieveClaims] = useState<boolean>(false);

  const claimStates = {
    notSignedIn: "Sign In to Claim",
    claimed: "Request Submitted",
    notClaimed: "Claim Item",
  };

  const search = useSearchParams();
  const pathname = usePathname();
  const claim = search.get("claim") == "true" ? true : false;

  const [itemID, setItemID] = useState<string>("");
  const [pinCreatorID, setPinCreatorID] = useState<string>("");
  const [currentClaims, setCurrentClaims] = useState<number>(0);
  const [ screenWidth, setScreenWidth ] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    const fetchThisItem = async () => {
      const item_id = window.location.pathname.split("/")[2];
      setItemID(item_id);

      const data = await fetchPin(item_id);

      if ("message" in data) {
        notFound();
      }

      setItem(data);
      setCurrentClaims(data.claim_requests ? data.claim_requests : 0);
      setPinCreatorID(data.creator_id);
      setLoadMap(true);
      setRetrieveClaims(true);
    };

    fetchThisItem();
  }, []);

  useEffect(() => {
    const fetchUserAndClaims = async (): Promise<void> => {
      const data = await fetchUser();

      if (data instanceof AuthError || "message" in data) {
        setClaimState(claimStates.notSignedIn);
        return;
      }

      setUser(data);

      const user_name = await getUserName(data);
      setUsername(user_name);

      const requests: PinRequest[] | PostgrestError = await fetchClaims(
        itemID,
        data
      );

      if ("message" in requests) {
        return;
      }

      if (requests.length > 0 && data) {
        setClaimState(claimStates.claimed);
      } else if (data) {
        setClaimState(claimStates.notClaimed);
      } else {
        setClaimState(claimStates.notSignedIn);
      }
    };

    fetchUserAndClaims();
  }, [retrieveClaims]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-pins")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pins",
          filter: `item_id=eq.${itemID}`,
        },
        (payload) => {
          setItem(payload.new as Database["public"]["Tables"]["pins"]["Row"]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, item, setItem]);

  return (
    <div className="flex flex-col py-24 tb:pt-0 tb:flex-row w-full h-full justify-center items-center gap-4 text-white">
      {claim ? (
        <div className="flex z-30 items-center justify-center w-full h-full fixed">
          <ClaimItem
            path={pathname}
            itemID={itemID}
            pin_creator_id={pinCreatorID}
            username={username}
            claimStatus={claimState}
            userID={user instanceof AuthError ? "" : user ? user.id : ""}
            setClaimStatus={setClaimState}
            user={user ? true : false}
          />
          <Overlay on={claim} setOn={() => {router.push(`${pathname}?claim=false`)}} zIndex="z-30" clear={false}/>
        </div>
      ) : null}
      <div className="flex flex-col w-[80%] tb:w-[30%] h-[65%] items-center gap-4">
        <div className="flex flex-row w-full h-[70%] gap-4">
          <div className="flex flex-col w-1/2 h-full items-center gap-4">
            <div className="flex items-center justify-center w-full h-[30%] bg-mainHover border-[1px] border-gray-500 rounded-lg">
              <h1 className="text-lg font-semibold text-gtGold">
                {item?.item || (
                  <Skeleton height={20} width={80} baseColor="#B3A369" />
                )}
              </h1>
            </div>
            <div className="flex flex-col justify-center items-center w-full h-[70%] border-[1px] border-gray-500 bg-mainHover rounded-lg">
              <p className="px-2 text-xl text-gtGold">
                {item?.created_at?.slice(0, 10) || (
                  <Skeleton height={20} width={120} baseColor="#B3A369" />
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-1/2 h-full bg-mainHover border-[1px] border-gray-500 rounded-lg">
            <h1 className="text-8xl tb:text-9xl text-gtGold">
              {item?.claim_requests != null ? (
                item?.claim_requests
              ) : (
                <Skeleton height={screenWidth < 450 ? 80 : 100} width={screenWidth < 450 ? 80 : 100} baseColor="#B3A369" />
              )}
            </h1>
            <p className="text-sm text-gray-400 pb-2">Claim Requests</p>
          </div>
        </div>
        <div className="flex flex-col justify-between w-full h-[60%] p-4 bg-mainHover border-[1px] border-gray-500 rounded-lg">
          <h1 className="text-xl tb:text-2xl text-gtGold font-semibold">
            Found by{" "}
            {item?.user_name || (
              <Skeleton height={20} width={120} baseColor="#B3A369" />
            )}
          </h1>
          <p className="text-sm h-40 text-gtGold">
            {item?.description ? (
              item?.description
            ) : (
              <Skeleton height={20} width={120} baseColor="#B3A369" />
            )}
          </p>

          <Link
            href={
              claimState === "Request Submitted" ||
              claimState === "Fresh Request Submitted"
                ? ""
                : user
                ? pathname + "?claim=true"
                : "/login"
            }
            className={`flex gap-2 p-4 text-white items-center justify-center text-sm ${
              claimState === "Request Submitted" ||
              claimState === "Fresh Request Submitted"
                ? "cursor-default bg-green-500 border-green-600"
                : "hover:opacity-80 border-gtGold bg-gtGoldHover"
            } w-full h-10 border-[1px] rounded-lg duration-300`}
          >
            {claimState === "Request Submitted" ||
            claimState === "Fresh Request Submitted" ? (
              <FaCheck />
            ) : null}
            {claimState === "Request Submitted" ||
            claimState === "Fresh Request Submitted" ? (
              <p>Request Submitted</p>
            ) : null}
            {claimState === "Claim Item" ? "Claim Item" : null}
            {claimState === "Sign In to Claim" ? "Sign In to Claim" : null}
            {claimState === "loading" ? <ClipLoader color="#B3A369" /> : null}
          </Link>
        </div>
      </div>
      <div className="flex w-[80%] h-[40%] tb:w-[60%] tb:h-[65%] bg-mainHover border-[1px] border-gray-500 rounded-lg">
        {loadMap ? (
          <DisplayMap
            apiKey={apiKey}
            lat={item?.x_coordinate ? item.x_coordinate : 0}
            lng={item?.y_coordinate ? item.y_coordinate : 0}
            item={item?.item ? item.item : ""}
          />
        ) : null}
      </div>
    </div>
  );
};

export default LostItemDisplay;