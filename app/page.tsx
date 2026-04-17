'use client'

import { useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'

import CheckFootprint from '@/components/CheckFootprint'
import NavigationBar from '@/components/NavigationBar'
import TabContainer from '@/components/TabContainer'
import { TabProvider } from '@/contexts/TabContext'

export default function Home() {

  useEffect(() => {
    console.log("🔥 App started");

    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (!user) {
      console.log("❌ No Telegram user found (open inside Telegram)");
      return;
    }

    const userId = user.id.toString();
    const username = user.username || "guest";

    async function handleUser() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        // If real error (not "user not found")
        if (error && error.code !== 'PGRST116') {
          console.error("❌ Fetch error:", error);
          return;
        }

        if (!data) {
          // 👉 NEW USER (SIGN UP)
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: userId,
                username: username,
                balance: 0
              }
            ]);

          if (insertError) {
            console.error("❌ Insert error:", insertError);
          } else {
            console.log("✅ New user created");
          }

        } else {
          // 👉 EXISTING USER (LOGIN)
          console.log("✅ Welcome back:", data);
        }

      } catch (err) {
        console.error("🚨 Unexpected error:", err);
      }
    }

    handleUser();
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