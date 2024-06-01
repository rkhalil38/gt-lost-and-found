"use client";
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

/**
 * Component that slides into view when the user wants to choose a location on a map during Pin Creation.
 *
 * @param apiKey The Google Maps API key
 * @param setToggled Function that toggles the ChooseLocation component
 * @param setLocation Function that sets the location of the item
 * @returns The ChooseLocation component that allows the user to choose a location on a map
 */
const ChooseLocation = ({
  apiKey,
  currentLat,
  currentLng,
  setToggled,
  setLocation,
}: {
  apiKey: string;
  currentLat: number;
  currentLng: number;
  setToggled: Function;
  setLocation: Function;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parser = new DOMParser();

    try {
      const initMap = async () => {
        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
        });

        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement } = await loader.importLibrary("marker");

        const mapOptions: google.maps.MapOptions = {
          center: { lat: currentLat, lng: currentLng },
          zoom: 16,
          disableDefaultUI: true,
          mapId: "33ef6ba1cc80f774",
          draggableCursor: "default",
        };

        const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

        const pinSvg = parser.parseFromString(
          `
              <svg width="50px" height="50px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24,1.32c-9.92,0-18,7.8-18,17.38A16.83,16.83,0,0,0,9.57,29.09l12.84,16.8a2,2,0,0,0,3.18,0l12.84-16.8A16.84,16.84,0,0,0,42,18.7C42,9.12,33.92,1.32,24,1.32Z" fill="#FFFFFF"/>
                <path d="M25.37,12.13a7,7,0,1,0,5.5,5.5A7,7,0,0,0,25.37,12.13Z" fill="#FFFFFF"/>
              </svg>`,
          "image/svg+xml",
        ).documentElement;

        const marker = new AdvancedMarkerElement({
          position: new google.maps.LatLng(currentLat, currentLng),
          map: map,
          content: pinSvg,
          gmpDraggable: true,
        });

        marker.addListener("dragend", () => {
          setLocation({
            ...location,
            lat: marker.position?.lat,
            lng: marker.position?.lng,
          });
        });

        map.addListener("click", (click: google.maps.MapMouseEvent) => {
          setLocation({
            lat: click.latLng?.lat() as number,
            lng: click.latLng?.lng() as number,
          });
          marker.position = click.latLng;
        });
      };

      initMap();
    } catch (error) {
      console.log("Error loading map: ", error);
    }
  }, [apiKey, setLocation]);

  return (
    <div className="animate-in flex h-full w-full rounded-lg">
      <h1 className="absolute left-2 top-2 z-10 animate-pulse text-sm text-white">
        Click on or drag the pin to where you found the item.
      </h1>
      <div ref={mapRef} className="h-full w-full" />
      <button
        onClick={() => setToggled(false)}
        className="absolute bottom-4 right-4 flex h-10 w-36 items-center justify-center rounded-lg border-[1px] border-gray-400 bg-mainTheme text-xs duration-300 hover:bg-gtGold"
      >
        <p>Confirm Location</p>
      </button>
    </div>
  );
};

export default ChooseLocation;
