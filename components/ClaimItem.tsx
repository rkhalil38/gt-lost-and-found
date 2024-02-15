import Link from 'next/link'
import React from 'react'
import { IoMdClose } from 'react-icons/io'

const ClaimItem = ({setClaim} : {setClaim: Function}) => {
  return (
    <div className='flex flex-col animate-in fixed items-center gap-4 border-[1px] border-gray-600 w-1/2 h-3/4 rounded-lg bg-mainTheme shaodw-lg z-40'>
        <button onClick={() => setClaim(false)} className='flex absolute rounded-lg duration-300 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-white text-xl'>
          <IoMdClose/>
        </button>

    </div>
  )
}

export default ClaimItem