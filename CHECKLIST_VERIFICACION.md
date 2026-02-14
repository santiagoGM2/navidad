# ✅ Checklist de Verificación

## 🎯 Antes de Probar

### 1. Variables de Entorno
- [ ] `.env.local` tiene todas las variables necesarias
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está configurada
- [ ] `AUTH_SESSION_SECRET` está configurada (32+ caracteres)
- [ ] `AUTH_PASSWORD_HASH` está configurada

### 2. Base de Datos
- [ ] Ejecutar SQL de `supabase/daily_memories.sql` en Supabase
- [ ] Verificar que tabla `daily_memories` existe
- [ ] Verificar que bucket `daily-memories` existe en Storage
- [ ] Verificar que bucket es público

---

## 🧪 Pruebas Funcionales

### Navbar y Login
- [ ] Navbar muestra "Acceder" cuando no hay sesión
- [ ] Click en "Acceder" abre modal de login
- [ ] Login con usuario "Tefy" y contraseña "TeAmo" funciona
- [ ] Login con usuario "Santi" y contraseña "TeAmo" funciona
- [ ] Botón cambia a "Salir" después de login exitoso
- [ ] Refrescar página mantiene sesión (F5)
- [ ] Click en "Salir" muestra confirmación
- [ ] Confirmar logout cierra sesión correctamente
- [ ] En mobile: botón "Acceder/Salir" siempre visible

### Captura de Fotos
- [ ] Botón flotante rosa NO aparece sin login
- [ ] Botón flotante rosa SÍ aparece después de login
- [ ] Click en botón abre panel con 2 opciones
- [ ] "Tomar foto" abre cámara del dispositivo
- [ ] "Subir desde galería" abre selector de archivos
- [ ] Subir imagen muestra "Subiendo..."
- [ ] Subir imagen exitosa muestra toast verde: "¡Momento capturado! 💕"
- [ ] Intentar subir segunda foto del día muestra error
- [ ] Intentar subir archivo no-imagen muestra error
- [ ] Intentar subir imagen >5MB muestra error

### Scroll Restoration
- [ ] Scroll a sección #timeline
- [ ] Click en link a /collage
- [ ] Click en botón "Volver"
- [ ] Verifica que vuelve a la misma posición de scroll
- [ ] Repetir con otras secciones (#moments, #final)
- [ ] Repetir con otras rutas (/juegos, /10-meses)

### Collage
- [ ] Imágenes horizontales se ven horizontales
- [ ] Imágenes verticales se ven verticales
- [ ] Videos se ven con orientación correcta
- [ ] No hay deformación de contenido
- [ ] Botón "Volver" funciona correctamente
- [ ] En mobile: imágenes se ven bien

### Frases del Día
- [ ] Muestra exactamente 3 frases
- [ ] Flecha izquierda navega a frase anterior
- [ ] Flecha derecha navega a frase siguiente
- [ ] Indicadores muestran progreso (1 de 3, 2 de 3, 3 de 3)
- [ ] Flechas se deshabilitan en extremos
- [ ] Animación suave entre frases
- [ ] Refrescar página muestra las mismas 3 frases del día

### Sección San Valentín
- [ ] Sección aparece después de "10 meses"
- [ ] Fondo romántico (rosa/morado)
- [ ] Partículas de corazones flotantes
- [ ] Carta con sobre cerrado
- [ ] Click en carta navega a /san-valentin
- [ ] Página muestra ramo de flores animado
- [ ] Ramo tiene 5 flores con pétalos
- [ ] Flores tienen animación suave
- [ ] Corazones flotan alrededor
- [ ] Mensaje "Para ti, con todo mi amor 💕" visible
- [ ] Botón "Volver" funciona

### Juegos
- [ ] Página /juegos muestra 4 juegos
- [ ] Botón "Volver" funciona desde lista de juegos
- [ ] Puzzle de recuerdos carga imagen aleatoria
- [ ] Puzzle se puede resolver
- [ ] Al completar puzzle: animación de logro 🎉
- [ ] Al completar puzzle: mensaje especial visible
- [ ] Botón "Volver a juegos" funciona
- [ ] Otros juegos funcionan correctamente

### 10 Meses
- [ ] Página /10-meses muestra intro de flores
- [ ] Click en "Continuar" muestra hub
- [ ] Botón "Volver" funciona
- [ ] Animaciones fluidas

---

## 📱 Pruebas Responsive

### Desktop (1920x1080)
- [ ] Navbar se ve correctamente
- [ ] Botón "Acceder/Salir" visible
- [ ] Modal de login centrado
- [ ] Botón flotante de captura en esquina
- [ ] Botón "Volver" en esquina
- [ ] Collage se ve bien distribuido
- [ ] Frases del día legibles
- [ ] San Valentín se ve romántico

### Tablet (768x1024)
- [ ] Navbar responsive
- [ ] Botones accesibles
- [ ] Modales se adaptan
- [ ] Collage se reorganiza
- [ ] Texto legible

### Mobile (375x667)
- [ ] Menú hamburguesa funciona
- [ ] Botón "Acceder/Salir" visible junto a hamburguesa
- [ ] Modal de login ocupa pantalla adecuadamente
- [ ] Botón flotante no obstruye contenido
- [ ] Collage en columna única
- [ ] Frases del día legibles
- [ ] Navegación fluida

---

## 🎨 Pruebas Visuales

### Consistencia
- [ ] Colores consistentes (violeta/rosa/azul)
- [ ] Tipografías uniformes
- [ ] Espaciados coherentes
- [ ] Sombras y efectos de profundidad

### Animaciones
- [ ] Transiciones suaves
- [ ] Sin saltos bruscos
- [ ] Hover effects funcionan
- [ ] Loading states visibles

### Accesibilidad
- [ ] Contraste de texto adecuado
- [ ] Botones tienen tamaño mínimo
- [ ] Focus states visibles
- [ ] Textos legibles

---

## 🔒 Pruebas de Seguridad

### Autenticación
- [ ] No se puede acceder a funciones privadas sin login
- [ ] Contraseña incorrecta muestra error
- [ ] Usuario incorrecto muestra error
- [ ] Sesión expira después de 7 días
- [ ] Cookies son httpOnly

### Subida de Fotos
- [ ] Solo usuarios logueados pueden subir
- [ ] Solo 1 foto por día por usuario
- [ ] Solo imágenes permitidas
- [ ] Tamaño máximo 5MB respetado
- [ ] Validación en backend funciona

---

## ⚡ Pruebas de Performance

### Carga Inicial
- [ ] Página carga en <3 segundos
- [ ] LCP <2.5 segundos
- [ ] No hay errores en consola
- [ ] No hay warnings críticos

### Navegación
- [ ] Transiciones entre páginas fluidas
- [ ] Scroll suave
- [ ] Animaciones no causan lag
- [ ] Imágenes cargan progresivamente

---

## 🐛 Verificación de Errores

### Consola del Navegador
- [ ] No hay errores rojos
- [ ] No hay warnings críticos
- [ ] Network requests exitosas
- [ ] Cookies guardadas correctamente

### Terminal del Servidor
- [ ] No hay errores en logs
- [ ] API responses correctas
- [ ] Supabase conectado

---

## ✅ Checklist Final

- [ ] Todas las funcionalidades implementadas
- [ ] Todas las pruebas pasadas
- [ ] Sin errores de compilación
- [ ] Sin errores en runtime
- [ ] Responsive en todos los dispositivos
- [ ] Estética emocional mantenida
- [ ] Performance optimizado
- [ ] Seguridad implementada
- [ ] Código limpio y documentado

---

## 🚀 Listo para Deploy

Si todos los checkboxes están marcados:

1. Commit de cambios:
```bash
git add .
git commit -m "feat: mejoras integrales UX/UI y nuevas funcionalidades"
git push
```

2. Verificar variables en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AUTH_SESSION_SECRET`
   - `AUTH_PASSWORD_HASH`

3. Deploy automático en Vercel

4. Probar en producción

---

**¡Todo listo para disfrutar!** 💕✨
