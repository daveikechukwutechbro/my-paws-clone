'use client'

import CheckFootprint from '@/components/CheckFootprint'
import NavigationBar from '@/components/NavigationBar'
import TabContainer from '@/components/TabContainer'
import { TabProvider } from '@/contexts/TabContext'

export default function Home() {
  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-3xl px-4 py-5 text-center text-sm text-slate-300 sm:px-6">
          <p className="font-semibold text-white">Welcome to Paws Mini App Clone</p>
          <p className="mt-2 text-slate-400">Login has been removed so you can start fresh.</p>
        </div>

        <CheckFootprint />
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  )
}
