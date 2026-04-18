import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uxzqkxfqslmyaofzotex.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4enFreGZxc2xteWFvZnpvdGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzU0NTAsImV4cCI6MjA5MTgxMTQ1MH0.NVqoVAvb1nClF8FLzzOOq5e-0lkY6KH53V5Xpd0DDIE'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and anon key must be set in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)