'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

import CheckFootprint from '@/components/CheckFootprint'
import NavigationBar from '@/components/NavigationBar'
import TabContainer from '@/components/TabContainer'
import { TabProvider } from '@/contexts/TabContext'

export default function Home() {
  const [message, setMessage] = useState('Checking login...')

  useEffect(() => {
    console.log('🔥 App started')

    const tg = (window as any).Telegram?.WebApp
    const user = tg?.initDataUnsafe?.user

    if (!user) {
      console.log('❌ No Telegram user found (open inside Telegram)')
      setMessage('Please open this app inside the Telegram Web App to log in.')
      return
    }

    const userId = user.id.toString()
    const username = user.username || 'guest'

    async function handleUser() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (error) {
          console.error('❌ Supabase query error:', error)
          setMessage('Unable to access the users table. Check Supabase table and policies.')
          return
        }

        if (!data) {
          const { error: insertError } = await supabase.from('users').insert([
            {
              id: userId,
              username,
              balance: 0
            }
          ])

          if (insertError) {
            console.error('❌ Insert error:', insertError)
            setMessage('Unable to create a new user in Supabase.')
            return
          }

          console.log('✅ New user created')
          setMessage(`Welcome, ${username}! Your account was created.`)
          return
        }

        console.log('✅ Existing user found:', data)
        setMessage(`Welcome back, ${username}!`)
      } catch (err) {
        console.error('🚨 Unexpected error:', err)
        setMessage('Unexpected error during login. Check the console for details.')
      }
    }

    handleUser()
  }, [])

  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        <div className="px-4 py-5 text-center text-sm text-slate-300 sm:px-6">
          {message}
        </div>
        <CheckFootprint />
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  )
}
