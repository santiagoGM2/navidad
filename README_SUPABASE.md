# 🎯 Configuración de Supabase - Resumen

## ✅ Lo que ya está hecho:

- ✅ Cliente de Supabase configurado (`lib/supabase.ts`)
- ✅ API Route creada (`app/api/daily-phrase/route.ts`)
- ✅ Componente React creado (`components/DailyPhrase.tsx`)
- ✅ Script SQL listo (`supabase/schema.sql`)
- ✅ Script de prueba creado (`scripts/test-supabase.js`)
- ✅ Componente integrado en la Home

## 📝 Lo que TÚ necesitas hacer:

### 1. Obtener la Anon Key
Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/settings/api

Copia la **anon public** key (la clave larga que empieza con `eyJ...`)

### 2. Crear `.env.local`
En la raíz del proyecto, crea `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lrcgsdmnmnwphnhdzqia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=pega_aqui_la_anon_key
```

### 3. Ejecutar el SQL
Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/sql/new

Copia TODO el contenido de `supabase/schema.sql` y ejecútalo.

### 4. Probar
```bash
npm run test:supabase
```

Si ves "✅ Conexión exitosa!", reinicia el servidor:
```bash
npm run dev
```

## 🎉 Listo!

Ve a http://localhost:3000 y verás la frase del día funcionando.

---

📖 Guías detalladas:
- `QUICK_START.md` - Setup rápido
- `SETUP_COMPLETO.md` - Guía completa paso a paso

