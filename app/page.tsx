'use client'

import { useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'

import CheckFootprint from '@/components/CheckFootprint'
import NavigationBar from '@/components/NavigationBar'
import TabContainer from '@/components/TabContainer'
import { TabProvider } from '@/contexts/TabContext'

export default function Home() {

  useEffect(() => {
    console.log("🔥 App loaded - useEffect running");

    async function testDB() {
      try {
        const { data, error } = await supabase.from('users').select('*')

        if (error) {
          console.error("❌ Supabase ERROR:", error)
        } else {
          console.log("✅ Supabase DATA:", data)
        }
      } catch (err) {
        console.error("🚨 Unexpected ERROR:", err)
      }
    }

    testDB()
  }, [])

  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        <CheckFootprint />
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  )
}