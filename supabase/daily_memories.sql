-- Tabla para almacenar las fotos diarias capturadas por los usuarios
CREATE TABLE IF NOT EXISTS daily_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  image_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_daily_memories_username ON daily_memories(username);
CREATE INDEX IF NOT EXISTS idx_daily_memories_created_at ON daily_memories(created_at DESC);

-- RLS (Row Level Security) - Permitir lectura a todos, escritura solo autenticados
ALTER TABLE daily_memories ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer
CREATE POLICY "Permitir lectura pública" ON daily_memories
  FOR SELECT
  USING (true);

-- Política: Solo usuarios autenticados pueden insertar (esto se valida en el backend)
CREATE POLICY "Permitir inserción autenticada" ON daily_memories
  FOR INSERT
  WITH CHECK (true);

-- Crear bucket de storage si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('daily-memories', 'daily-memories', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage: Permitir lectura pública
CREATE POLICY "Permitir lectura pública de imágenes" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'daily-memories');

-- Política de storage: Permitir subida (validación en backend)
CREATE POLICY "Permitir subida de imágenes" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'daily-memories');
