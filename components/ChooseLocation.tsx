"use client";
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

/*
Component that slide in when the user clicks select location
Loads the map api and allows the user to drag a pin on the map 
On the end of a drag, the pin calls the setLocation callback function to update the location state
*/

const ChooseLocation = ({
  apiKey,
  setToggled,
  setLocation,
}: {
  apiKey: string;
  setToggled: Function;
  setLocation: Function;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const parser = new DOMParser();

  useEffect(() => {

    try {
      const initMap = async () => {
        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
        });

        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement } = await loader.importLibrary("marker");

        const defaultProps = {
          center: {
            lat: 33.77608,
            lng: -84.398295,
          },
          zoom: 16,
        };

        const mapOptions: google.maps.MapOptions = {
          center: defaultProps.center,
          zoom: defaultProps.zoom,
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
          "image/svg+xml"
        ).documentElement;

        const marker = new AdvancedMarkerElement({
          position: new google.maps.LatLng(
            defaultProps.center.lat,
            defaultProps.center.lng
          ),
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
      console.log('Error loading map: ', error)
    }
  }, []);

  return (
    <div className="flex rounded-lg w-full h-full animate-in">
      <h1 className="absolute animate-pulse text-sm text-white top-2 left-2 z-10">
        Click on or drag the pin to where you found the item.
      </h1>
      <div ref={mapRef} className="w-full h-full" />
      <button
        onClick={() => setToggled(false)}
        className="flex absolute bottom-4 right-4 w-36 h-10 text-xs justify-center items-center rounded-lg border-[1px] border-gray-400 bg-mainTheme hover:bg-gtGold duration-300"
      >
        <p>Confirm Location</p>
      </button>
    </div>
  );
};

export default ChooseLocation;
