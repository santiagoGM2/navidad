# ✅ Solución: Login funcionando

## 🔧 Problema resuelto

El error "Contraseña incorrecta" era porque faltaban las variables de entorno de autenticación.

## ✅ Variables configuradas

He agregado al archivo `.env.local`:

```bash
AUTH_SESSION_SECRET=0jhSCju2K/pWQJhL1U3rq3BKvXQSnm+sR7OgDPVqLoc=
AUTH_PASSWORD_HASH=2e13261f801ac0f449e4af138b472607e5dcd08f0f6324dd17ff33b7d16f1599b94c563e7f423d900f4ae9517a188a1d0aa24396a07e3e20de3d0ea462caaaab
```

## 🚀 Próximos pasos

### 1. Reiniciar el servidor

**IMPORTANTE**: Debes reiniciar el servidor para que tome las nuevas variables.

```bash
# Detén el servidor actual (Ctrl + C)
# Luego inicia de nuevo:
npm run dev
```

### 2. Probar el login

Ahora sí debería funcionar:

- **Usuario**: `Tefy` o `Santi`
- **Contraseña**: `TeAmo`

### 3. Configurar SUPABASE_SERVICE_ROLE_KEY (opcional por ahora)

Para que funcione la subida de fotos, necesitas:

1. Ve a: https://supabase.com/dashboard/project/lrcgsdmnmnwphnhdzqia/settings/api
2. Busca la sección **Project API keys**
3. Copia el valor de `service_role` (secret)
4. Reemplaza `REEMPLAZAR_CON_TU_SERVICE_ROLE_KEY` en `.env.local`
5. Reinicia el servidor de nuevo

---

## ✅ Verificación

Después de reiniciar el servidor:

1. Ve a http://localhost:3000
2. Click en "Acceder"
3. Usuario: `Tefy`
4. Contraseña: `TeAmo`
5. ✅ Debería funcionar y cambiar el botón a "Salir"

---

## 🔐 Credenciales finales

- **Usuario 1**: Tefy
- **Usuario 2**: Santi
- **Contraseña**: TeAmo (para ambos)

---

¡Listo! El login ya debería funcionar. 🚀
