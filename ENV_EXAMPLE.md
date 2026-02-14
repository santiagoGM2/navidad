# Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto.

## Públicas (Supabase)

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## Privadas (nunca en frontend)

### Autenticación admin (obligatorio para /admin)

- `AUTH_PASSWORD_HASH`: hash scrypt de la contraseña (64 bytes en hex = 128 caracteres).
- `AUTH_SESSION_SECRET`: secreto para firmar la cookie de sesión (mín. 32 caracteres).

Generar ambos:

```bash
node scripts/generate-auth-hash.js
```

Copia la salida a `.env.local`. Usuarios permitidos: **Tefy** y **Santi**. Contraseña por defecto del script: **Teamo**.

### Supabase (solo servidor, para subir fotos diarias)

- `SUPABASE_SERVICE_ROLE_KEY`: service role key de Supabase (Settings > API > service_role).
  Solo se usa en API routes del servidor para subir a Storage e insertar en `daily_memories`.

## Cómo obtener credenciales Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea o selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (solo en servidor, nunca expongas)


