-- Script para insertar frases de ejemplo
-- Ejecutar en Supabase SQL Editor si las frases no se insertaron automáticamente

INSERT INTO daily_phrases (text, author, active) VALUES
('yo te amo más, lo acabo de demostrar', NULL, true),
('mi princesa hermosa', NULL, true),
('recuerda que si tú me amas, yo te amo más', NULL, true),
('eres mi todo', NULL, true),
('contigo quiero envejecer', NULL, true),
('cada día te amo más que ayer', NULL, true),
('eres la razón de mi sonrisa', NULL, true),
('mi amor por ti crece cada día', NULL, true)
ON CONFLICT DO NOTHING;

