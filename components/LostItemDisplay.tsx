"use client";
import React, { useEffect, useState } from 'react'

const LostItemDisplay = () => {

    const [ itemID, setItemID ] = useState('')

    useEffect(() => {
        const item_id = window.location.pathname.split('/')[2]
        setItemID(item_id)
    }, [])

    useEffect

    return (
        <div className='flex items-center text-white'>
            {itemID}
        </div>
    )
}

export default LostItemDisplay