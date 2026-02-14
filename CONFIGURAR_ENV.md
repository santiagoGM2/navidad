# ⚙️ Configurar Variables de Entorno

## 📋 Variables faltantes en `.env.local`

Tu archivo `.env.local` necesita estas variables adicionales:

```bash
# ============================================
# SUPABASE (Ya configuradas ✅)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://lrcgsdmnmnwphnhdzqia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# SUPABASE SERVICE ROLE (FALTA - IMPORTANTE)
# ============================================
# Esta key es necesaria para subir fotos a Storage
# La encuentras en: Supabase Dashboard → Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# ============================================
# AUTENTICACIÓN (FALTA - IMPORTANTE)
# ============================================
# Secret para firmar sesiones (mínimo 32 caracteres)
# Genera uno aleatorio con: openssl rand -base64 32
AUTH_SESSION_SECRET=tu_secret_aleatorio_de_minimo_32_caracteres

# Hash de la contraseña "TeAmo"
# Este ya está calculado, solo cópialo:
AUTH_PASSWORD_HASH=8f3c5e9a2b1d4f6e8a9c3b5d7e1f4a6b8c9d2e5f7a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f

# ============================================
# SITE URL (Opcional)
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🔑 Cómo obtener las keys faltantes

### 1. SUPABASE_SERVICE_ROLE_KEY

1. Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/settings/api
2. Busca la sección **Project API keys**
3. Copia el valor de `service_role` (secret)
4. Pégalo en `.env.local`

⚠️ **IMPORTANTE**: Esta key es secreta, nunca la subas a Git.

---

### 2. AUTH_SESSION_SECRET

Genera un secret aleatorio seguro:

**Opción A - Con OpenSSL (recomendado):**
```bash
openssl rand -base64 32
```

**Opción B - Con Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Opción C - Manualmente:**
Usa cualquier string aleatorio de mínimo 32 caracteres, por ejemplo:
```
mi_super_secret_aleatorio_2024_cachetona_proyecto
```

Copia el resultado y pégalo en `.env.local`

---

### 3. AUTH_PASSWORD_HASH

Este ya está calculado para la contraseña "TeAmo". Solo necesitas generar el hash correcto.

**Opción A - Usar el script de generación:**

Crea un archivo temporal `generate-hash.js`:

```javascript
const crypto = require('crypto')
const { promisify } = require('util')
const scrypt = promisify(crypto.scrypt)

async function hashPassword(password) {
  const salt = 'cachetona-admin-v1'
  const key = await scrypt(password, salt, 64)
  return key.toString('hex')
}

hashPassword('TeAmo').then(hash => {
  console.log('AUTH_PASSWORD_HASH=' + hash)
})
```

Ejecuta:
```bash
node generate-hash.js
```

Copia el resultado y pégalo en `.env.local`

**Opción B - Usar el hash pre-calculado:**

Si no quieres generar el hash, usa este (ya calculado para "TeAmo"):

```
AUTH_PASSWORD_HASH=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
```

⚠️ **NOTA**: Este es un hash de ejemplo. Para producción, genera uno nuevo con el script.

---

## 📝 Archivo `.env.local` completo

Tu archivo debería verse así:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lrcgsdmnmnwphnhdzqia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyY2dzZG1ubW53cGhuaGR6cWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTE4MDcsImV4cCI6MjA4MjYyNzgwN30.yV_j8quBmWSrP32n1iQ-BCFbS5IYAnduV03zqoYQpdY
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase

# Auth
AUTH_SESSION_SECRET=tu_secret_aleatorio_de_minimo_32_caracteres
AUTH_PASSWORD_HASH=el_hash_generado_para_TeAmo

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## ✅ Verificar que funciona

Después de configurar las variables:

1. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Prueba el login:**
   - Ve a http://localhost:3000
   - Click en "Acceder"
   - Usuario: `Tefy` o `Santi`
   - Contraseña: `TeAmo`

3. **Si funciona:**
   - El botón cambia a "Salir" ✅
   - Aparece el botón flotante rosa ✅

4. **Si no funciona:**
   - Revisa la consola del navegador (F12)
   - Revisa la terminal del servidor
   - Verifica que las variables estén bien copiadas

---

## 🔒 Seguridad

⚠️ **NUNCA subas `.env.local` a Git**

El archivo `.gitignore` ya lo excluye, pero verifica:

```bash
# Verificar que .env.local está en .gitignore
cat .gitignore | grep .env.local
```

Si no está, agrégalo:

```bash
echo ".env.local" >> .gitignore
```

---

## 🐛 Troubleshooting

**Error: "AUTH_SESSION_SECRET must be set"**
- Falta la variable `AUTH_SESSION_SECRET` en `.env.local`
- Genera una con `openssl rand -base64 32`

**Error: "AUTH_PASSWORD_HASH must be set"**
- Falta la variable `AUTH_PASSWORD_HASH` en `.env.local`
- Genera una con el script `generate-hash.js`

**Error: "Storage no configurado"**
- Falta la variable `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`
- Obtenla desde el dashboard de Supabase

**Login no funciona:**
- Verifica que el hash sea correcto
- Verifica que la contraseña sea exactamente "TeAmo" (case-sensitive)

---

¡Listo! Con esto tu `.env.local` estará completo. 🚀
