'use client';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import ChooseLocation from './ChooseLocation';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { createClient } from '@/utils/supabase/client';
import { RingLoader } from 'react-spinners';
import Overlay from './Overlay';

type Location = {
    lat: number,
    lng: number
}
/*
Create a pin component that allows the users to create a pin on the map
User selects item, gives description, and chooses the location via ChooseLocation component when 
select button is pressed
*/

interface CreateAPinProps {
    apiKey: string,
    toggle: Function,
    lat?: number,
    lng?: number
}

const CreateAPin = ({apiKey, toggle, lat, lng} : CreateAPinProps) => {

    const supabase = createClient();
    
    const [ pickLocation, setPickLocation ] = useState<boolean>(false)
    const [ overlay, setOverlay ] = useState<boolean>(false)
    const [ foundItem, setFoundItem ] = useState<string>('')
    const [ description, setDescription ] = useState<string>('')
    const [ location, setLocation ] = useState<Location>({lat: lat? lat : 0, lng: lng? lng : 0})
    const [ characterCount, setCharacterCount ] = useState<number>(0)
    const [ pinCreationStatus, setPinCreationStatus ] = useState<string>('')

    const itemOptions = ['iphone', 'ipad', 'laptop', 'buzzcard', 'android phone', 'backpack', 'jacket', 'miscellaneous']

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    useEffect(() => {
        setCharacterCount(description.length)
    }, [description])

    useEffect(() => {
        setOverlay(true)

        return () => {
            setOverlay(false)
        }
    }, [])

    
    const createPin = async () => {

        const user = await supabase.auth.getUser()
        const uuid = user.data.user?.id
        const placeholder = user.data.user
        const user_name = placeholder? placeholder.identities![0].identity_data!.full_name! : ''
        setPinCreationStatus('loading')

        const { data, error } = await supabase
        .from('pins')
        .insert([
        { creator_id: uuid, user_name: user_name, x_coordinate: location.lat, y_coordinate: location.lng, item: foundItem, description: description},
        ])
        .select()

        if (error) {
            console.log(error)
            setPinCreationStatus('There was an error creating the pin. Please try again later.')
        } else {
            setPinCreationStatus('Pin created successfully!')
        }


    }

    const completedForm = () => {
        if (foundItem !== '' && description !== '' && location.lat !== 0 && location.lng !== 0) {
            return true
        } 

        return false
    }


    return (
        <div className='flex flex-col z-30 animate-in fixed top-1/4 left-1/4 bg-mainTheme w-1/2 h-1/2 rounded-lg border-[1px]'>
            
            {pinCreationStatus == ''?

                <div className='flex w-full h-full'>
                    <div className={`${pickLocation? 'hidden' : 'flex'} flex-col w-full h-full`}>
                        <button onClick={() => toggle(false)} className='flex absolute rounded-lg duration-300 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-white text-xl'><IoMdClose/></button>
                        <h1 className='text-white pt-4 pb-2 px-4 text-xl'>Found Item</h1>
                        <div className='flex flex-row px-4 gap-2'>
                            {itemOptions.map((item, index) => (
                                <button key={index} onClick={() => setFoundItem(item)} className={`flex text-xs p-2 justify-center items-center rounded-lg border-[1px] border-gray-600 duration-300 hover:text-gtGold hover:border-gtGold ${foundItem === item? 'border-gtGold text-gtGold' : 'text-gray-400'}`}>{item}</button>
                            ))}
                        </div>
                        <label htmlFor='description' className='text-white px-4 pb-2 pt-4 text-xl'>Description</label>
                        <textarea onChange={handleChange} maxLength={100} rows={3} cols={50} id='description' className='text-white text-sm focus:border-gtGold focus:outline-none duration-300 resize-none mx-4 px-4 py-2 bg-mainTheme border-[1px] border-gray-600 rounded-lg' placeholder='Enter a description of the item' />
                        <div className='flex flex-row justify-end px-4'>
                            <p className='justify-self-end text-gray-400 text-xs'>{characterCount}/{100}</p>
                        </div>
                        <label htmlFor='location' className='text-white px-4 pb-2 pt-4 text-xl'>Location</label>
                        {location.lat !== 0 && location.lng !== 0?

                        <p className='text-sm text-gtGold mx-4 mb-2'>Location: {location.lat}, {location.lng}</p>

                        : null}
                        <button onClick={() => setPickLocation(true)} className='flex w-36 h-10 mx-4 text-xs justify-center items-center rounded-lg border-[1px] border-gray-600 duration-300 hover:text-gtGold hover:bg-mainHover text-gray-400'>
                            <FaMapMarkerAlt className='mr-1'/> 
                            {location.lat !== 0 && location.lng !== 0? 'Change Location' : 'Pick Location'}
                        </button>
                    </div>
                    {pickLocation?

                        <ChooseLocation apiKey={apiKey} setToggled={setPickLocation} setLocation={setLocation}/>

                    : null}
                    <button disabled={!completedForm()} onClick={createPin} className={`${pickLocation? 'hidden' : 'flex'} disabled:bg-gray-700 disabled:text-gray-400 w-36 h-10 absolute bottom-4 right-4 text-xs rounded-lg border-[1px] items-center justify-center bg-gtGold text-white hover:bg-gtGoldHover`}>
                        Create Found Item
                    </button>
                </div>

            :

            <div className='flex w-full h-full items-center justify-center'>

                <button onClick={() => toggle(false)} className='flex absolute rounded-lg duration-300 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-white text-xl'><IoMdClose/></button>

                {pinCreationStatus === 'loading'?
                
                    <RingLoader color='#C29B0C' size={65}/>
                    

                    :

                    <div>

                        {pinCreationStatus === 'Pin created successfully!'?
                        
                        <div className='flex flex-col items-center justify-center'>
                            <FaCheck className='text-gtGold text-6xl'/>
                            <p className='text-white text-xl'>{pinCreationStatus}</p>
                        </div>
                        
                        :

                        <div className='flex flex-col items-center justify-center'>
                            <MdCancel className='text-red-500 text-6xl'/>
                            <p className='text-white text-xl'>{pinCreationStatus}</p>
                        </div>

                        }

                    </div>

                }

            </div>

            }

    </div>

    )
}

export default CreateAPin