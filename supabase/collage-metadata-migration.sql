-- =============================================
-- MIGRACIÓN: Agregar Campos de Metadata al Collage
-- Fecha: 2025-02-23
-- Descripción: Agrega campos para metadata EXIF, fechas correctas y optimización
-- =============================================

-- 1. AGREGAR NUEVOS CAMPOS
-- Estos campos almacenarán metadata extraída de EXIF y datos de optimización

ALTER TABLE public.collage_recuerdos
ADD COLUMN IF NOT EXISTS fecha_captura TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS hora_captura TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Bogota',
ADD COLUMN IF NOT EXISTS ubicacion JSONB,
ADD COLUMN IF NOT EXISTS tamano_optimizado INTEGER,
ADD COLUMN IF NOT EXISTS formato_final TEXT;

-- 2. MIGRAR DATOS EXISTENTES
-- Para registros que no tienen fecha_captura, usar fecha_subida como fallback

UPDATE public.collage_recuerdos
SET fecha_captura = fecha_subida
WHERE fecha_captura IS NULL;

-- 3. CREAR ÍNDICES PARA PERFORMANCE
-- Índice principal para ordenamiento por fecha de captura

CREATE INDEX IF NOT EXISTS idx_collage_fecha_captura 
ON public.collage_recuerdos (fecha_captura DESC NULLS LAST);

-- Índice para filtrado por tipo
CREATE INDEX IF NOT EXISTS idx_collage_tipo 
ON public.collage_recuerdos (tipo);

-- Índice compuesto para filtros combinados (tipo + fecha)
CREATE INDEX IF NOT EXISTS idx_collage_tipo_fecha 
ON public.collage_recuerdos (tipo, fecha_captura DESC);

-- 4. HABILITAR REALTIME (OPCIONAL)
-- Esto permite sincronización en tiempo real entre usuarios
-- Si ya está habilitado, este comando no hace nada

DO $$
BEGIN
    -- Verificar si la tabla ya está en la publicación
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'collage_recuerdos'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE collage_recuerdos;
    END IF;
END $$;

-- 5. AGREGAR COMENTARIOS A LAS COLUMNAS
-- Para documentación y claridad

COMMENT ON COLUMN public.collage_recuerdos.fecha_captura IS 
'Fecha real de captura extraída de metadata EXIF. Si no hay EXIF, usa fecha_subida.';

COMMENT ON COLUMN public.collage_recuerdos.hora_captura IS 
'Hora de captura en formato legible (HH:MM:SS) en timezone America/Bogota';

COMMENT ON COLUMN public.collage_recuerdos.timezone IS 
'Zona horaria donde se capturó la foto. Por defecto America/Bogota';

COMMENT ON COLUMN public.collage_recuerdos.ubicacion IS 
'Coordenadas GPS extraídas de EXIF en formato {lat: number, lng: number}';

COMMENT ON COLUMN public.collage_recuerdos.tamano_optimizado IS 
'Tamaño del archivo optimizado en bytes después de conversión a WebP';

COMMENT ON COLUMN public.collage_recuerdos.formato_final IS 
'Formato final del archivo (image/webp, video/mp4, etc.)';

-- 6. VERIFICACIÓN
-- Query para verificar que la migración fue exitosa

SELECT 
    'Migración completada exitosamente' AS status,
    (
        SELECT COUNT(*) 
        FROM information_schema.columns 
        WHERE table_name = 'collage_recuerdos' 
        AND column_name IN (
            'fecha_captura', 
            'hora_captura', 
            'timezone', 
            'ubicacion', 
            'tamano_optimizado', 
            'formato_final'
        )
    ) AS nuevos_campos_agregados,
    (
        SELECT COUNT(*) 
        FROM pg_indexes 
        WHERE tablename = 'collage_recuerdos'
        AND indexname LIKE 'idx_collage_%'
    ) AS indices_creados,
    (
        SELECT COUNT(*) 
        FROM collage_recuerdos 
        WHERE fecha_captura IS NOT NULL
    ) AS registros_con_fecha_captura,
    (
        SELECT COUNT(*) 
        FROM collage_recuerdos
    ) AS total_registros;

-- 7. QUERY DE DIAGNÓSTICO
-- Para revisar el estado de los datos después de la migración

SELECT 
    id,
    tipo,
    fecha_subida,
    fecha_captura,
    hora_captura,
    timezone,
    ubicacion,
    tamano_optimizado,
    formato_final,
    CASE 
        WHEN fecha_captura IS NULL THEN '⚠️ Sin fecha de captura'
        WHEN fecha_captura = fecha_subida THEN '🔄 Usando fecha de subida'
        ELSE '✅ Fecha de captura real'
    END AS estado_fecha
FROM public.collage_recuerdos
ORDER BY fecha_captura DESC NULLS LAST
LIMIT 10;

-- 8. ESTADÍSTICAS
-- Para entender el estado de los datos

SELECT 
    '📊 ESTADÍSTICAS DE MIGRACIÓN' AS titulo,
    COUNT(*) AS total_registros,
    COUNT(fecha_captura) AS con_fecha_captura,
    COUNT(hora_captura) AS con_hora_captura,
    COUNT(ubicacion) AS con_ubicacion,
    COUNT(tamano_optimizado) AS con_tamano,
    COUNT(formato_final) AS con_formato,
    ROUND(
        (COUNT(fecha_captura)::NUMERIC / COUNT(*)::NUMERIC) * 100, 
        2
    ) AS porcentaje_con_metadata
FROM public.collage_recuerdos;

-- =============================================
-- NOTAS IMPORTANTES:
-- =============================================
-- 
-- 1. Esta migración es IDEMPOTENTE: se puede ejecutar múltiples veces sin problemas
-- 2. No elimina ni modifica datos existentes
-- 3. Los índices mejoran el performance de queries de ordenamiento y filtrado
-- 4. Realtime es opcional pero recomendado para sincronización multi-usuario
-- 5. Después de ejecutar, verificar los resultados con las queries de diagnóstico
-- 
-- ROLLBACK (si es necesario):
-- 
-- DROP INDEX IF EXISTS idx_collage_fecha_captura;
-- DROP INDEX IF EXISTS idx_collage_tipo;
-- DROP INDEX IF EXISTS idx_collage_tipo_fecha;
-- 
-- ALTER TABLE public.collage_recuerdos
-- DROP COLUMN IF EXISTS fecha_captura,
-- DROP COLUMN IF EXISTS hora_captura,
-- DROP COLUMN IF EXISTS timezone,
-- DROP COLUMN IF EXISTS ubicacion,
-- DROP COLUMN IF EXISTS tamano_optimizado,
-- DROP COLUMN IF EXISTS formato_final;
-- 
-- =============================================

