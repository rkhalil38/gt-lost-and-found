"use client";
import React from 'react';

const Overlay = ({on, zIndex}: {on: boolean, zIndex: string}) => {
  return <div className={`flex ${on? 'fixed' : 'hidden'} top-0 bg-gray-800 w-full h-full opacity-50 ${zIndex}`}/>;
};

export default Overlay;