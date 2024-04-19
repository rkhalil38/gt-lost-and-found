import Link from "next/link";
import React from "react";
import { FaGithub } from "react-icons/fa";

/**
 * Component that displays the footer of the application.
 *
 * @returns The Footer component that displays the footer of the application.
 */
const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 flex h-12 w-screen flex-row items-center justify-between border-t-[1px] border-gray-500 bg-mainHover text-xs text-gtGold">
      <Link
        className="flex h-full w-12 items-center justify-center gap-2 duration-300 hover:bg-mainHover2 pb:w-28"
        href={"https://github.com/rkhalil38/gt-lost-and-found"}
      >
        <FaGithub className="text-2xl" />
        <p className="hidden text-xs pb:block">Github</p>
      </Link>
      <div className="flex flex-grow items-center justify-center">
        <p>Copyright © by Romulus Khalil</p>
      </div>
      <div className="flex flex-row text-xs items-start gap-1 w-12 pb:w-28"/>
    </footer>
  );
};

export default Footer;
