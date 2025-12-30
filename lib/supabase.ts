import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrcgsdmnmnwphnhdzqia.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NODE_ENV === 'development') {
	console.warn('⚠️  Supabase no está configurado. Crea un archivo .env.local con:')
	console.warn('   NEXT_PUBLIC_SUPABASE_URL=https://lrcgsdmnmnwphnhdzqia.supabase.co')
	console.warn('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui')
	console.warn('   Obtén la key en: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/settings/api')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

