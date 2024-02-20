import UnivHeader from '@/components/UnivHeader'
import React from 'react'
import { Metadata } from 'next'
import MyItems from '@/components/MyItems'

export const metadata: Metadata = {
    title: 'My Found Items',
    description: 'My Found Items Page',

}

const page = () => {

    const apiKey = process.env.GOOGLE_MAPS_KEY? process.env.GOOGLE_MAPS_KEY : "";

    return (
        <div className='flex flex-col bg-mainTheme items-center w-screen min-h-screen'>
            <UnivHeader apiKey={apiKey}/>
            <MyItems />
        </div>
    )
}

export default page