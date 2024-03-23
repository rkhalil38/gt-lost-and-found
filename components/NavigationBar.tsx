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
import { fetchUser, getUserName, signOut } from "@/db/database";

/*
Side navigation bar that users can interact with
Allows users to call CreateAPin component, navigate to other pages

pending warning fix
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
  const [user_name, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchThisUser = async () => {
      const user = await fetchUser();

      if (user instanceof AuthError || "message" in user) {
        return;
      }

      setUser(user);
      const user_name = await getUserName(user);
      setUserName(user_name);
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
      name: "My Found Items",
      icon: <FaBookmark className="ml-2" />,
      link: `/${user_name.replace(" ", "").toLowerCase()}/myitems`,
      active: activeUser ? true : false,
      onClick: () => toggle(false),
    },
    {
      name: "My Requests",
      icon: <PiBackpackLight className="ml-2" />,
      link: `/${user_name.replace(" ", "").toLowerCase()}/myrequests`,
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
      link: `/${user_name.replace(" ", "").toLowerCase()}/myaccount`,
      active: activeUser ? true : false,
      onClick: () => toggle(false),
    },
  ];

  return (
    <div
      className={`flex flex-col text-gray-300 duration-300 w-[300px] h-full rounded-r-lg border-b-[1px] border-t-[1px] border-r-[1px] border-gray-400 fixed top-0 ${
        toggled ? "left-0" : "left-[-300px]"
      } bg-mainTheme z-20 shadow-xl`}
    >
      <div className="flex flex-row my-3 items-center w-full">
        <h1 className="text-gtGold text-xl font-semibold pl-6">
          GT Lost and Found
        </h1>
        <button
          onClick={() => toggle(false)}
          className="flex absolute rounded-lg duration-200 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-400 bg-mainHover hover:text-gtGold text-xl"
        >
          <IoMdClose />
        </button>
      </div>
      <ol className="flex flex-col px-4 pt-4">
        {navbarItems.map((item) => (
          <Link
            className={`flex flex-row rounded-lg items-center duration-[50ms] gap-1 hover:bg-mainHover ${
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
      </ol>
      {activeUser ? (
        <button className="px-4" onClick={handleSignOut}>
          <div
            className={`flex flex-row text-red-500 rounded-lg items-center duration-[50ms] gap-1 hover:bg-mainHover text-base`}
          >
            <PiSignOutBold className="ml-2" />
            <p className="py-2">Sign Out</p>
          </div>
        </button>
      ) : null}

      {activeUser ? (
        <p className="text-white text-xs mt-4 ml-4">Signed in as {user_name}</p>
      ) : null}

      {creatingPin ? (
        <div className="flex flex-col h-full w-full">
          <CreateAPin apiKey={apiKey} toggle={setCreatingPin} />
          <Overlay zIndex="z-10" on={creatingPin} setOn={setCreatingPin}/>
        </div>
      ) : null}
    </div>
  );
};

export default NavigationBar;
