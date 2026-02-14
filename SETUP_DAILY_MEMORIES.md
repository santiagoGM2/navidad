# Setup: Daily Memories (Fotos del Momento)

## 📋 Pasos para configurar la base de datos

### 1. Acceder al SQL Editor de Supabase

Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/sql/new

### 2. Ejecutar el SQL

1. Abre el archivo `supabase/daily_memories.sql`
2. Copia TODO el contenido
3. Pégalo en el editor SQL de Supabase
4. Click en **Run**

### 3. Verificar que funcionó

Deberías ver:
- ✅ Tabla `daily_memories` creada
- ✅ Índices creados
- ✅ Políticas RLS configuradas
- ✅ Bucket `daily-memories` creado en Storage

## 🧪 Probar la funcionalidad

1. Inicia sesión en el sitio con:
   - Usuario: `Tefy` o `Santi`
   - Contraseña: `TeAmo`

2. Verás un botón flotante rosa en la esquina inferior derecha

3. Click en el botón y selecciona:
   - **Tomar foto**: Abre la cámara del dispositivo
   - **Subir desde galería**: Selecciona una imagen existente

4. La foto se subirá a Supabase y se guardará en la base de datos

## 📊 Ver las fotos subidas

Puedes ver las fotos en:
- Supabase Dashboard → Table Editor → `daily_memories`
- Supabase Dashboard → Storage → `daily-memories`

## 🔒 Seguridad

- Solo usuarios autenticados (Tefy o Santi) pueden subir fotos
- Máximo 1 foto por usuario por día
- Tamaño máximo: 5MB
- Formatos permitidos: JPEG, PNG, WebP
- Las fotos son públicas (para futuro recap)

## 🎯 Próximos pasos

Esta funcionalidad está lista para:
- Construir un recap/slideshow de momentos
- Crear una galería privada
- Generar un video de recuerdos
