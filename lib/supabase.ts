import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Named factory so hooks can call createClient() following the project convention
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
