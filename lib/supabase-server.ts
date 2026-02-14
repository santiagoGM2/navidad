/**
 * Supabase client with service role for server-only use (admin uploads, etc.).
 * Never expose this client or the service role key to the client.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function getServerClient() {
	if (!supabaseUrl || !serviceRoleKey) {
		return null
	}
	return createClient(supabaseUrl, serviceRoleKey)
}

export const supabaseAdmin = getServerClient()
