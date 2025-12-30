# 🚀 EJECUTA ESTE SQL EN SUPABASE

## 📋 Instrucciones Rápidas:

1. Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/sql/new
2. Copia TODO el contenido de abajo
3. Pégalo en el editor SQL
4. Click en **Run** (o presiona Ctrl+Enter)
5. Deberías ver: "Success. No rows returned"

---

## 📝 SQL a Ejecutar:

```sql
-- Tabla para almacenar las frases del día
CREATE TABLE IF NOT EXISTS daily_phrases (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	text TEXT NOT NULL,
	author TEXT,
	active BOOLEAN DEFAULT true,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_daily_phrases_active ON daily_phrases(active) WHERE active = true;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_daily_phrases_updated_at
	BEFORE UPDATE ON daily_phrases
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE daily_phrases ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura pública de frases activas
CREATE POLICY "Public can read active phrases"
	ON daily_phrases
	FOR SELECT
	USING (active = true);

-- Insertar algunas frases de ejemplo
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
```

---

## ✅ Después de Ejecutar:

1. Ve a **Table Editor** en Supabase
2. Deberías ver la tabla `daily_phrases` con 8 frases
3. Ejecuta: `npm run test:supabase`
4. Deberías ver: "✅ Conexión exitosa! 📝 Frases encontradas: 8"
5. Reinicia el servidor: `npm run dev`
6. Ve a http://localhost:3000 y verás la frase del día funcionando

