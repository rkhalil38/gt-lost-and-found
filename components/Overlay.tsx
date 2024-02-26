"use client";
import React, { useRef } from "react";

const Overlay = ({ on, zIndex }: { on: boolean; zIndex: string }) => {
  const overlay = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    overlay.current?.focus();
  };

  return (
    <div
      ref={overlay}
      className={`flex ${
        on ? "fixed" : "hidden"
      } top-0 bg-gray-800 w-full h-full opacity-50 ${zIndex}`}
      onClick={handleClick}
    />
  );
};

export default Overlay;
