
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrcgsdmnmnwphnhdzqia.supabase.co'
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyY2dzZG1ubW53cGhuaGR6cWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTE4MDcsImV4cCI6MjA4MjYyNzgwN30.yV_j8quBmWSrP32n1iQ-BCFbS5IYAnduV03zqoYQpdY'

/**
 * Returns the best available key for Supabase operations on the server.
 * Priority: SUPABASE_SERVICE_ROLE_KEY > NEXT_PUBLIC_SUPABASE_ANON_KEY > Hardcoded Fallback
 */
export function getSupabaseConfig() {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL).trim()
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY).trim()

    let effectiveKey = anonKey
    let usingServiceKey = false

    if (serviceKey && !serviceKey.includes('REEMPLAZAR') && serviceKey.length > 30) {
        effectiveKey = serviceKey
        usingServiceKey = true
    }

    return { url, key: effectiveKey, usingServiceKey }
}
