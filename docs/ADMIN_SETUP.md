# Configuración del área privada (Admin)

## 1. Variables de entorno

En `.env.local` (nunca subas este archivo):

```bash
# Generar hash de contraseña y secreto de sesión:
node scripts/generate-auth-hash.js
# Copiar AUTH_PASSWORD_HASH y AUTH_SESSION_SECRET a .env.local

# Supabase (servidor): para subir fotos diarias
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

Usuarios permitidos: **Tefy** y **Santi**. Contraseña por defecto del script: **Teamo**.

## 2. Supabase: tabla y bucket

### Tabla `daily_memories`

En el SQL Editor de Supabase, ejecutá el contenido de:

- `supabase/daily_memories.sql`

Eso crea la tabla y las políticas RLS.

### Bucket de Storage

1. En Supabase: **Storage** → **New bucket**.
2. Nombre: `daily-memories`.
3. **Public bucket**: activado (para poder mostrar imágenes en Recap sin signed URLs).
4. Crear el bucket.
5. En **Policies** del bucket, asegurate de que la carga la haga solo el backend (vía service role). La lectura pública suele estar permitida por defecto en buckets públicos.

## 3. Rutas

- **Públicas**: todo el sitio excepto `/admin/*`.
- **Privadas** (requieren login):
  - `/admin` → redirige a `/admin/dashboard`
  - `/admin/dashboard` — panel con estadísticas y enlaces
  - `/admin/subir-foto` — subir foto diaria (1 por día por usuario)
  - `/admin/recuerdos` — listado de fotos
  - `/admin/recap` — slideshow del año

Login: `/admin/login` (usuario y contraseña).

## 4. Seguridad

- Contraseña hasheada con scrypt (nunca en texto plano).
- Cookie de sesión firmada (HMAC), httpOnly, Secure en producción.
- Validación de sesión en servidor (layout y API).
- Subida de fotos: solo con sesión válida y máximo 1 por día por usuario (validado en API).
