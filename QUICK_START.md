# ⚡ Quick Start - Setup Rápido

## 🎯 3 Pasos Rápidos

### 1️⃣ Obtener Anon Key
- Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/settings/api
- Copia la **anon public** key

### 2️⃣ Crear .env.local
Crea el archivo `.env.local` en la raíz con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lrcgsdmnmnwphnhdzqia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=pega_aqui_la_anon_key
```

### 3️⃣ Ejecutar SQL
- Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/sql/new
- Copia el contenido de `supabase/schema.sql`
- Pégalo y ejecuta (Run)

## ✅ Verificar

```bash
npm run test:supabase
```

Si ves "✅ Conexión exitosa!", todo está listo.

## 🚀 Reiniciar

```bash
npm run dev
```

Ve a http://localhost:3000 y deberías ver la frase del día.

---

📖 Para más detalles, ver `SETUP_COMPLETO.md`

