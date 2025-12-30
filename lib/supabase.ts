import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Validar que las credenciales existan solo en producción para evitar errores de build
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NODE_ENV === 'development') {
	console.warn('⚠️  Supabase no está configurado. Asegúrate de tener las variables de entorno.')
}

// Cliente robusto que no explota si faltan credenciales (útil para build)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
