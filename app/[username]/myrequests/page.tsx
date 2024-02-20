import UnivHeader from '@/components/UnivHeader'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'My Requests',
    description: 'My Pins Page',

}

const page = () => {

    const apiKey = process.env.GOOGLE_MAPS_KEY? process.env.GOOGLE_MAPS_KEY : "";

    return (
        <div className='flex flex-col w-full h-full'>
            <UnivHeader apiKey={apiKey} />
        </div>
    )
}

export default page