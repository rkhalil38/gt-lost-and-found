"use client";
import React, { useEffect, useRef, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { PiBackpackLight } from "react-icons/pi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import { FaSignInAlt } from "react-icons/fa";
import { CgScrollV } from "react-icons/cg";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import CreateAPin from "./CreateAPin";
import Overlay from "./Overlay";
import { useRouter } from "next/navigation";
import { AuthError, User } from "@supabase/supabase-js";
import { fetchProfile, fetchUser, signOut } from "@/db/database";

/**
 * The side navigation bar component.
 *
 * @param apiKey The Google Maps API key
 * @param toggle Function that toggles the navigation bar
 * @param toggled Boolean that determines if the navigation bar is toggled
 * @returns The NavigationBar component that displays the navigation bar.
 */
const NavigationBar = ({
  apiKey,
  toggle,
  toggled,
}: {
  apiKey: string;
  toggle: Function;
  toggled: boolean;
}) => {
  const [activeUser, setUser] = useState<User>();
  const [creatingPin, setCreatingPin] = useState<boolean>(false);
  const [username, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchThisUser = async () => {
      const user = await fetchUser();

      if (user instanceof AuthError) {
        return;
      }

      setUser(user);

      const profile = await fetchProfile(user.id);

      if ("message" in profile || profile.username === null) {
        return;
      }

      setUserName(profile.username);
    };

    fetchThisUser();
  }, []);

  const handleSignOut = async () => {
    console.log("Signing out");
    const error = await signOut();

    if (error instanceof AuthError) {
      return;
    }

    router.push("/");
    location.reload();
  };

  const navbarItems = [
    {
      name: "Home",
      icon: <AiFillHome className="ml-2" />,
      link: "/",
      active: true,
      onClick: () => toggle(false),
    },
    {
      name: "Create a Found Item",
      icon: <FaMapMarkerAlt className="ml-2" />,
      link: "",
      active: activeUser ? true : false,
      onClick: () => setCreatingPin(true),
    },
    {
      name: "Browse Lost Items",
      icon: <CgScrollV className="ml-2" />,
      link: "/lostitems",
      active: true,
      onClick: () => toggle(false),
    },
    {
      name: "My Item Reports",
      icon: <FaBookmark className="ml-2" />,
      link: `/${username.replace(" ", "").toLowerCase()}/myitems`,
      active: activeUser ? true : false,
      onClick: () => toggle(false),
    },
    {
      name: "My Requests",
      icon: <PiBackpackLight className="ml-2" />,
      link: `/${username.replace(" ", "").toLowerCase()}/myrequests`,
      active: activeUser ? true : false,
      onClick: () => toggle(false),
    },
    {
      name: "Sign In",
      icon: <FaSignInAlt className="ml-2" />,
      link: "/login",
      active: activeUser ? false : true,
      onClick: () => toggle(false),
    },
    {
      name: "My Account",
      icon: <MdOutlineAccountCircle className="ml-2" />,
      link: `/${username.replace(" ", "").toLowerCase()}/myaccount`,
      active: activeUser ? true : false,
      onClick: () => toggle(false),
    },
  ];

  return (
    <div
      className={`fixed top-0 flex h-full w-[300px] flex-col justify-between rounded-r-lg border-b-[1px] border-r-[1px] border-t-[1px] border-gray-500 py-3 text-gray-300 duration-300 ${
        toggled ? "left-0" : "left-[-300px]"
      } z-20 bg-mainTheme shadow-xl`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-row items-center">
          <h1 className="pl-6 text-xl font-semibold text-gtGold">
            GT Lost and Found
          </h1>
          <button
            onClick={() => toggle(false)}
            className="absolute right-2 top-[9px] flex h-8 w-8 items-center justify-center rounded-lg bg-mainHover text-xl text-gray-400 duration-200 hover:text-gtGold"
          >
            <IoMdClose />
          </button>
        </div>
        <ol className="flex flex-col px-4 pt-4">
          {navbarItems.map((item) => (
            <Link
              className={`flex flex-row items-center gap-1 rounded-lg duration-[50ms] hover:bg-mainHover ${
                item.active ? "block" : "hidden"
              } text-base`}
              href={item.link}
              key={item.name}
              onClick={item.onClick}
            >
              {item.icon}
              <p className="py-2">{item.name}</p>
            </Link>
          ))}
          {activeUser ? (
            <button onClick={handleSignOut}>
              <div
                className={`flex flex-row items-center gap-1 rounded-lg text-base text-red-500 duration-[50ms] hover:bg-mainHover`}
              >
                <PiSignOutBold className="ml-2" />
                <p className="py-2">Sign Out</p>
              </div>
            </button>
          ) : null}
        </ol>
      </div>
      <div className="flex w-full flex-col gap-2 px-6">
        <p className="text-xxs text-gray-400">
          {`Disclaimer: GT Lost and Found provides a platform for GT students and faculty to interact with 
          each other regarding lost items. Users should perform full validation as to whether or not the finder of 
          their items are trustworthy.`}
        </p>
        <Link className="text-xs text-gtGold underline" href={"/privacypolicy"}>
          Privacy Policy
        </Link>
      </div>

      {creatingPin ? (
        <div className="flex h-full w-full flex-col">
          <CreateAPin apiKey={apiKey} toggle={setCreatingPin} />
          <Overlay
            zIndex="z-10"
            on={creatingPin}
            setOn={setCreatingPin}
            clear={false}
          />
        </div>
      ) : null}
    </div>
  );
};

export default NavigationBar;
