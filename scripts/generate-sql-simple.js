const fs = require('fs')
const phrases = JSON.parse(fs.readFileSync('data/daily-phrases.json', 'utf8'))

let sql = `-- ============================================
-- INSERTAR 365 FRASES DEL DÍA
-- ============================================
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Limpiar frases existentes (opcional)
-- DELETE FROM daily_phrases;

INSERT INTO daily_phrases (text, author, active) VALUES
`

phrases.forEach((phrase, index) => {
  const escaped = phrase.text.replace(/'/g, "''")
  const comma = index < phrases.length - 1 ? ',' : ';'
  sql += `  ('${escaped}', NULL, true)${comma}\n`
})

sql += `\n-- Verificar: SELECT COUNT(*) FROM daily_phrases WHERE active = true;
-- Debe retornar 365
`

fs.writeFileSync('supabase/insert-365-phrases.sql', sql, 'utf8')
console.log('✅ SQL generado correctamente en supabase/insert-365-phrases.sql')

