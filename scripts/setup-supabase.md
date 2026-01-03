# Setup de Supabase - Pasos Rápidos

## 1. Obtener la Anon Key

1. Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia
2. Ve a **Settings** (⚙️) en el menú lateral
3. Click en **API**
4. Busca la sección **Project API keys**
5. Copia la clave **anon public** (no la service_role)
6. Pégala en `.env.local` reemplazando `TU_ANON_KEY_AQUI`

## 2. Ejecutar el Script SQL

1. En el dashboard de Supabase, ve a **SQL Editor** (en el menú lateral)
2. Click en **New query**
3. Copia TODO el contenido del archivo `supabase/schema.sql`
4. Pégalo en el editor
5. Click en **Run** (o presiona Ctrl+Enter)
6. Deberías ver "Success. No rows returned"

## 3. Verificar que Funcionó

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver la tabla `daily_phrases`
3. Debería tener 8 frases de ejemplo

## 4. Reiniciar el Servidor

```bash
# Detén el servidor (Ctrl+C) y reinícialo
npm run dev
```

## 5. Probar

Ve a http://localhost:3000 y deberías ver la frase del día funcionando.


