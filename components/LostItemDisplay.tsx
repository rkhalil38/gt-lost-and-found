"use client";
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/supabase';
import DisplayMap from './DisplayMap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { User } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import ClaimItem from './ClaimItem';
import Overlay from './Overlay';
import Link from 'next/link';


type Pin = Database['public']['Tables']['pins']['Row']

const LostItemDisplay = ({apiKey} : {apiKey: string}) => {

    const supabase = createClient()

    const [ item, setItem ] = useState<Pin>()
    const [ loadMap, setLoadMap ] = useState<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ user, setUser ] = useState<User | null>()

    const search = useSearchParams()
    const [ claim, setClaim ] = useState<boolean>(search.get('claim')? true : false)
    const [ itemID, setItemID ] = useState<string>('')

    useEffect(() => {

        const fetchItem = async () => {
            const item_id = window.location.pathname.split('/')[2]
            setItemID(item_id)

            let { data: pin, error } = await supabase
            .from('pins')
            .select('*')
            .eq('item_id', item_id)

            setItem(pin? pin[0] : '')
            setLoading(false)
            setLoadMap(true)
        }
        
        fetchItem()
    }, [])

    useEffect(() => {
            
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
        }

        fetchUser()

    }, [])

    return (
        <div className='flex flex-row w-full h-full justify-center items-center gap-4 text-white'>
            {claim?

                <div className='flex z-30 items-center justify-center w-full h-full fixed'>
                    <ClaimItem setClaim={setClaim}/>
                    <Overlay on={claim} zIndex='z-30'/>
                </div>

                : null
            }       
            <div className='flex flex-col w-[30%] h-[60%] items-center gap-4'>
                <div className='flex flex-row w-full h-[40%] gap-4'>
                    <div className='flex flex-col w-1/2 h-full items-center gap-4'>
                        <div className='flex items-center justify-center w-full h-[30%] bg-mainHover border-[1px] border-gray-600 rounded-lg'>
                            <h1 className='text-lg font-semibold text-gtGold'>
                                {item?.item || <Skeleton height={20} width={80} baseColor='#B3A369'/>}
                            </h1>
                        </div>
                        <div className='flex flex-col justify-center items-center w-full h-[70%] border-[1px] border-gray-600 bg-mainHover rounded-lg'>
                            <p className='px-2 text-xl text-gtGold'>{item?.created_at.slice(0, 10) || <Skeleton height={20} width={120} baseColor='#B3A369'/>}</p>
                        </div>           
                    </div>
                    <div className='flex flex-col items-center justify-center w-1/2 h-full bg-mainHover border-[1px] border-gray-600 rounded-lg'>
                        <h1 className='text-9xl text-gtGold'>{item?.claim_requests != null? item?.claim_requests : <Skeleton height={100} width={100} baseColor='#B3A369'/>}</h1>
                        <p className='text-sm text-gray-400'>Claim Requests</p>
                    </div>
                </div>
                <div className='flex flex-col w-full h-[60%] gap-4 p-4 bg-mainHover border-[1px] border-gray-600 rounded-lg'>
                    <h1 className='text-2xl text-gtGold font-semibold'>
                        Found by {item?.user_name || <Skeleton height={20} width={120} baseColor='#B3A369'/>}
                    </h1>
                    <p className='text-sm h-40 text-gtGold'>
                        {item?.description? item?.description : <Skeleton height={20} width={120} baseColor='#B3A369'/>}
                    </p>
                    <button onClick={() => setClaim(true)} className='flex items-center justify-center text-sm hover:opacity-80 w-full h-10 border-[1px] border-gtGold bg-gtGoldHover rounded-lg duration-300'>
                        {user? 'Claim Item' : 'Sign in to claim item'}
                    </button>
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