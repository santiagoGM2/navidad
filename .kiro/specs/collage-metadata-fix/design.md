# Collage Metadata & Sync Fix - Design Document

## 📐 Architecture Overview

Este diseño implementa una solución robusta de 3 capas para garantizar sincronización inmediata, metadata precisa y optimización automática de archivos.

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DE 3 CAPAS                   │
└─────────────────────────────────────────────────────────────┘

Capa 1: Optimistic Update (PRINCIPAL)
  → Actualiza estado React inmediatamente
  → Render instantáneo (< 100ms)
  → Funciona siempre, sin dependencias externas

Capa 2: Refetch de Seguridad (BACKUP)
  → Se ejecuta 2 segundos después
  → Confirma consistencia con base de datos
  → Corrige cualquier discrepancia

Capa 3: Realtime Sync (BONUS)
  → Supabase Realtime para multi-usuario
  → Opcional, no crítico
  → Mejora experiencia colaborativa
```

## 🗄️ Database Schema Changes

### Migración SQL

```sql
-- =============================================
-- MIGRACIÓN: Agregar campos de metadata
-- =============================================

-- 1. Agregar nuevos campos
ALTER TABLE public.collage_recuerdos
ADD COLUMN IF NOT EXISTS fecha_captura TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS hora_captura TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Bogota',
ADD COLUMN IF NOT EXISTS ubicacion JSONB,
ADD COLUMN IF NOT EXISTS tamano_optimizado INTEGER,
ADD COLUMN IF NOT EXISTS formato_final TEXT;

-- 2. Migrar datos existentes
UPDATE public.collage_recuerdos
SET fecha_captura = fecha_subida
WHERE fecha_captura IS NULL;

-- 3. Crear índice para ordenamiento eficiente
CREATE INDEX IF NOT EXISTS idx_collage_fecha_captura 
ON public.collage_recuerdos (fecha_captura DESC NULLS LAST);

-- 4. Habilitar Realtime (opcional)
ALTER PUBLICATION supabase_realtime ADD TABLE collage_recuerdos;

-- 5. Verificación
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'collage_recuerdos'
AND table_schema = 'public'
ORDER BY ordinal_position;
```

### Esquema Completo

```typescript
interface CollageRecuerdo {
  // Campos existentes
  id: string
  url: string
  fecha_subida: string  // TIMESTAMPTZ - Fecha del servidor
  tipo: 'foto' | 'video'
  usuario_subio: string
  file_path?: string
  descripcion?: string
  created_at: string
  
  // Nuevos campos de metadata
  fecha_captura?: string  // TIMESTAMPTZ - Fecha real de EXIF
  hora_captura?: string   // TEXT - Hora legible "14:30:45"
  timezone?: string       // TEXT - "America/Bogota"
  ubicacion?: {           // JSONB - Coordenadas GPS
    lat: number
    lng: number
  } | null
  tamano_optimizado?: number  // INTEGER - Tamaño en bytes
  formato_final?: string      // TEXT - "image/webp"
}
```

## 🔄 Data Flow

### Flujo de Subida Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE SUBIDA DE IMAGEN                 │
└─────────────────────────────────────────────────────────────┘

1. Usuario selecciona archivo
   ↓
2. CaptureMemoryButton.handleFileUpload()
   ├─ Validar tipo de archivo
   ├─ Obtener ubicación (si es cámara)
   └─ Llamar processImageForUpload()
   ↓
3. processImageForUpload() [lib/upload-utils.ts]
   ├─ Convertir HEIC a WebP (si aplica)
   ├─ Extraer metadata EXIF
   │  ├─ DateTimeOriginal → capturedAt
   │  └─ GPS coordinates → location
   ├─ Comprimir y convertir a WebP
   │  ├─ Redimensionar a max 1200px
   │  └─ Calidad 85%
   └─ Retornar { finalFile, metadata }
   ↓
4. Crear FormData
   ├─ file: Blob WebP optimizado
   └─ metadata: JSON con fecha y ubicación
   ↓
5. POST /api/collage/upload
   ├─ Validar autenticación
   ├─ Validar permisos de admin
   ├─ Subir a Supabase Storage
   ├─ Insertar en collage_recuerdos
   │  ├─ fecha_captura: metadata.capturedAt
   │  ├─ hora_captura: formatear en America/Bogota
   │  ├─ ubicacion: metadata.location
   │  └─ otros campos de metadata
   └─ Retornar recuerdo completo
   ↓
6. Respuesta exitosa
   ↓
7. onRecuerdoSubido(recuerdo) ← CALLBACK INMEDIATO
   ↓
8. handleRecuerdoSubido() [app/collage/page.tsx]
   ├─ Crear DisplayItem con todos los campos
   ├─ Resetear filtros (all, newest)
   ├─ Optimistic Update
   │  ├─ Verificar si ya existe (prevenir duplicados)
   │  └─ Agregar al inicio del array
   ├─ Mostrar toast de éxito
   ├─ Scroll al inicio
   └─ Programar refetch de seguridad (2s)
   ↓
9. React re-renderiza
   ↓
10. ✅ Imagen visible en < 1 segundo
   ↓
11. [2 segundos después] Refetch de seguridad
   ↓
12. [Si Realtime habilitado] Otros usuarios ven el cambio
```

## 🎨 Component Architecture

### 1. CaptureMemoryButton Component

**Responsabilidades:**
- Mostrar botón flotante para admins
- Manejar selección de archivo (cámara/galería)
- Procesar imagen (conversión + metadata)
- Subir a API
- Notificar al padre via callback

**Mejoras Implementadas:**
```typescript
// Logs de debugging para rastreo completo
console.log('✅ Upload exitoso, respuesta del servidor:', data)
console.log('📤 Llamando a onRecuerdoSubido con:', data.recuerdo)

// Callback inmediato con objeto completo
if (data.recuerdo && onRecuerdoSubido) {
  onRecuerdoSubido(data.recuerdo)
}
```

### 2. CollagePage Component

**Responsabilidades:**
- Cargar items iniciales (DB + locales)
- Manejar nuevo recuerdo (optimistic update)
- Suscribirse a Realtime (opcional)
- Manejar filtros y ordenamiento
- Renderizar grid de imágenes

**Mejoras Implementadas:**
```typescript
const handleRecuerdoSubido = useCallback((recuerdo: CollageRecuerdo) => {
  console.log('📸 Recuerdo subido, agregando al estado:', recuerdo)
  
  const newItem: DisplayItem = {
    ...recuerdo,
    fecha_captura: recuerdo.fecha_captura || recuerdo.fecha_subida,
    isLocal: false,
  }

  // Resetear filtros
  setFilterType('all')
  setFilterYear('all')
  setSortOrder('newest')

  // Optimistic update con prevención de duplicados
  setAllItems(prev => {
    const exists = prev.some(item => item.id === newItem.id)
    if (exists) {
      console.log('⚠️ Item ya existe, no duplicar')
      return prev
    }
    console.log('✅ Agregando nuevo item al estado')
    return [newItem, ...prev]
  })

  setToast({ message: '¡Recuerdo optimizado y publicado!', type: 'success' })
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // Refetch de seguridad
  setTimeout(() => {
    console.log('🔄 Refetch de seguridad')
    loadItems(false)
  }, 2000)
}, [])
```

### 3. Realtime Subscription

**Implementación Optimizada:**
```typescript
useEffect(() => {
  loadItems()

  const channel = supabase
    .channel('collage-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'collage_recuerdos' },
      (payload: any) => {
        console.log('✅ Nuevo recuerdo detectado en tiempo real:', payload)
        if (payload.new) {
          const newItem: DisplayItem = {
            ...payload.new,
            isLocal: false,
          }
          setAllItems(prev => {
            const exists = prev.some(item => item.id === newItem.id)
            if (exists) return prev
            return [newItem, ...prev]
          })
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'collage_recuerdos' },
      (payload: any) => {
        console.log('🗑️ Recuerdo eliminado en tiempo real:', payload)
        if (payload.old?.id) {
          setAllItems(prev => prev.filter(item => item.id !== payload.old.id))
        }
      }
    )
    .subscribe((status) => {
      console.log('📡 Estado de suscripción Realtime:', status)
    })

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

## 🔧 API Endpoint Improvements

### /api/collage/upload

**Mejoras en Extracción de Metadata:**

```typescript
// Extraer fecha y hora de captura real
let now = new Date()
let captureDate = metadata.capturedAt 
  ? new Date(metadata.capturedAt) 
  : now

// Formatear hora en zona horaria de Colombia
const options: Intl.DateTimeFormatOptions = { 
  timeZone: 'America/Bogota', 
  hour12: false, 
  hour: '2-digit', 
  minute: '2-digit', 
  second: '2-digit' 
}
const horaBogota = new Intl.DateTimeFormat('es-CO', options)
  .format(captureDate)

// Insertar con metadata completa
const { data: insertedRow, error: dbError } = await supabase
  .from('collage_recuerdos')
  .insert({
    url: publicUrl,
    tipo,
    usuario_subio: session.username,
    file_path: `${bucketName}/${filePath}`,
    fecha_captura: captureDate.toISOString(),
    hora_captura: horaBogota,
    timezone: 'America/Bogota',
    ubicacion: metadata.location || null,
    tamano_optimizado: file.size,
    formato_final: isImage ? 'image/webp' : file.type,
    descripcion: metadata.isCamera 
      ? 'Capturado con cámara' 
      : 'Subido desde galería'
  })
  .select()
  .single()

// Retornar objeto completo
return NextResponse.json({
  success: true,
  recuerdo: insertedRow,  // ← Objeto completo con todos los campos
})
```

## 📸 Image Processing Pipeline

### processImageForUpload() Improvements

**Flujo Actual (Ya Implementado):**

```typescript
export async function processImageForUpload(
  file: File, 
  isCamera: boolean, 
  location: { lat: number, lng: number } | null
) {
  // 1. Inicializar metadata
  const metadata: UploadMetadata = {
    isCamera,
    capturedAt: null,
    location: location,
    originalFormat: file.type,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  // 2. Convertir HEIC si es necesario
  if (isHEIC) {
    workingFile = await heic2any({
      blob: file,
      toType: 'image/webp',
      quality: 0.85
    })
  }

  // 3. Extraer EXIF (solo para galería)
  if (!isCamera && workingFile.type.startsWith('image/')) {
    const exif = await exifr.parse(workingFile, {
      gps: true,
      pick: ['DateTimeOriginal', 'latitude', 'longitude']
    })

    if (exif) {
      if (exif.DateTimeOriginal) {
        metadata.capturedAt = exif.DateTimeOriginal.toISOString()
      }
      if (exif.latitude && exif.longitude) {
        metadata.location = { 
          lat: exif.latitude, 
          lng: exif.longitude 
        }
      }
    }
  }

  // 4. Comprimir y convertir a WebP
  workingFile = await compressImageToWebP(workingFile)

  return { finalFile: workingFile, metadata }
}
```

**Mejora Propuesta: Extraer EXIF también de cámara**

```typescript
// CAMBIO: Extraer EXIF siempre, no solo para galería
if (workingFile.type.startsWith('image/')) {
  try {
    const exif = await exifr.parse(workingFile, {
      gps: true,
      pick: ['DateTimeOriginal', 'latitude', 'longitude']
    })

    if (exif) {
      // Priorizar fecha EXIF sobre fecha actual
      if (exif.DateTimeOriginal) {
        metadata.capturedAt = exif.DateTimeOriginal.toISOString()
      }
      
      // Priorizar ubicación EXIF sobre ubicación del navegador
      if (exif.latitude && exif.longitude && !metadata.location) {
        metadata.location = { 
          lat: exif.latitude, 
          lng: exif.longitude 
        }
      }
    }
  } catch (e) {
    console.warn('Metadata extraction skipped', e)
    // No fallar, continuar sin metadata
  }
}
```

## 📅 Date Display Logic

### Reglas de Visualización

```typescript
// Función helper para obtener fecha de visualización
function getDisplayDate(item: DisplayItem): Date {
  // Prioridad 1: fecha_captura (de EXIF)
  if (item.fecha_captura) {
    const date = new Date(item.fecha_captura)
    if (!isNaN(date.getTime())) {
      return date
    }
  }
  
  // Prioridad 2: fecha_subida (del servidor)
  if (item.fecha_subida) {
    const date = new Date(item.fecha_subida)
    if (!isNaN(date.getTime())) {
      return date
    }
  }
  
  // Fallback: fecha actual (no debería llegar aquí)
  return new Date()
}

// Formateo para visualización
function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Bogota'
  })
}

// Formateo completo con hora
function formatFullDate(date: Date, hora?: string): string {
  const dateStr = date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Bogota'
  })
  
  return hora ? `${dateStr} · ${hora}` : dateStr
}
```

### Implementación en UI

```typescript
// En el grid de imágenes
<p className="text-white/90 text-xs">
  {formatDisplayDate(getDisplayDate(item))}
  {item.hora_captura && ` · ${item.hora_captura}`}
</p>

// En el lightbox
<span className="font-medium text-white">
  {formatFullDate(getDisplayDate(item), item.hora_captura)}
</span>
```

## 🔄 Data Migration Script

### Script para Corregir Datos Históricos

```typescript
// scripts/fix-collage-dates.ts

import { createClient } from '@supabase/supabase-js'
import exifr from 'exifr'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ← Service role para bypass RLS
)

async function fixCollageDates() {
  console.log('🔄 Iniciando corrección de fechas...')
  
  // 1. Obtener todos los registros
  const { data: records, error } = await supabase
    .from('collage_recuerdos')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('❌ Error al obtener registros:', error)
    return
  }
  
  console.log(`📊 Encontrados ${records.length} registros`)
  
  let updated = 0
  let skipped = 0
  let errors = 0
  
  // 2. Procesar cada registro
  for (const record of records) {
    try {
      // Si ya tiene fecha_captura válida, skip
      if (record.fecha_captura && 
          new Date(record.fecha_captura).getFullYear() > 2020) {
        skipped++
        continue
      }
      
      // Intentar extraer metadata de la imagen
      let metadata: any = null
      
      try {
        const response = await fetch(record.url)
        const blob = await response.blob()
        metadata = await exifr.parse(blob, {
          gps: true,
          pick: ['DateTimeOriginal', 'latitude', 'longitude']
        })
      } catch (e) {
        console.warn(`⚠️ No se pudo extraer EXIF de ${record.id}`)
      }
      
      // Preparar actualización
      const updates: any = {}
      
      if (metadata?.DateTimeOriginal) {
        updates.fecha_captura = metadata.DateTimeOriginal.toISOString()
        
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'America/Bogota',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }
        updates.hora_captura = new Intl.DateTimeFormat('es-CO', options)
          .format(metadata.DateTimeOriginal)
      } else {
        // Usar fecha_subida como fallback
        updates.fecha_captura = record.fecha_subida
      }
      
      if (metadata?.latitude && metadata?.longitude) {
        updates.ubicacion = {
          lat: metadata.latitude,
          lng: metadata.longitude
        }
      }
      
      // Actualizar registro
      const { error: updateError } = await supabase
        .from('collage_recuerdos')
        .update(updates)
        .eq('id', record.id)
      
      if (updateError) {
        console.error(`❌ Error al actualizar ${record.id}:`, updateError)
        errors++
      } else {
        console.log(`✅ Actualizado ${record.id}`)
        updated++
      }
      
    } catch (e) {
      console.error(`❌ Error procesando ${record.id}:`, e)
      errors++
    }
  }
  
  // 3. Reporte final
  console.log('\n📊 REPORTE FINAL:')
  console.log(`✅ Actualizados: ${updated}`)
  console.log(`⏭️  Omitidos: ${skipped}`)
  console.log(`❌ Errores: ${errors}`)
  console.log(`📝 Total: ${records.length}`)
}

fixCollageDates()
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
// lib/__tests__/upload-utils.test.ts

describe('processImageForUpload', () => {
  it('should extract EXIF metadata from JPEG', async () => {
    const file = new File([mockJPEG], 'test.jpg', { type: 'image/jpeg' })
    const result = await processImageForUpload(file, false, null)
    
    expect(result.metadata.capturedAt).toBeDefined()
    expect(result.metadata.location).toBeDefined()
  })
  
  it('should convert HEIC to WebP', async () => {
    const file = new File([mockHEIC], 'test.heic', { type: 'image/heic' })
    const result = await processImageForUpload(file, false, null)
    
    expect(result.finalFile.type).toBe('image/webp')
  })
  
  it('should handle missing EXIF gracefully', async () => {
    const file = new File([mockPNG], 'test.png', { type: 'image/png' })
    const result = await processImageForUpload(file, false, null)
    
    expect(result.metadata.capturedAt).toBeNull()
    expect(result.finalFile).toBeDefined()
  })
})
```

### Integration Tests

```typescript
// app/collage/__tests__/sync.test.tsx

describe('Collage Sync', () => {
  it('should render new item immediately after upload', async () => {
    render(<CollagePage />)
    
    const uploadButton = screen.getByLabelText('Subir recuerdo')
    fireEvent.click(uploadButton)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText('Subir desde galería')
    fireEvent.change(input, { target: { files: [file] } })
    
    // Esperar a que aparezca
    await waitFor(() => {
      expect(screen.getByAltText(/Recuerdo/)).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})
```

## 📊 Performance Optimizations

### 1. Lazy Loading de Imágenes

```typescript
<Image
  src={item.url}
  alt={`Recuerdo ${index + 1}`}
  fill
  loading="lazy"  // ← Lazy loading nativo
  quality={85}
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
/>
```

### 2. Índices de Base de Datos

```sql
-- Índice para ordenamiento por fecha
CREATE INDEX idx_collage_fecha_captura 
ON collage_recuerdos (fecha_captura DESC NULLS LAST);

-- Índice para filtrado por tipo
CREATE INDEX idx_collage_tipo 
ON collage_recuerdos (tipo);

-- Índice compuesto para filtros combinados
CREATE INDEX idx_collage_tipo_fecha 
ON collage_recuerdos (tipo, fecha_captura DESC);
```

### 3. Memoización de Componentes

```typescript
const MemoizedImageCard = React.memo(({ item }: { item: DisplayItem }) => {
  return (
    <motion.div key={item.id}>
      {/* ... */}
    </motion.div>
  )
}, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id
})
```

## 🔒 Security Considerations

### 1. Validación de Archivos

```typescript
// Validar tipo MIME
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
if (!allowedTypes.includes(file.type)) {
  throw new Error('Tipo de archivo no permitido')
}

// Validar tamaño
const MAX_SIZE = 10 * 1024 * 1024  // 10MB
if (file.size > MAX_SIZE) {
  throw new Error('Archivo muy grande')
}
```

### 2. Sanitización de Metadata

```typescript
// Sanitizar ubicación
function sanitizeLocation(location: any): { lat: number, lng: number } | null {
  if (!location || typeof location !== 'object') return null
  
  const lat = parseFloat(location.lat)
  const lng = parseFloat(location.lng)
  
  if (isNaN(lat) || isNaN(lng)) return null
  if (lat < -90 || lat > 90) return null
  if (lng < -180 || lng > 180) return null
  
  return { lat, lng }
}
```

### 3. Rate Limiting

```typescript
// Limitar subidas por usuario
const RATE_LIMIT = 10  // 10 subidas por hora
const rateLimitKey = `upload:${session.username}:${Date.now()}`

// Implementar con Redis o similar
```

## 📝 Correctness Properties

### Property 1: Sincronización Inmediata
**Validates: Requirements 1.1, 1.2, 1.3**

```typescript
// Propiedad: Después de subir, el item debe estar en el estado en < 1s
property('item appears immediately after upload', async () => {
  const initialCount = getItemCount()
  await uploadImage(mockFile)
  await wait(1000)
  const finalCount = getItemCount()
  
  return finalCount === initialCount + 1
})
```

### Property 2: Metadata Correcta
**Validates: Requirements 2.1, 2.2, 2.3**

```typescript
// Propiedad: La metadata extraída debe ser válida
property('extracted metadata is valid', async () => {
  const file = generateImageWithEXIF()
  const result = await processImageForUpload(file, false, null)
  
  return (
    result.metadata.capturedAt !== null &&
    isValidDate(result.metadata.capturedAt) &&
    isValidLocation(result.metadata.location)
  )
})
```

### Property 3: Conversión Exitosa
**Validates: Requirements 3.1, 3.2, 3.3**

```typescript
// Propiedad: Todas las imágenes deben convertirse a WebP
property('all images convert to webp', async () => {
  const formats = ['image/jpeg', 'image/png', 'image/heic']
  
  for (const format of formats) {
    const file = generateImageOfType(format)
    const result = await processImageForUpload(file, false, null)
    
    if (result.finalFile.type !== 'image/webp') {
      return false
    }
  }
  
  return true
})
```

### Property 4: No Duplicados
**Validates: Requirements 1.6**

```typescript
// Propiedad: No debe haber duplicados en el estado
property('no duplicates in state', async () => {
  const items = getAllItems()
  const ids = items.map(item => item.id)
  const uniqueIds = new Set(ids)
  
  return ids.length === uniqueIds.size
})
```

### Property 5: Fechas Válidas
**Validates: Requirements 4.1, 4.2, 4.3**

```typescript
// Propiedad: Todas las fechas mostradas deben ser válidas
property('all displayed dates are valid', () => {
  const items = getAllItems()
  
  for (const item of items) {
    const displayDate = getDisplayDate(item)
    
    if (isNaN(displayDate.getTime())) {
      return false
    }
    
    if (displayDate.getFullYear() < 2020) {
      return false
    }
  }
  
  return true
})
```

## 🚀 Deployment Strategy

### Phase 1: Database Migration
1. Ejecutar migración SQL en Supabase
2. Verificar que los índices se crearon
3. Habilitar Realtime (opcional)

### Phase 2: Code Deployment
1. Deploy de cambios en frontend
2. Deploy de cambios en API
3. Verificar que no hay errores

### Phase 3: Data Migration
1. Ejecutar script de corrección de fechas
2. Verificar resultados
3. Generar reporte

### Phase 4: Validation
1. Probar subida desde cámara
2. Probar subida desde galería
3. Verificar sincronización
4. Verificar fechas correctas

## 📚 Documentation

### User Documentation
- Guía de uso del collage
- Cómo subir recuerdos
- Cómo usar filtros

### Developer Documentation
- Arquitectura del sistema
- Flujo de datos
- API endpoints
- Troubleshooting

---

**Created:** 2025-02-23  
**Status:** Draft  
**Version:** 1.0
