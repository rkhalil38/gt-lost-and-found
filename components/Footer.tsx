import Link from "next/link";
import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex flex-row text-gtGold w-screen fixed bottom-0 left-0 border-t-[1px] border-gray-500 items-center justify-between bg-mainHover text-xs h-12">
      <Link
        className="flex items-center justify-center duration-300 gap-2 w-12 pb:w-28 h-full hover:bg-mainHover2"
        href={"https://github.com/rkhalil38/gt-lost-and-found"}
      >
        <FaGithub className="text-2xl"/>
        <p className="text-xs hidden pb:block">Github</p>
      </Link>
      <div className="flex flex-grow items-center justify-center">
        <p>Copyright © by Romulus Khalil</p>
      </div>
      <div className="w-12 pb:w-28"/>
    </footer>
  );
};

export default Footer;
