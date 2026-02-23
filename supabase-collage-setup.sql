-- =============================================
-- SETUP DE TABLA collage_recuerdos
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- 1. CREAR TABLA collage_recuerdos
CREATE TABLE IF NOT EXISTS public.collage_recuerdos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    fecha_subida TIMESTAMPTZ DEFAULT now() NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('foto', 'video')),
    usuario_subio TEXT NOT NULL,
    file_path TEXT,
    descripcion TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. HABILITAR RLS
ALTER TABLE public.collage_recuerdos ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE ACCESO
-- Todos pueden leer (público)
DROP POLICY IF EXISTS "Allow public read collage_recuerdos" ON public.collage_recuerdos;
CREATE POLICY "Allow public read collage_recuerdos" ON public.collage_recuerdos
    FOR SELECT USING (true);

-- Solo insert (la app controla auth via cookies)
DROP POLICY IF EXISTS "Allow insert collage_recuerdos" ON public.collage_recuerdos;
CREATE POLICY "Allow insert collage_recuerdos" ON public.collage_recuerdos
    FOR INSERT WITH CHECK (true);

-- Delete permitido (controlado por la app)
DROP POLICY IF EXISTS "Allow delete collage_recuerdos" ON public.collage_recuerdos;
CREATE POLICY "Allow delete collage_recuerdos" ON public.collage_recuerdos
    FOR DELETE USING (true);

-- 4. POLÍTICA DE DELETE EN STORAGE para bucket collage
DROP POLICY IF EXISTS "Allow public delete collage" ON storage.objects;
CREATE POLICY "Allow public delete collage" ON storage.objects
    FOR DELETE USING (bucket_id = 'collage');

-- 5. Índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_collage_recuerdos_fecha 
    ON public.collage_recuerdos (fecha_subida DESC);

-- 6. Verificación
SELECT 'Tabla collage_recuerdos creada' AS status,
    (SELECT count(*) FROM information_schema.tables 
     WHERE table_name = 'collage_recuerdos' AND table_schema = 'public') AS tabla_ok;
