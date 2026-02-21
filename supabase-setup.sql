-- =============================================
-- SETUP COMPLETO DE SUPABASE PARA CACHETONA
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- 1. CREAR TABLA daily_memories (para fotos privadas)
CREATE TABLE IF NOT EXISTS public.daily_memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    image_url TEXT NOT NULL,
    file_path TEXT,
    description TEXT,
    uploaded_by TEXT,
    day_of_year INT,
    year INT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CREAR TABLA daily_phrases (ya existe pero por si acaso)
CREATE TABLE IF NOT EXISTS public.daily_phrases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    author TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. HABILITAR RLS (Row Level Security)
ALTER TABLE public.daily_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_phrases ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE ACCESO - Permitir TODO para anon (nuestra app controla auth via cookies)
-- Daily Memories
DROP POLICY IF EXISTS "Allow all for daily_memories" ON public.daily_memories;
CREATE POLICY "Allow all for daily_memories" ON public.daily_memories
    FOR ALL USING (true) WITH CHECK (true);

-- Daily Phrases
DROP POLICY IF EXISTS "Allow read for daily_phrases" ON public.daily_phrases;
CREATE POLICY "Allow read for daily_phrases" ON public.daily_phrases
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert for daily_phrases" ON public.daily_phrases;
CREATE POLICY "Allow insert for daily_phrases" ON public.daily_phrases
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update for daily_phrases" ON public.daily_phrases;
CREATE POLICY "Allow update for daily_phrases" ON public.daily_phrases
    FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete for daily_phrases" ON public.daily_phrases;
CREATE POLICY "Allow delete for daily_phrases" ON public.daily_phrases
    FOR DELETE USING (true);

-- 5. CREAR BUCKETS DE STORAGE
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('collage', 'collage', true, 104857600, ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/quicktime','video/webm']),
    ('daily-memories', 'daily-memories', true, 104857600, ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/quicktime','video/webm'])
ON CONFLICT (id) DO NOTHING;

-- 6. POLÍTICAS DE STORAGE - Permitir subida y lectura pública
-- Collage bucket
DROP POLICY IF EXISTS "Allow public read collage" ON storage.objects;
CREATE POLICY "Allow public read collage" ON storage.objects
    FOR SELECT USING (bucket_id = 'collage');

DROP POLICY IF EXISTS "Allow public upload collage" ON storage.objects;
CREATE POLICY "Allow public upload collage" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'collage');

-- Daily-memories bucket
DROP POLICY IF EXISTS "Allow public read daily-memories" ON storage.objects;
CREATE POLICY "Allow public read daily-memories" ON storage.objects
    FOR SELECT USING (bucket_id = 'daily-memories');

DROP POLICY IF EXISTS "Allow public upload daily-memories" ON storage.objects;
CREATE POLICY "Allow public upload daily-memories" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'daily-memories');

-- 7. Verificación
SELECT 'Tablas creadas' AS status, 
    (SELECT count(*) FROM information_schema.tables WHERE table_name IN ('daily_memories', 'daily_phrases') AND table_schema = 'public') AS tablas_ok;
SELECT 'Buckets creados' AS status, 
    (SELECT count(*) FROM storage.buckets WHERE id IN ('collage', 'daily-memories')) AS buckets_ok;
