'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

import CheckFootprint from '@/components/CheckFootprint'
import NavigationBar from '@/components/NavigationBar'
import TabContainer from '@/components/TabContainer'
import { TabProvider } from '@/contexts/TabContext'

type TelegramUser = {
  id: string
  username: string
}

export default function Home() {
  const [message, setMessage] = useState('Checking login...')
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [loginMethod, setLoginMethod] = useState<'telegram' | 'google' | null>(null)
  const [loadingGoogle, setLoadingGoogle] = useState(false)

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
    setTelegramUser({ id: userId, username })
    setLoginMethod('telegram')

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

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href
        }
      })

      if (error) {
        console.error('❌ Google sign-in error:', error)
        setMessage('Google login failed. Please try again.')
      } else {
        setLoginMethod('google')
        setMessage('Redirecting for Google sign-in...')
      }
    } catch (err) {
      console.error('🚨 Unexpected Google login error:', err)
      setMessage('Unexpected error during Google login. Check the console.')
    } finally {
      setLoadingGoogle(false)
    }
  }

  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-3xl px-4 py-5 text-center text-sm text-slate-300 sm:px-6">
          {telegramUser && loginMethod === 'telegram' ? (
            <div>
              <p className="font-semibold text-white">Telegram login detected</p>
              <p className="mt-1">Logged in as <strong>@{telegramUser.username}</strong></p>
              <p className="mt-1 text-slate-400">Your Telegram ID: {telegramUser.id}</p>
            </div>
          ) : (
            <p>{message}</p>
          )}

          <div className="mt-4 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loadingGoogle}
              className="rounded-full border border-slate-600 bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingGoogle ? 'Redirecting to Google...' : 'Sign in with Google'}
            </button>
            <p className="text-xs text-slate-500">If Telegram login is not available, use Google login instead.</p>
          </div>
        </div>

        <CheckFootprint />
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  )
}
