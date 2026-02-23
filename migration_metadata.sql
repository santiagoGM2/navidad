-- =============================================
-- MIGRACIÓN DE METADATA PARA collage_recuerdos
-- =============================================

ALTER TABLE public.collage_recuerdos 
ADD COLUMN IF NOT EXISTS fecha_captura TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS hora_captura TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS ubicacion JSONB,
ADD COLUMN IF NOT EXISTS tamano_optimizado BIGINT,
ADD COLUMN IF NOT EXISTS formato_final TEXT;

-- Poblar datos iniciales para registros antiguos
UPDATE public.collage_recuerdos 
SET 
    fecha_captura = fecha_subida,
    formato_final = CASE WHEN tipo = 'foto' THEN 'image/jpeg' ELSE 'video/mp4' END
WHERE fecha_captura IS NULL;

-- Índices para optimización de filtros (Punto 5 del requerimiento)
CREATE INDEX IF NOT EXISTS idx_collage_recuerdos_fecha_captura ON public.collage_recuerdos (fecha_captura DESC);
CREATE INDEX IF NOT EXISTS idx_collage_recuerdos_tipo ON public.collage_recuerdos (tipo);
