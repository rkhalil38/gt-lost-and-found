"use client";
import React, { useRef } from "react";

const Overlay = ({ on, setOn, zIndex }: { on: boolean; setOn: Function; zIndex: string; }) => {
  const overlay = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={overlay}
      className={`flex ${
        on ? "fixed" : "hidden"
      } left-0 top-0 bg-gray-800 w-full h-full opacity-50 ${zIndex}`}
      onClick={() => setOn(false)}
    />
  );
};

export default Overlay;
