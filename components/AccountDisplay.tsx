"use client";
import { fetchUser } from '@/db/database';
import { AuthError, User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react'

const AccountDisplay = () => {

    const [ user, setUser ] = useState<User>();

    useEffect(() => {
        const fetchThisUser = async () => {
            const user = await fetchUser();
      
            if (user instanceof AuthError) {
              return;
            }
      
            setUser(user);
          };
      
          fetchThisUser();
    }, [])

  return (
    <div className='flex flex-col gap-1 text-white items-center justify-center'>
        <p>{user?.email}</p>
        <p>{user?.id}</p>
    </div>
  )
}

export default AccountDisplay