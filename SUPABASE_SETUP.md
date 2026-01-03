# Configuración de Supabase para Frases del Día

## 📋 Pasos para Configurar

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la **URL del proyecto** y la **Anon Key**

### 2. Configurar Variables de Entorno

1. Copia el archivo `.env.local.example` a `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edita `.env.local` y añade tus credenciales de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
   ```

### 3. Crear la Tabla en Supabase

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `supabase/schema.sql`
4. Ejecuta el script

Esto creará:
- La tabla `daily_phrases`
- Índices para optimización
- Políticas de seguridad (RLS)
- Frases de ejemplo

### 4. Configurar MCP de Supabase (Opcional)

Si quieres usar el MCP de Supabase en Cursor:

1. Edita `~/.cursor/mcp.json` (o `C:\Users\santi\.cursor\mcp.json` en Windows)
2. Añade la configuración:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server"
      ],
      "env": {
        "SUPABASE_URL": "https://tu-proyecto.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "tu_service_role_key"
      }
    }
  }
}
```

**Nota:** El MCP es opcional. La funcionalidad funciona sin él usando el cliente de Supabase directamente.

### 5. Añadir Frases

Puedes añadir frases de dos formas:

#### Opción A: Desde Supabase Dashboard
1. Ve a **Table Editor** en Supabase
2. Selecciona la tabla `daily_phrases`
3. Haz clic en **Insert** y añade nuevas frases

#### Opción B: Desde SQL Editor
```sql
INSERT INTO daily_phrases (text, author, active) VALUES
('Tu frase aquí', 'Autor (opcional)', true);
```

## 🎨 Uso del Componente

El componente `DailyPhrase` ya está integrado en la página principal (`/`). 

Para usarlo en otras páginas:

```tsx
import DailyPhrase from '@/components/DailyPhrase'

// En tu componente
<DailyPhrase />
```

## 🔒 Seguridad

- Las frases solo se pueden leer públicamente (RLS configurado)
- Para insertar/editar frases, necesitarás configurar autenticación o usar el Service Role Key desde el backend

## 📝 Estructura de la Tabla

```sql
daily_phrases
├── id (UUID, Primary Key)
├── text (TEXT, NOT NULL) - La frase
├── author (TEXT, NULLABLE) - Autor opcional
├── active (BOOLEAN, DEFAULT true) - Si está activa
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🚀 Próximos Pasos

1. Añade más frases personalizadas
2. Opcional: Crea un panel de administración para gestionar frases
3. Opcional: Añade categorías o tags a las frases


