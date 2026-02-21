import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from './supabase-config'

function getServerClient() {
	const { url, key } = getSupabaseConfig()
	return createClient(url, key)
}

export const supabaseAdmin = getServerClient()
export { getSupabaseConfig } from './supabase-config'
