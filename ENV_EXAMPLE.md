# Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## Cómo obtener las credenciales:

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea o selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`


