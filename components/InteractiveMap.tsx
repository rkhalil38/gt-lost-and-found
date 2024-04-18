"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { createClient } from "@/utils/supabase/client";
import { htmlIconMatcher } from "@/utils/supabase/iconMatcher";
import { Database } from "@/supabase";
import CreateAPin from "./CreateAPin";
import Overlay from "./Overlay";
import { fetchPins } from "@/db/database";

type Pin = Database["public"]["Tables"]["pins"]["Row"];

/**
 * Component that displays the main interactive map on the home page.
 *
 * @param apiKey The Google Maps API key
 * @returns The InteractiveMap component that displays the main interactive map on the home page.
 */
const InteractiveMap = ({ apiKey }: { apiKey: string }) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [clickPosition, setClickPosition] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });
  const [toggle, setToggle] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    const getPins = async () => {
      const data = await fetchPins();

      if ("message" in data) {
        return;
      }

      setPins(data);
    };

    getPins();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-pins")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pins" },
        (payload) =>
          setPins((pins) => [
            ...pins,
            payload.new as Database["public"]["Tables"]["pins"]["Row"],
          ]),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setPins, pins]);

  useEffect(() => {
    const parser = new DOMParser();

    const defaultProps = {
      center: {
        lat: 33.77608,
        lng: -84.398295,
      },
      zoom: 17,
    };

    try {
      const initMap = async () => {
        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
        });

        const { Map, InfoWindow } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement } = await loader.importLibrary("marker");

        const mapOptions: google.maps.MapOptions = {
          center: defaultProps.center,
          zoom: defaultProps.zoom,
          disableDefaultUI: true,
          mapId: "33ef6ba1cc80f774",
          draggableCursor: "default",
          gestureHandling: "greedy",
        };

        const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

        map.addListener("click", (click: google.maps.MapMouseEvent) => {
          setClickPosition({
            lat: click.latLng?.lat() as number,
            lng: click.latLng?.lng() as number,
          });
          setToggle(true);
        });

        const infoWindow = new InfoWindow();

        const hoverElement = document.createElement("div");
        hoverElement.className =
          "flex items-center justify-center border-[1px] border-white w-10 h-10 bg-blue-800 rounded-full";

        for (const pin of pins) {
          if (!pin.resolved) {

            const pinSvg = parser.parseFromString(
              `
                  <svg width="50px" height="50px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24,1.32c-9.92,0-18,7.8-18,17.38A16.83,16.83,0,0,0,9.57,29.09l12.84,16.8a2,2,0,0,0,3.18,0l12.84-16.8A16.84,16.84,0,0,0,42,18.7C42,9.12,33.92,1.32,24,1.32Z" ${pin.in_possession? 'fill="#FFFFFF"' : 'fill="#003057"'}/>
                      <path d="M25.37,12.13a7,7,0,1,0,5.5,5.5A7,7,0,0,0,25.37,12.13Z" ${pin.in_possession? 'fill="#FFFFFF"' : 'fill="#003057"'}/>
                  </svg>`,
              "image/svg+xml",
            ).documentElement;

            const parentWrapper = document.createElement("div");
            parentWrapper.className =
              "flex absolute items-center justify-center";

            const pinWrapper = document.createElement("div");
            pinWrapper.className = "flex absolute items-center justify-center";
            const pinElement = pinSvg.cloneNode(true);

            const svgWrapper = document.createElement("div");
            svgWrapper.className =
              "flex mb-2 absolute items-center justify-center";

            const icon = pin.item as string;
            const svg = parser
              .parseFromString(htmlIconMatcher[icon], "image/svg+xml")
              .documentElement.cloneNode(true);

            pinWrapper.appendChild(pinElement);
            svgWrapper.appendChild(svg);
            pinWrapper.appendChild(svgWrapper);

            parentWrapper.appendChild(pinWrapper);

            const marker = new AdvancedMarkerElement({
              position: new google.maps.LatLng(
                pin.x_coordinate,
                pin.y_coordinate,
              ),
              map: map,
              content: parentWrapper,
            });

            const infoElement = document.createElement("div");
            infoElement.className =
              "flex flex-col gap-2 animate-in self-center text-black w-44 rounded-lg";

            const item = document.createElement("h1");
            item.textContent = pin.item;
            item.className = "text-lg text-gtGold font-semibold";

            const creator = document.createElement("h2");
            creator.textContent = pin.in_possession? `Found by: ${pin.user_name}` : `Spotted by: ${pin.user_name}`;
            creator.className = "text-sm font-semibold text-gtBlue";

            const description = document.createElement("p");
            description.textContent = pin.description;
            description.className =
              "text-sm w-full overflow-scroll-y text-gtBlue";

            const buttonDiv = document.createElement("div");
            buttonDiv.className =
              "flex flex-row gap-2 items-center justify-center";

            const claimButton = document.createElement("a");
            claimButton.className =
              `${pin.in_possession? "flex" : "hidden"} bg-white border-gtGold hover:bg-gtGold hover:text-white duration-300 items-center text-gtGold justify-center w-20 h-10 border-[1px] rounded-lg`;
            claimButton.textContent = "Claim";
            claimButton.href = `/lostitems/${pin.item_id}?claim=true`;

            const viewButton = document.createElement("a");
            viewButton.className =
              `flex bg-white border-gtBlue hover:bg-gtBlue hover:text-white duration-300 items-center text-gtBlue justify-center ${pin.in_possession? "w-20" : "w-full"} h-10 border-[1px] rounded-lg`;
            viewButton.textContent = "View";
            viewButton.href = `/lostitems/${pin.item_id}?claim=false`;

            buttonDiv.appendChild(claimButton);
            buttonDiv.appendChild(viewButton);

            infoElement.appendChild(item);
            infoElement.appendChild(creator);
            infoElement.appendChild(description);
            infoElement.appendChild(buttonDiv);

            marker.addListener(
              "click",
              ({ domEvent, latLng }: google.maps.MapMouseEvent) => {
                const { target } = domEvent;
                infoWindow.close();
                infoWindow.setContent(infoElement);
                infoWindow.open(marker.map, marker);
              },
            );
          }
        }
      };

      initMap();
    } catch (error) {
      console.log("Error loading map: ", error);
    }
  }, [pins, apiKey]);

  return (
    <div className="z-0 flex h-full w-full items-center">
      <div id="map" ref={mapRef} className="z-0 h-full w-full" />
      {toggle ? (
        <div className="fixed h-full w-full">
          <CreateAPin
            apiKey={apiKey}
            toggle={setToggle}
            lat={clickPosition.lat}
            lng={clickPosition.lng}
          />
          <Overlay on={toggle} setOn={setToggle} zIndex="z-20" clear={false} />
        </div>
      ) : null}
    </div>
  );
};

export default InteractiveMap;
