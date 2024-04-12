"use client";
import React, { useRef } from "react";

/**
 * The overlay component.
 *
 * @param on Boolean that determines if the overlay is on
 * @param setOn Function that sets the overlay
 * @param zIndex The z-index of the overlay
 * @param clear Boolean that determines if the overlay is clear
 * @returns The Overlay component that displays the overlay.
 */
const Overlay = ({
  on,
  setOn,
  zIndex,
  clear,
}: {
  on: boolean;
  setOn: Function;
  zIndex: string;
  clear: boolean;
}) => {
  const overlay = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={overlay}
      className={`flex ${
        on ? "fixed" : "hidden"
      } left-0 top-0 bg-gray-800 w-screen h-screen ${
        clear ? "opacity-0" : "opacity-50"
      } ${zIndex}`}
      onClick={() => setOn(false)}
    />
  );
};

export default Overlay;
