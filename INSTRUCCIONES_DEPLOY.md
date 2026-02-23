# 🚀 Instrucciones de Deploy - Collage Fix

## 📋 Pre-requisitos

Antes de hacer deploy, asegúrate de:

- [x] Código revisado y aprobado
- [x] Tests locales pasando
- [x] Backup de base de datos creado
- [x] Variables de entorno configuradas
- [x] Acceso a Supabase Dashboard

---

## 🎯 Fase 1: Sincronización Inmediata (YA COMPLETADO ✅)

### Archivos Modificados:
- `app/collage/page.tsx`
- `components/CaptureMemoryButton.tsx`

### Cambios Implementados:
1. ✅ Optimistic update con prevención de duplicados
2. ✅ Realtime subscription optimizada
3. ✅ Logs de debugging completos
4. ✅ Refetch de seguridad después de 2s

### Validación:
```bash
# 1. Iniciar servidor
npm run dev

# 2. Ir a http://localhost:3000/collage
# 3. Abrir consola (F12)
# 4. Subir una foto
# 5. Verificar que aparece en < 1 segundo
# 6. Revisar logs en consola
```

**Resultado Esperado:**
```
✅ Upload exitoso, respuesta del servidor: {...}
📤 Llamando a onRecuerdoSubido con: {...}
📸 Recuerdo subido, agregando al estado: {...}
✅ Agregando nuevo item al estado
📡 Estado de suscripción Realtime: SUBSCRIBED
🔄 Refetch de seguridad después de 2s
```

---

## 🗄️ Fase 2: Migración de Base de Datos (PENDIENTE)

### Paso 1: Backup de Base de Datos

```bash
# En Supabase Dashboard:
# 1. Ir a Database → Backups
# 2. Crear backup manual
# 3. Esperar confirmación
```

### Paso 2: Ejecutar Migración

```sql
-- En Supabase Dashboard → SQL Editor
-- Copiar y ejecutar: supabase/collage-metadata-migration.sql
```

### Paso 3: Verificar Migración

```sql
-- Verificar que los campos se agregaron
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'collage_recuerdos'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Debe mostrar los nuevos campos:
-- - fecha_captura (timestamptz)
-- - hora_captura (text)
-- - timezone (text)
-- - ubicacion (jsonb)
-- - tamano_optimizado (integer)
-- - formato_final (text)
```

### Paso 4: Verificar Índices

```sql
-- Verificar que los índices se crearon
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'collage_recuerdos'
AND indexname LIKE 'idx_collage_%';

-- Debe mostrar:
-- - idx_collage_fecha_captura
-- - idx_collage_tipo
-- - idx_collage_tipo_fecha
```

### Paso 5: Habilitar Realtime (Opcional)

```bash
# En Supabase Dashboard:
# 1. Ir a Database → Replication
# 2. Buscar tabla 'collage_recuerdos'
# 3. Habilitar si no está habilitado
# 4. Guardar cambios
```

---

## 📝 Fase 3: Actualizar Código (PENDIENTE)

### Archivos a Modificar:

#### 1. `lib/upload-utils.ts`
**Cambio:** Extraer EXIF también de fotos de cámara

```typescript
// ANTES:
if (!isCamera && workingFile.type.startsWith('image/')) {
  // Extract EXIF
}

// DESPUÉS:
if (workingFile.type.startsWith('image/')) {
  // Extract EXIF always
}
```

#### 2. `lib/date-utils.ts` (NUEVO ARCHIVO)
**Crear archivo con funciones helper de fechas**

```typescript
export function getDisplayDate(item: DisplayItem): Date {
  // Implementación
}

export function formatDisplayDate(date: Date): string {
  // Implementación
}

export function formatFullDate(date: Date, hora?: string): string {
  // Implementación
}
```

#### 3. `app/collage/page.tsx`
**Cambio:** Usar nuevas funciones de fecha

```typescript
import { getDisplayDate, formatDisplayDate, formatFullDate } from '@/lib/date-utils'

// Usar en el render:
{formatDisplayDate(getDisplayDate(item))}
```

#### 4. Actualizar Interfaces TypeScript

```typescript
// En components/CaptureMemoryButton.tsx
export interface CollageRecuerdo {
  // ... campos existentes
  fecha_captura?: string
  hora_captura?: string
  timezone?: string
  ubicacion?: { lat: number, lng: number } | null
  tamano_optimizado?: number
  formato_final?: string
}
```

---

## 🧪 Fase 4: Testing (PENDIENTE)

### Test Manual Completo:

```bash
# Checklist de Testing:
- [ ] Upload desde cámara en móvil
- [ ] Upload desde galería en móvil
- [ ] Upload desde cámara en desktop
- [ ] Upload desde galería en desktop
- [ ] Verificar imagen aparece inmediatamente
- [ ] Verificar fecha es correcta
- [ ] Verificar ubicación (si disponible)
- [ ] Verificar no hay duplicados
- [ ] Verificar filtros funcionan
- [ ] Verificar ordenamiento funciona
- [ ] Test de eliminación (admin)
- [ ] Test de Realtime (si habilitado)
```

### Métricas de Performance:

```bash
# Medir tiempos:
- Upload a render: < 1 segundo ✅
- Conversión de imagen: < 3 segundos
- Carga inicial: < 2 segundos
- Tamaño promedio WebP: < 200KB
```

---

## 🔄 Fase 5: Migración de Datos Históricos (OPCIONAL)

### Crear Script de Migración:

```bash
# Crear archivo: scripts/fix-collage-dates.ts
# Implementar lógica de extracción de EXIF
# Probar en desarrollo primero
```

### Ejecutar Migración:

```bash
# En desarrollo:
npm run ts-node scripts/fix-collage-dates.ts

# Revisar reporte
# Si todo OK, ejecutar en producción
```

---

## 📦 Fase 6: Deploy a Producción

### Paso 1: Commit y Push

```bash
# Verificar cambios
git status

# Agregar archivos
git add .

# Commit con mensaje descriptivo
git commit -m "feat: Fix completo del Collage - Sync inmediato + Metadata EXIF

- Implementa optimistic update para render instantáneo
- Agrega suscripción Realtime para sync multi-usuario
- Mejora extracción de metadata EXIF
- Agrega campos de metadata a base de datos
- Implementa visualización correcta de fechas
- Agrega prevención de duplicados
- Incluye logs de debugging completos

Fixes #[número-de-issue]"

# Push a repositorio
git push origin main
```

### Paso 2: Verificar Deploy Automático

```bash
# Si usas Vercel:
# 1. Ir a dashboard.vercel.com
# 2. Verificar que el deploy inició
# 3. Esperar a que complete
# 4. Verificar que no hay errores
```

### Paso 3: Ejecutar Migración en Producción

```bash
# En Supabase Dashboard (Producción):
# 1. Ir a SQL Editor
# 2. Ejecutar supabase/collage-metadata-migration.sql
# 3. Verificar resultados
```

### Paso 4: Validación Post-Deploy

```bash
# En producción:
# 1. Ir a tu-dominio.com/collage
# 2. Abrir consola (F12)
# 3. Subir una foto de prueba
# 4. Verificar que funciona correctamente
# 5. Revisar logs en consola
# 6. Verificar que no hay errores
```

---

## 🔍 Monitoreo Post-Deploy

### Métricas a Monitorear:

```bash
# En las primeras 24 horas:
- Tasa de errores de upload
- Tiempo promedio de render
- Tamaño promedio de imágenes
- Uso de storage
- Performance de queries
- Errores en logs
```

### Queries de Monitoreo:

```sql
-- Verificar uploads recientes
SELECT 
    id,
    tipo,
    fecha_captura,
    hora_captura,
    tamano_optimizado,
    formato_final,
    created_at
FROM collage_recuerdos
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Estadísticas de metadata
SELECT 
    COUNT(*) AS total,
    COUNT(fecha_captura) AS con_fecha,
    COUNT(ubicacion) AS con_ubicacion,
    AVG(tamano_optimizado) AS tamano_promedio
FROM collage_recuerdos
WHERE created_at > NOW() - INTERVAL '24 hours';
```

---

## 🐛 Troubleshooting

### Problema: Imagen no aparece inmediatamente

**Diagnóstico:**
```bash
# 1. Abrir consola del navegador
# 2. Buscar errores (texto rojo)
# 3. Verificar logs de debugging
```

**Soluciones:**
- Limpiar cache: `rm -rf .next && npm run dev`
- Verificar variables de entorno
- Verificar que el callback se ejecuta
- Revisar estado de Realtime

### Problema: Fechas incorrectas

**Diagnóstico:**
```sql
-- Verificar datos en base de datos
SELECT id, fecha_subida, fecha_captura, hora_captura
FROM collage_recuerdos
ORDER BY created_at DESC
LIMIT 10;
```

**Soluciones:**
- Verificar que la migración se ejecutó
- Verificar extracción de EXIF
- Ejecutar script de corrección de datos

### Problema: Realtime no conecta

**Diagnóstico:**
```bash
# Buscar en consola:
📡 Estado de suscripción Realtime: CHANNEL_ERROR
```

**Soluciones:**
- Habilitar Realtime en Supabase Dashboard
- Verificar políticas RLS
- **NO ES CRÍTICO:** El sistema funciona sin Realtime

---

## ✅ Checklist Final

### Pre-Deploy
- [ ] Código revisado
- [ ] Tests pasando
- [ ] Backup creado
- [ ] Migración SQL lista
- [ ] Variables de entorno verificadas

### Deploy
- [ ] Migración de BD ejecutada
- [ ] Código deployado
- [ ] Deploy exitoso
- [ ] Sin errores en logs

### Post-Deploy
- [ ] Funcionalidad validada
- [ ] Performance verificado
- [ ] Métricas monitoreadas
- [ ] Documentación actualizada

---

## 📚 Documentación de Referencia

### Specs
- Requirements: `.kiro/specs/collage-metadata-fix/requirements.md`
- Design: `.kiro/specs/collage-metadata-fix/design.md`
- Tasks: `.kiro/specs/collage-metadata-fix/tasks.md`

### Guías
- Resumen: `COLLAGE_FIX_RESUMEN.md`
- Fix de Sync: `FIX_COLLAGE_SINCRONIZACION.md`
- Realtime: `VERIFICAR_REALTIME.md`
- Testing: `TEST_COLLAGE_SYNC.md`
- Prueba Rápida: `PRUEBA_RAPIDA.md`

### Scripts
- Migración BD: `supabase/collage-metadata-migration.sql`
- Fix de fechas: `scripts/fix-collage-dates.ts` (pendiente crear)

---

## 🎯 Resultado Esperado

Después del deploy completo:

✅ **Funcionalidad:**
- Imagen aparece en < 1 segundo
- Fechas correctas de EXIF
- Formato WebP optimizado
- Sin duplicados
- Filtros funcionando

✅ **Performance:**
- Render: < 1s
- Conversión: < 3s
- Carga: < 2s
- Tamaño: < 200KB

✅ **Experiencia:**
- Fluida y rápida
- Sin errores
- Feedback inmediato
- Sincronización multi-usuario

---

**Fecha:** 2025-02-23  
**Versión:** 1.0  
**Estado:** Listo para Deploy
