"use client";
import React, { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/supabase";
import DisplayMap from "./DisplayMap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { User } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import ClaimItem from "./ClaimItem";
import Overlay from "./Overlay";
import { useRouter, usePathname } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { notFound } from "next/navigation";

type Pin = Database["public"]["Tables"]["pins"]["Row"];
type Request = Database["public"]["Tables"]["requests"]["Row"];

const LostItemDisplay = ({ apiKey }: { apiKey: string }) => {
  const supabase = createClient();
  const router = useRouter();

  const [item, setItem] = useState<Pin>();
  const [loadMap, setLoadMap] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>();
  const [username, setUsername] = useState<string>("");
  const [claimState, setClaimState] = useState<string>("loading");
  const [fetchClaims, setFetchClaims] = useState<boolean>(false);

  const claimStates = {
    notSignedIn: "Sign In to Claim",
    claimed: "Request Submitted",
    notClaimed: "Claim Item",
  };

  const search = useSearchParams();
  const pathname = usePathname();
  const claim = search.get("claim") == "true" ? true : false;

  const [itemID, setItemID] = useState<string>("");
  const [currentClaims, setCurrentClaims] = useState<number>(0);

  useEffect(() => {
    const fetchItem = async () => {
      const item_id = window.location.pathname.split("/")[2];
      setItemID(item_id);

      let { data, error } = await supabase
        .from("pins")
        .select("*")
        .eq("item_id", item_id);

      if (data) {
        setItem(data ? data[0] : "");
        setCurrentClaims(data ? data[0].claim_requests : 0);
        setLoadMap(true);
        setFetchClaims(true);
      } else {
        notFound();
      }
    };

    fetchItem();
  }, []);

  useEffect(() => {
    const fetchClaims = async (username: string): Promise<Request[]> => {
      let { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("request_id", username.toUpperCase().replace(" ", "") + itemID);

      if (data) {
        return data;
      }

      return [];
    };

    const fetchUserAndClaims = async (): Promise<void> => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      const user_name = data.user
        ? data.user.identities![0].identity_data!.full_name!
        : "";
      setUsername(user_name);

      const requests: Request[] = await fetchClaims(user_name);

      if (requests.length > 0 && data.user) {
        setClaimState(claimStates.claimed);
      } else if (data.user) {
        setClaimState(claimStates.notClaimed);
      } else {
        setClaimState(claimStates.notSignedIn);
      }
    };

    fetchUserAndClaims();
  }, [fetchClaims]);

  return (
    <div className="flex flex-row w-full h-full justify-center items-center gap-4 text-white">
      {claim ? (
        <div className="flex z-30 items-center justify-center w-full h-full fixed">
          <ClaimItem
            path={pathname}
            itemID={itemID}
            username={username}
            claimStatus={claimState}
            setClaimStatus={setClaimState}
            user={user ? true : false}
          />
          <Overlay on={claim} zIndex="z-30" />
        </div>
      ) : null}
      <div className="flex flex-col w-[30%] h-[60%] items-center gap-4">
        <div className="flex flex-row w-full h-[40%] gap-4">
          <div className="flex flex-col w-1/2 h-full items-center gap-4">
            <div className="flex items-center justify-center w-full h-[30%] bg-mainHover border-[1px] border-gray-600 rounded-lg">
              <h1 className="text-lg font-semibold text-gtGold">
                {item?.item || (
                  <Skeleton height={20} width={80} baseColor="#B3A369" />
                )}
              </h1>
            </div>
            <div className="flex flex-col justify-center items-center w-full h-[70%] border-[1px] border-gray-600 bg-mainHover rounded-lg">
              <p className="px-2 text-xl text-gtGold">
                {item?.created_at?.slice(0, 10) || (
                  <Skeleton height={20} width={120} baseColor="#B3A369" />
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-1/2 h-full bg-mainHover border-[1px] border-gray-600 rounded-lg">
            <h1 className="text-9xl text-gtGold">
              {item?.claim_requests != null ? (
                item?.claim_requests
              ) : (
                <Skeleton height={100} width={100} baseColor="#B3A369" />
              )}
            </h1>
            <p className="text-sm text-gray-400">Claim Requests</p>
          </div>
        </div>
        <div className="flex flex-col justify-between w-full h-[60%] p-4 bg-mainHover border-[1px] border-gray-600 rounded-lg">
          <h1 className="text-2xl text-gtGold font-semibold">
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
            className={`flex gap-2 text-white items-center justify-center text-sm ${
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
      <div className="flex w-[60%] h-[60%] bg-mainHover border-[1px] border-gray-600 rounded-lg">
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
