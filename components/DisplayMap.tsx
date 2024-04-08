"use client";
import { htmlIconMatcher } from "@/utils/supabase/iconMatcher";
import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useRef } from "react";

const DisplayMap = ({
  apiKey,
  lat,
  lng,
  item,
}: {
  apiKey: string;
  lat: number;
  lng: number;
  item: string;
}) => {
  const mapRef = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {

    try {
      const initMap = async () => {
        const parser = new DOMParser();

        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
        });

        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement } = await loader.importLibrary("marker");

        const defaultProps = {
          center: {
            lat: lat,
            lng: lng,
          },
          zoom: 18,
        };

        const mapOptions: google.maps.MapOptions = {
          center: defaultProps.center,
          zoom: defaultProps.zoom,
          disableDefaultUI: true,
          mapId: "33ef6ba1cc80f774",
          draggableCursor: "default",
          gestureHandling: "greedy",
        };

        const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

        const pinSvg = parser.parseFromString(
          `
                  <svg width="50px" height="50px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24,1.32c-9.92,0-18,7.8-18,17.38A16.83,16.83,0,0,0,9.57,29.09l12.84,16.8a2,2,0,0,0,3.18,0l12.84-16.8A16.84,16.84,0,0,0,42,18.7C42,9.12,33.92,1.32,24,1.32Z" fill="#FFFFFF"/>
                  <path d="M25.37,12.13a7,7,0,1,0,5.5,5.5A7,7,0,0,0,25.37,12.13Z" fill="#FFFFFF"/>
                  </svg>`,
          "image/svg+xml"
        ).documentElement;

        const parentWrapper = document.createElement("div");
        parentWrapper.className = "flex absolute items-center justify-center";

        const pinWrapper = document.createElement("div");
        pinWrapper.className = "flex absolute items-center justify-center";
        const pinElement = pinSvg.cloneNode(true);

        const svgWrapper = document.createElement("div");
        svgWrapper.className = "flex mb-2 absolute items-center justify-center";

        const icon = item;
        const svg = parser
          .parseFromString(htmlIconMatcher[icon], "image/svg+xml")
          .documentElement.cloneNode(true);

        pinWrapper.appendChild(pinElement);
        svgWrapper.appendChild(svg);
        pinWrapper.appendChild(svgWrapper);

        parentWrapper.appendChild(pinWrapper);

        const marker = new AdvancedMarkerElement({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          content: parentWrapper,
        });
      };

      initMap();
    } catch (error) {
      console.log("Error loading map: ", error)
    }
  }, []);

  return <div ref={mapRef} className="flex rounded-lg w-full h-full"></div>;
};

export default DisplayMap;
