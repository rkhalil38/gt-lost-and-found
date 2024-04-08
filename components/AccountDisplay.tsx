"use client";
import { fetchUser, fetchProfile, Profile } from '@/db/database';
import { AuthError, User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react'

const AccountDisplay = () => {

    const [ user, setUser ] = useState<User>();
    const [ profile, setProfile ] = useState<Profile>();

    useEffect(() => {
        const fetchThisUser = async () => {
            const user = await fetchUser();
            
            if (user instanceof AuthError) {
              return;
            }

            const profile = await fetchProfile(user.id);

            if ("message" in profile) {
              return;
            }
      
            setUser(user);
            setProfile(profile);
          };
      
          fetchThisUser();
    }, [])

  return (
    <div className='flex flex-col gap-1 text-white items-center justify-center'>
        <p>{profile?.username}</p>
        <p>{user?.email}</p>
        <p>{`Items Found: `}{profile?.items_found}</p>
        <p>{`Date Joined:`} {user?.created_at.slice(0, 10)}</p>
    </div>
  )
}

export default AccountDisplay