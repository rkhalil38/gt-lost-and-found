"use client";
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/supabase';
import DisplayMap from './DisplayMap';

type Pin = Database['public']['Tables']['pins']['Row']

const LostItemDisplay = ({apiKey} : {apiKey: string}) => {

    const supabase = createClient()

    const [ item, setItem ] = useState<Pin>()
    const [ loadMap, setLoadMap ] = useState<boolean>(false)

    useEffect(() => {

        const fetchItem = async () => {
            const item_id = window.location.pathname.split('/')[2]

            let { data: pin, error } = await supabase
            .from('pins')
            .select('*')
            .eq('item_id', item_id)

            setItem(pin? pin[0] : '')
            setLoadMap(true)
        }
        
        fetchItem()
    }, [])


    return (
        <div className='flex flex-row w-full h-full justify-center items-center gap-4 text-white'>
            <div className='flex flex-col w-[30%] h-[60%] items-center gap-4'>
                <div className='flex flex-row w-full h-[40%] gap-4'>
                    <div className='flex flex-col w-1/2 h-full items-center gap-4'>
                        <div className='flex items-center justify-center w-full h-[30%] bg-mainHover border-[1px] border-gray-600 rounded-lg'>
                            <h1 className='text-lg font-semibold text-gtGold'>{item?.item}</h1>
                        </div>
                        <div className='flex items-center justify-center w-full h-[70%] border-[1px] border-gray-600 bg-mainHover rounded-lg'>
                            <p className='px-2 text-sm text-gtGold'>{item?.description}</p>
                        </div>           
                    </div>
                    <div className='flex flex-col items-center justify-center w-1/2 h-full bg-mainHover border-[1px] border-gray-600 rounded-lg'>
                        <h1 className='text-9xl text-gtGold'>{item?.claim_requests}</h1>
                        <p className='text-sm text-gray-400'>Claim Requests</p>
                    </div>
                </div>
                <div className='flex w-full h-[60%] bg-mainHover border-[1px] border-gray-600 rounded-lg'>
                    
                </div>
            </div>
            <div className='flex w-[60%] h-[60%] bg-mainHover border-[1px] border-gray-600 rounded-lg'>
                {loadMap?

                <DisplayMap 
                    apiKey={apiKey} 
                    lat={item?.x_coordinate? item.x_coordinate : 0} 
                    lng={item?.y_coordinate? item.y_coordinate : 0}
                    item={item?.item? item.item : ''}
                />

                :

                null

                }
            </div>
        </div>
    )
}

export default LostItemDisplay