import LostItemDisplay from '@/components/LostItemDisplay';
import UnivHeader from '@/components/UnivHeader'
import React from 'react'

const page = () => {

    const apiKey = process.env.GOOGLE_MAPS_KEY? process.env.GOOGLE_MAPS_KEY : "";

    return (
        <div className='flex flex-col justify-center w-screen h-screen bg-mainTheme'>
            <UnivHeader apiKey={apiKey}/>
            <LostItemDisplay />
        </div>
    )
}

export default page