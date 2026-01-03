-- ============================================
-- ACTUALIZACIÓN OPCIONAL DEL SCHEMA
-- Agregar campo day_index para asociar frases a días específicos
-- ============================================
-- NOTA: Esta actualización es OPCIONAL
-- El sistema funciona sin este campo usando el orden de inserción
-- Solo ejecutar si quieres asociar frases específicas a días específicos del año
-- ============================================

-- Agregar columna day_index (opcional, 1-365)
ALTER TABLE daily_phrases 
ADD COLUMN IF NOT EXISTS day_index INTEGER;

-- Crear índice para búsquedas rápidas por día
CREATE INDEX IF NOT EXISTS idx_daily_phrases_day_index 
ON daily_phrases(day_index) 
WHERE day_index IS NOT NULL;

-- Comentario: Si usas day_index, puedes actualizar la API para buscar directamente:
-- SELECT * FROM daily_phrases WHERE day_index = [día del año] AND active = true LIMIT 1;
-- 
-- Si no existe una frase con ese day_index, el sistema actual funcionará como fallback

