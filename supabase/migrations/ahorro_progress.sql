CREATE TABLE IF NOT EXISTS ahorro_progress (
  id INTEGER PRIMARY KEY DEFAULT 1,
  meta BIGINT DEFAULT 2000000,
  ahorrado BIGINT DEFAULT 0,
  restante BIGINT DEFAULT 2000000,
  porcentaje NUMERIC(5,2) DEFAULT 0.00,
  dias_listos INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ahorro_progress (id, meta, ahorrado, restante, porcentaje, dias_listos)
VALUES (1, 2000000, 0, 2000000, 0.00, 0)
ON CONFLICT (id) DO NOTHING;

-- ⚠️  IMPORTANTE: Después de ejecutar este SQL, activa Realtime para esta tabla:
-- Supabase Dashboard → Database → Replication → ahorro_progress → toggle ON
