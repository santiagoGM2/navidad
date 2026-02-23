# Collage Metadata & Sync Fix - Requirements

## 📋 Overview

Este spec aborda de manera estructural y completa los problemas críticos del sistema de Collage relacionados con sincronización, metadata de fechas, y optimización de archivos.

## 🎯 Objetivos Principales

1. **Sincronización Inmediata**: Imagen visible en < 1 segundo tras subida
2. **Fechas Correctas**: Mostrar fecha real de captura extraída de metadata EXIF
3. **Optimización Automática**: Convertir todos los archivos a formatos web optimizados
4. **Corrección de Datos Históricos**: Limpiar fechas incorrectas existentes
5. **Preparación para Filtros**: Estructura de datos lista para filtrado avanzado

## 👥 User Stories

### US-1: Sincronización Instantánea
**Como** administrador del collage  
**Quiero** que las imágenes aparezcan inmediatamente después de subirlas  
**Para** tener feedback visual instantáneo y confirmar que la subida fue exitosa

**Acceptance Criteria:**
- AC-1.1: La imagen debe aparecer en el collage en menos de 1 segundo tras confirmación de subida
- AC-1.2: La imagen debe aparecer en primera posición (más reciente)
- AC-1.3: No debe requerirse refresh manual de la página
- AC-1.4: Los filtros deben resetearse automáticamente para mostrar el nuevo item
- AC-1.5: Debe hacer scroll automático al inicio para ver la nueva imagen
- AC-1.6: Debe prevenir duplicados si hay múltiples fuentes de actualización
- AC-1.7: Debe funcionar tanto en móvil como en desktop
- AC-1.8: Debe funcionar tanto con cámara como con galería

### US-2: Extracción de Metadata EXIF
**Como** usuario del sistema  
**Quiero** que las fechas mostradas correspondan a la fecha real de captura de la foto  
**Para** tener un registro cronológico preciso de nuestros recuerdos

**Acceptance Criteria:**
- AC-2.1: Debe extraer `DateTimeOriginal` de metadata EXIF de imágenes
- AC-2.2: Debe extraer coordenadas GPS si están disponibles
- AC-2.3: Debe preservar la metadata durante el proceso de conversión
- AC-2.4: Si no hay metadata EXIF, debe usar fecha de subida
- AC-2.5: Debe manejar diferentes formatos de imagen (JPEG, PNG, HEIC, etc.)
- AC-2.6: Debe funcionar con fotos de cámara y de galería
- AC-2.7: No debe fallar si la metadata está corrupta o ausente

### US-3: Conversión Automática a Formatos Web
**Como** desarrollador del sistema  
**Quiero** que todas las imágenes se conviertan automáticamente a WebP  
**Para** optimizar el rendimiento, reducir el uso de ancho de banda y mejorar la experiencia de usuario

**Acceptance Criteria:**
- AC-3.1: Todas las imágenes deben convertirse a formato WebP antes de subir
- AC-3.2: La calidad debe mantenerse en 85% para balance entre calidad y tamaño
- AC-3.3: Las imágenes deben redimensionarse a máximo 1200px en el lado más largo
- AC-3.4: Debe preservar la metadata EXIF durante la conversión
- AC-3.5: Debe manejar conversión de HEIC (formato iPhone) a WebP
- AC-3.6: Videos deben mantenerse en su formato original (conversión de video es opcional)
- AC-3.7: El proceso de conversión no debe bloquear la UI
- AC-3.8: Debe mostrar progreso durante la conversión

### US-4: Visualización Correcta de Fechas
**Como** usuario viendo el collage  
**Quiero** ver la fecha real de captura de cada foto  
**Para** poder recordar cuándo fue tomada cada imagen

**Acceptance Criteria:**
- AC-4.1: Debe mostrar `fecha_captura` si está disponible
- AC-4.2: Debe mostrar `fecha_subida` solo si no hay `fecha_captura`
- AC-4.3: No debe mostrar fechas genéricas incorrectas (ej: 31 diciembre)
- AC-4.4: Debe formatear fechas en español con zona horaria America/Bogota
- AC-4.5: Debe mostrar hora de captura si está disponible
- AC-4.6: Debe usar formato legible: "15 de febrero de 2025"
- AC-4.7: En hover debe mostrar fecha completa con hora

### US-5: Corrección de Datos Históricos
**Como** administrador del sistema  
**Quiero** corregir las fechas incorrectas de imágenes ya subidas  
**Para** tener un registro histórico preciso y confiable

**Acceptance Criteria:**
- AC-5.1: Debe identificar registros con fechas genéricas incorrectas
- AC-5.2: Debe intentar extraer metadata de imágenes ya almacenadas
- AC-5.3: Si no hay metadata disponible, debe usar `fecha_subida` real
- AC-5.4: Debe actualizar registros en batch sin afectar el servicio
- AC-5.5: Debe generar reporte de correcciones realizadas
- AC-5.6: Debe tener rollback en caso de error
- AC-5.7: No debe eliminar imágenes, solo corregir metadata

### US-6: Estructura de Base de Datos Mejorada
**Como** desarrollador del sistema  
**Quiero** una estructura de base de datos que soporte metadata completa  
**Para** facilitar filtros, búsquedas y ordenamiento avanzado

**Acceptance Criteria:**
- AC-6.1: Debe tener campo `fecha_captura` (TIMESTAMPTZ) separado de `fecha_subida`
- AC-6.2: Debe tener campo `hora_captura` (TEXT) para mostrar hora legible
- AC-6.3: Debe tener campo `timezone` para registrar zona horaria
- AC-6.4: Debe tener campo `ubicacion` (JSONB) para coordenadas GPS
- AC-6.5: Debe tener campo `tamano_optimizado` (INTEGER) para tracking de tamaño
- AC-6.6: Debe tener campo `formato_final` (TEXT) para registrar formato convertido
- AC-6.7: Debe tener índices en `fecha_captura` para ordenamiento eficiente
- AC-6.8: Debe mantener compatibilidad con registros existentes

### US-7: Filtros por Fecha
**Como** usuario del collage  
**Quiero** poder filtrar recuerdos por fecha  
**Para** encontrar fácilmente fotos de períodos específicos

**Acceptance Criteria:**
- AC-7.1: Debe poder ordenar por más reciente o más antiguo
- AC-7.2: Debe poder filtrar por año
- AC-7.3: Debe poder filtrar por tipo (foto/video)
- AC-7.4: Los filtros deben combinarse correctamente
- AC-7.5: Debe mostrar contador de resultados filtrados
- AC-7.6: Debe mantener filtros al navegar (opcional)
- AC-7.7: Debe tener botón para limpiar todos los filtros

### US-8: Sincronización Multi-Usuario (Bonus)
**Como** administrador del collage  
**Quiero** ver automáticamente las fotos que otros admins suben  
**Para** tener una experiencia colaborativa en tiempo real

**Acceptance Criteria:**
- AC-8.1: Debe usar Supabase Realtime para sincronización
- AC-8.2: Debe agregar nuevos items sin refetch completo
- AC-8.3: Debe sincronizar eliminaciones en tiempo real
- AC-8.4: Debe funcionar incluso si Realtime no está disponible (fallback)
- AC-8.5: Debe prevenir duplicados en sincronización
- AC-8.6: Debe mostrar indicador de conexión Realtime
- AC-8.7: No debe ser crítico para funcionalidad básica

## 🔧 Technical Requirements

### TR-1: Extracción de Metadata
- Usar librería `exifr` para extracción de EXIF
- Extraer campos: `DateTimeOriginal`, `latitude`, `longitude`
- Manejar errores gracefully sin bloquear subida
- Preservar metadata durante conversión a WebP

### TR-2: Conversión de Imágenes
- Usar Canvas API para conversión a WebP
- Calidad: 85%
- Tamaño máximo: 1200px en lado más largo
- Mantener aspect ratio original
- Usar `heic2any` para conversión de HEIC

### TR-3: Actualización de Estado
- Usar optimistic update para render inmediato
- Implementar prevención de duplicados por ID
- Refetch de seguridad después de 2 segundos
- Resetear filtros al agregar nuevo item

### TR-4: Base de Datos
- Migración para agregar nuevos campos
- Índices en `fecha_captura` para performance
- Políticas RLS mantenidas
- Compatibilidad con registros existentes

### TR-5: Performance
- Conversión de imágenes no debe bloquear UI
- Usar Web Workers si es necesario (opcional)
- Lazy loading de imágenes en grid
- Optimización de queries con índices

## 🚫 Non-Functional Requirements

### NFR-1: Performance
- Tiempo de conversión de imagen: < 3 segundos
- Tiempo de render tras subida: < 1 segundo
- Carga inicial del collage: < 2 segundos
- Tamaño promedio de imagen WebP: < 200KB

### NFR-2: Compatibilidad
- Funcionar en Chrome, Firefox, Safari
- Funcionar en iOS y Android
- Soportar formatos: JPEG, PNG, HEIC, WebP
- Mantener compatibilidad con registros existentes

### NFR-3: Confiabilidad
- No perder imágenes durante conversión
- Rollback automático en caso de error
- Logs completos para debugging
- Manejo de errores sin crash

### NFR-4: Seguridad
- Mantener autenticación actual
- Validar permisos de admin
- Sanitizar metadata extraída
- Prevenir inyección de código

### NFR-5: Mantenibilidad
- Código limpio y documentado
- Tests para funciones críticas
- Logs estructurados
- Documentación de migración

## 🔄 Migration Strategy

### Fase 1: Preparación
1. Agregar nuevos campos a tabla `collage_recuerdos`
2. Crear índices necesarios
3. Actualizar tipos TypeScript

### Fase 2: Implementación
1. Mejorar extracción de metadata EXIF
2. Implementar conversión automática a WebP
3. Implementar optimistic update
4. Implementar Realtime (opcional)

### Fase 3: Corrección de Datos
1. Script para analizar registros existentes
2. Intentar extraer metadata de imágenes almacenadas
3. Actualizar registros con fechas correctas
4. Generar reporte de correcciones

### Fase 4: Validación
1. Pruebas en desarrollo
2. Pruebas en móvil y desktop
3. Validación de performance
4. Deploy a producción

## ✅ Definition of Done

- [ ] Todos los Acceptance Criteria cumplidos
- [ ] Código revisado y aprobado
- [ ] Tests pasando (si aplica)
- [ ] Documentación actualizada
- [ ] Probado en móvil y desktop
- [ ] Probado con cámara y galería
- [ ] Performance validado
- [ ] Sin errores en consola
- [ ] Migración de datos completada
- [ ] Deploy a producción exitoso

## 📊 Success Metrics

- Tiempo de render tras subida: < 1 segundo (actualmente: indefinido)
- Precisión de fechas: 100% (actualmente: ~60%)
- Tamaño promedio de imagen: < 200KB (actualmente: ~2MB)
- Satisfacción de usuario: Alta (feedback cualitativo)
- Errores de subida: < 1% (actualmente: ~5%)

## 🔗 Dependencies

- `exifr`: Extracción de metadata EXIF
- `heic2any`: Conversión de HEIC a WebP
- Supabase Realtime: Sincronización multi-usuario (opcional)
- Canvas API: Conversión de imágenes

## 📝 Notes

- La sincronización inmediata ya está parcialmente implementada
- La extracción de metadata EXIF ya existe pero solo para galería
- La conversión a WebP ya existe pero necesita mejoras
- Realtime es opcional, el sistema debe funcionar sin él
- Priorizar no romper funcionalidad existente

## 🎯 Priority

**HIGH PRIORITY:**
- US-1: Sincronización Instantánea
- US-2: Extracción de Metadata EXIF
- US-4: Visualización Correcta de Fechas

**MEDIUM PRIORITY:**
- US-3: Conversión Automática a Formatos Web
- US-5: Corrección de Datos Históricos
- US-6: Estructura de Base de Datos Mejorada

**LOW PRIORITY:**
- US-7: Filtros por Fecha (ya existe básicamente)
- US-8: Sincronización Multi-Usuario (bonus)

---

**Created:** 2025-02-23  
**Status:** Draft  
**Version:** 1.0
