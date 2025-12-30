# 🚀 Setup Completo de Supabase - Guía Paso a Paso

## ✅ Información del Proyecto

- **URL del Dashboard:** https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia
- **URL del Proyecto:** `https://lrcgsdmnmnwphnhdzqia.supabase.co`
- **Contraseña DB:** `31861800sgM*` (guardada de forma segura)

## 📋 Paso 1: Obtener la Anon Key

1. Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia
2. En el menú lateral, click en **Settings** (⚙️)
3. Click en **API** (en la sección Project Settings)
4. Busca la sección **Project API keys**
5. Copia la clave **anon public** (es la clave larga que empieza con `eyJ...`)
6. **NO copies la service_role key** (esa es secreta)

## 📋 Paso 2: Crear el archivo .env.local

1. En la raíz del proyecto, crea un archivo llamado `.env.local`
2. Copia y pega esto (reemplaza `TU_ANON_KEY_AQUI` con la key que copiaste):

```env
NEXT_PUBLIC_SUPABASE_URL=https://lrcgsdmnmnwphnhdzqia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
```

**Ejemplo:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://lrcgsdmnmnwphnhdzqia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 Paso 3: Ejecutar el Script SQL

1. En el dashboard de Supabase, ve a **SQL Editor** (en el menú lateral)
2. Click en **New query** (botón verde)
3. Abre el archivo `supabase/schema.sql` de este proyecto
4. Copia **TODO** el contenido del archivo
5. Pégalo en el editor SQL de Supabase
6. Click en **Run** (o presiona `Ctrl+Enter` / `Cmd+Enter`)
7. Deberías ver: **"Success. No rows returned"**

## 📋 Paso 4: Verificar que Funcionó

1. En el dashboard, ve a **Table Editor** (en el menú lateral)
2. Deberías ver la tabla `daily_phrases`
3. Click en la tabla para ver las 8 frases de ejemplo que se insertaron

## 📋 Paso 5: Probar la Conexión

Ejecuta este comando en la terminal:

```bash
npm run test:supabase
```

Deberías ver:
```
✅ Conexión exitosa!
📝 Frases encontradas: 8
```

## 📋 Paso 6: Reiniciar el Servidor

```bash
# Detén el servidor si está corriendo (Ctrl+C)
# Luego reinícialo
npm run dev
```

## 📋 Paso 7: Ver el Resultado

1. Ve a http://localhost:3000
2. Deberías ver la **Frase del Día** aparecer después del contador de tiempo
3. Click en "Ver otra frase" para probar que funciona

## 🎉 ¡Listo!

Si todo funcionó correctamente, ya tienes:
- ✅ Base de datos configurada
- ✅ Tabla creada con frases de ejemplo
- ✅ Componente funcionando en la Home
- ✅ API route configurada

## 🔧 Solución de Problemas

### Error: "Missing Supabase environment variables"
- Verifica que el archivo `.env.local` existe
- Verifica que tiene las dos variables correctas
- Reinicia el servidor después de crear/editar `.env.local`

### Error: "No hay frases disponibles"
- Ve a Supabase Dashboard > Table Editor
- Verifica que la tabla `daily_phrases` existe
- Verifica que hay frases con `active = true`

### Error de conexión
- Verifica que la URL del proyecto es correcta
- Verifica que la Anon Key es la correcta (anon public, no service_role)
- Verifica que ejecutaste el script SQL correctamente

## 📝 Añadir Más Frases

Puedes añadir frases de dos formas:

### Opción 1: Desde Supabase Dashboard
1. Ve a **Table Editor** > `daily_phrases`
2. Click en **Insert** > **Insert row**
3. Llena:
   - `text`: Tu frase
   - `author`: (opcional)
   - `active`: true
4. Click en **Save**

### Opción 2: Desde SQL Editor
```sql
INSERT INTO daily_phrases (text, author, active) VALUES
('Tu frase personalizada aquí', 'Autor (opcional)', true);
```

