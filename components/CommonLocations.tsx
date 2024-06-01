"use client";
import { CommonLocation, getCommonLocations } from '@/db/database';
import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io';
import { ClipLoader } from 'react-spinners';

type componentMap = {
    [key: string]: JSX.Element;
}

const CommonLocations = ({
    apiKey,
    setToggled,
    setLocation,
  }: {
    apiKey: string;
    setToggled: Function;
    setLocation: Function;
  }) => {

    const [componentState, setComponentState] = useState<string>("loading")
    const [commonLocations, setCommonLocations] = useState<CommonLocation[]>([])
        
    useEffect(() => {
        const retrieveCommonLocations = async () => {

            const data = await getCommonLocations();
            if ("message" in data) {
                setComponentState("error");
              return;
            }
            setCommonLocations(data);
            setComponentState("successful")
          
        }

        retrieveCommonLocations()
    }, [])

    const componentStates: componentMap = {
        loading: (
            <div className="flex h-full w-full items-center justify-center">
                <ClipLoader color="#C29B0C" size={65} />
            </div>
        ),
        error: (
            <div className="flex h-full w-full items-center justify-center">
                <p className='text-gtGold'>There was an error retrieving common locations. Please try again.</p>
            </div>
        ),
        successful: (
            <div className="flex flex-col w-full p-6">
                <div onClick={() => setToggled(false)} className='flex flex-row group items-center text-gray-400 hover:text-gtGold text-sm duration-300 cursor-pointer'>
                    <IoIosArrowBack className='group-hover:-translate-x-1 duration-300'/>
                    <a>Back to Creation Screen</a>
                </div>
                {commonLocations.map((location) => (
                    <div key={location.location_id} className='flex flex-row justify-between border-b-[1px] py-8'>
                        <div className='flex flex-col'>
                            <h1 className='text-gtGold text-sm pb:text-base'>{location.name}</h1>
                            <p className='text-gray-400 text-xxs pb:text-xs'>{location.address}</p>
                        </div>
                        <button className='flex items-center justify-center w-20 pb:w-32 h-10 bg-gtGoldHover border-[1px] border-gtGold hover:opacity-70 duration-300 rounded-lg text-white text-xs' onClick={() => {
                            setLocation({lat: location.x_coordinate, lng: location.y_coordinate})
                            setToggled(false)
                        }}>Select</button>
                    </div>
                ))}
            </div>
        )
    }

  return (
    <div className="animate-in flex bg-mainTheme overflow-y-scroll absolute h-full w-full rounded-lg">
      {componentStates[componentState]}
    </div>
  )
}

export default CommonLocations