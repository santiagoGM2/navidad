# Configuración del MCP de Supabase en Cursor

## ¿Qué es MCP?

MCP (Model Context Protocol) permite que Cursor se conecte directamente con Supabase para ayudarte a gestionar tu base de datos desde el editor.

## Configuración del MCP

### 1. Editar el archivo de configuración de MCP

Abre el archivo de configuración de MCP de Cursor:

**Windows:**
```
C:\Users\santi\.cursor\mcp.json
```

**Mac/Linux:**
```
~/.cursor/mcp.json
```

### 2. Añadir la configuración de Supabase

Reemplaza el contenido con:

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
        "SUPABASE_SERVICE_ROLE_KEY": "tu_service_role_key_aqui"
      }
    }
  }
}
```

### 3. Obtener las credenciales

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings** > **API**
3. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (secreto) → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Importante:** El `SERVICE_ROLE_KEY` es muy sensible. No lo compartas ni lo subas a Git.

### 4. Reiniciar Cursor

Después de guardar el archivo, reinicia Cursor para que cargue la nueva configuración.

## Uso del MCP

Una vez configurado, puedes pedirle a Cursor que:
- Cree tablas en Supabase
- Añada datos a la base de datos
- Modifique esquemas
- Ejecute queries SQL

Ejemplo: "Añade una nueva frase a la tabla daily_phrases"

## Nota Importante

**El MCP es opcional.** La funcionalidad de "Frase del Día" funciona perfectamente sin el MCP usando el cliente de Supabase directamente. El MCP solo facilita la gestión desde Cursor.

## Alternativa sin MCP

Si prefieres no usar MCP, puedes:
1. Gestionar la base de datos desde el Dashboard de Supabase
2. Usar el SQL Editor de Supabase
3. Crear un panel de administración en tu app

