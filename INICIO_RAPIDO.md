# 🚀 Inicio Rápido - Nuevas Funcionalidades

## ⚡ Setup en 3 pasos

### Paso 1: Configurar variables de entorno

```bash
# Genera el hash de la contraseña
node scripts/generate-password-hash.js TeAmo
```

Copia el resultado y agrégalo a `.env.local` junto con las otras variables:

```bash
# Agrega estas líneas a .env.local:
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase
AUTH_SESSION_SECRET=$(openssl rand -base64 32)
AUTH_PASSWORD_HASH=el_hash_que_generaste_arriba
```

**Obtener SUPABASE_SERVICE_ROLE_KEY:**
1. Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/settings/api
2. Copia el valor de `service_role` (secret)

---

### Paso 2: Configurar base de datos

1. Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/sql/new
2. Abre el archivo `supabase/daily_memories.sql`
3. Copia TODO el contenido
4. Pégalo en el editor SQL
5. Click en **Run**

---

### Paso 3: Iniciar el servidor

```bash
npm run dev
```

Ve a: http://localhost:3000

---

## ✅ Probar las funcionalidades

### 1. Login
- Click en "Acceder" (navbar)
- Usuario: `Tefy` o `Santi`
- Contraseña: `TeAmo`
- ✅ El botón cambia a "Salir"

### 2. Capturar foto
- Después de login, verás un botón rosa flotante (esquina inferior derecha)
- Click → Tomar foto o subir desde galería
- ✅ La foto se guarda en Supabase

### 3. Scroll restoration
- Navega a una sección (ej: scroll hasta "Historia")
- Ve a otra ruta (ej: click en algún link)
- Regresa con el botón "Volver" (esquina inferior izquierda)
- ✅ Deberías estar en la misma posición

### 4. San Valentín
- Scroll hasta la sección "San Valentín"
- Click en "Descubrir mi regalo"
- ✅ Disfruta del ramo animado 🌸

---

## 📚 Documentación completa

- **Implementación completa**: `IMPLEMENTACION_COMPLETA.md`
- **Configurar variables**: `CONFIGURAR_ENV.md`
- **Setup de base de datos**: `SETUP_DAILY_MEMORIES.md`

---

## 🐛 Problemas comunes

**Login no funciona:**
```bash
# Verifica que las variables estén en .env.local
cat .env.local | grep AUTH_
```

**No se suben fotos:**
```bash
# Verifica que el SQL se ejecutó correctamente
# Ve a: Supabase Dashboard → Table Editor → daily_memories
```

**Scroll no se restaura:**
```bash
# Limpia el cache del navegador
# Ctrl + Shift + R (Windows/Linux)
# Cmd + Shift + R (Mac)
```

---

¡Listo para usar! 🎉
