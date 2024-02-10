import LostItems from '@/components/LostItems';
import UnivHeader from '@/components/UnivHeader'
import React from 'react'

const page = () => {

    const apiKey = process.env.GOOGLE_MAPS_KEY? process.env.GOOGLE_MAPS_KEY : "";

    return (
        <div className='flex flex-col bg-mainTheme items-center justify-center min-h-screen w-screen'>
            <UnivHeader apiKey={apiKey} />
            <LostItems />
        </div>
    )
}

export default page