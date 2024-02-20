"use client";
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import ClipLoader from 'react-spinners/ClipLoader';

const ClaimItem = ({ path, itemID, username, claimStatus } : { path: string, itemID: string, username: string, claimStatus: string }) => {

  const supabase = createClient()
  const [ user, setUser ] = useState<User | null>()
  const [ reasoning, setReasoning ] = useState<string>('')
  const [ requestMade, setRequestMade ] = useState<boolean>(false)

  useEffect(() => {
            
    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)

    }

    fetchUser()

  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReasoning(e.target.value)
  }

  const completedForm = () => {
    return reasoning.length > 0
  }

  const claimItem = async () => {
    
    const { data, error } = await supabase
    .from('requests')
    .insert([
      { description: reasoning, item_id: itemID, request_id: username.toUpperCase().replace(' ', '') + itemID},
    ])
    .select()
                
    setRequestMade(true)
  
  }

  return (
    <div className='flex flex-col p-4 animate-in fixed gap-4 border-[1px] border-gray-600 w-1/2 h-[60%] rounded-lg bg-mainTheme shaodw-lg z-40'>

      {claimStatus?

        <div className='flex w-full h-full'>
          {user?

            (claimStatus === 'Claim Item'?

              <div className='flex flex-col gap-4 w-full h-full'>
                <Link href={path + '?claim=false'} className='flex absolute rounded-lg duration-300 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-white text-xl'>
                  <IoMdClose/>
                </Link>
                <h1 className='font-bold text-2xl text-gtGold'>You are claiming this item as 
                  <a className='text-white'> {username}</a>
                </h1>
                <label htmlFor='reasoning' className='text-white'>Please provide valid reasoning that this is your item.</label>
                <textarea onChange={handleChange} name='reasoning' className='w-full h-[70%] resize-none border-[1px] focus:border-gtGold focus:outline-none bg-mainTheme text-white rounded-lg p-4'></textarea>
                <button disabled={!completedForm()} onClick={claimItem} className={`flex disabled:bg-gray-700 disabled:text-gray-400 w-36 h-10 absolute bottom-4 right-4 text-xs rounded-lg border-[1px] items-center justify-center bg-gtGold text-white hover:bg-gtGoldHover`}>
                  Submit Request
                </button>
              </div>
              
              :

              <div className='flex flex-col gap-2 w-full h-full items-center justify-center'>
                <Link href={path + '?claim=false'} className='flex absolute rounded-lg duration-300 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-white text-xl'>
                  <IoMdClose/>
                </Link>
                <h1>You have already submitted a request for this item.</h1>
                <Link href='/lostitems' 
                className='flex h-10 text-sm duration-300 p-4 items-center justify-center bg-gtGold text-white rounded-lg hover:bg-gtGoldHover'>
                  Find another item
                </Link>
              </div>

            )

            :

            <div className='flex flex-col gap-2 w-full h-full items-center justify-center'>
                <h1>Sign in to claim this item.</h1>
                <Link href='/login' className='flex h-10 text-sm duration-300 p-4 items-center justify-center bg-gtGold text-white rounded-lg hover:bg-gtGoldHover'>
                  Sign in
                </Link>
              </div>
            
          }
        </div>

        :

        (requestMade?

          <div className='flex w-full h-full items-center justify-center'>
            <Link href={path + '?claim=false'} className='flex absolute rounded-lg duration-300 justify-center items-center w-8 h-8 top-[9px] right-2 text-gray-600 bg-mainHover hover:text-white text-xl'>
              <IoMdClose/>
            </Link>
            <h1 className='text-gtGold'>Request made!</h1>
          </div>

          :

          <div className='flex w-full h-full items-center justify-center'>
            <ClipLoader color='#C29B0C' size={65}/>
          </div>
        
        )

      }

    </div>
  )
}

export default ClaimItem