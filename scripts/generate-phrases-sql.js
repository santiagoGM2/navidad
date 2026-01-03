/**
 * Script para generar SQL de inserción de las 365 frases
 * Ejecutar: node scripts/generate-phrases-sql.js > supabase/insert-365-phrases.sql
 */

const fs = require('fs')
const path = require('path')

// Leer el archivo JSON con encoding UTF-8
const phrasesPath = path.join(__dirname, '../data/daily-phrases.json')
const phrases = JSON.parse(fs.readFileSync(phrasesPath, 'utf8'))

let output = '-- ============================================\n'
output += '-- INSERTAR 365 FRASES DEL DÍA\n'
output += '-- ============================================\n'
output += '-- Este script inserta las 365 frases para el sistema de "Frase del Día"\n'
output += '-- Cada frase está asociada a un día del año (1-365)\n'
output += '-- Ejecutar en Supabase SQL Editor\n'
output += '-- ============================================\n\n'

output += '-- Limpiar frases existentes (opcional, comentar si quieres conservar las actuales)\n'
output += '-- DELETE FROM daily_phrases;\n\n'

output += '-- Insertar las 365 frases\n'
output += 'INSERT INTO daily_phrases (text, author, active) VALUES\n'

phrases.forEach((phrase, index) => {
  const isLast = index === phrases.length - 1
  // Escapar comillas simples y caracteres especiales para SQL
  const escapedText = phrase.text
    .replace(/\\/g, '\\\\')  // Escapar backslashes primero
    .replace(/'/g, "''")     // Escapar comillas simples
  const comma = isLast ? ';' : ','
  
  output += `  ('${escapedText}', NULL, true)${comma}\n`
})

output += '\n-- ============================================\n'
output += '-- Verificar inserción:\n'
output += '-- SELECT COUNT(*) FROM daily_phrases WHERE active = true;\n'
output += '-- Debe retornar 365\n'
output += '-- ============================================\n'

// Escribir con encoding UTF-8
process.stdout.write(output)
