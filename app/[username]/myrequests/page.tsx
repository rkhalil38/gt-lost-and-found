import UnivHeader from '@/components/UnivHeader'
import React from 'react'
import { Metadata } from 'next'

type Props = {
    params: {
        username: string
    }

}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {

    const username = params.username

    return {
        title: `${username} | My Requests`,
    }
}

const page = () => {

    const apiKey = process.env.GOOGLE_MAPS_KEY? process.env.GOOGLE_MAPS_KEY : "";

    return (
        <div className='flex flex-col bg-mainTheme items-center w-screen min-h-screen'>
            <UnivHeader apiKey={apiKey} />
        </div>
    )
}

export default page