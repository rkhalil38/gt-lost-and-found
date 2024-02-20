import UnivHeader from '@/components/UnivHeader';
import { Metadata, ResolvingMetadata } from 'next';
import React from 'react'

type Props = {
    params: {
        username: string,
        item_id: string
    }

}

export async function generateMetadata(
    { params }: Props, parent: ResolvingMetadata
): Promise<Metadata> {

    const itemID = params.item_id
    const username = params.username

    return {
        title: `${username} | ${itemID}`,
    }

}

const page = () => {


    const apiKey = process.env.GOOGLE_MAPS_KEY? process.env.GOOGLE_MAPS_KEY : "";

    return (
        <div className='flex flex-col bg-mainTheme items-center w-screen min-h-screen'>
            <UnivHeader apiKey={apiKey}/>

        </div>
    )
}

export default page