# 🧪 Test de Sincronización del Collage

## Prueba Rápida (2 minutos)

### 1. Preparación
```bash
# Asegúrate de que el servidor esté corriendo
npm run dev
```

### 2. Abrir Consola del Navegador
- Presiona F12
- Ve a la pestaña "Console"
- Deja la consola abierta durante toda la prueba

### 3. Ir a /collage
- Navega a `http://localhost:3000/collage`
- Busca en consola: `📡 Estado de suscripción Realtime:`
  - ✅ Si dice `SUBSCRIBED` → Realtime funciona
  - ⚠️ Si dice `CHANNEL_ERROR` → Realtime no disponible (pero el fix funciona igual)

### 4. Subir una Foto

#### Opción A: Desde Cámara
1. Click en el botón flotante morado (abajo derecha)
2. Click en "Tomar foto con cámara"
3. Permite acceso a la cámara
4. Toma una foto

#### Opción B: Desde Galería
1. Click en el botón flotante morado
2. Click en "Subir desde galería"
3. Selecciona una imagen

### 5. Observar Logs en Consola

Deberías ver esta secuencia:

```
✅ Upload exitoso, respuesta del servidor: {success: true, recuerdo: {...}}
📤 Llamando a onRecuerdoSubido con: {id: "...", url: "...", ...}
📸 Recuerdo subido, agregando al estado: {id: "...", ...}
✅ Agregando nuevo item al estado
[después de 2 segundos]
🔄 Refetch de seguridad después de 2s
```

### 6. Verificar Resultado Visual

✅ **ÉXITO si:**
- La imagen aparece inmediatamente en primera posición
- No hay delay perceptible (< 1 segundo)
- El toast dice "¡Recuerdo optimizado y publicado!"
- La página hace scroll automático al inicio
- Los filtros se resetean a "TODOS" / "RECIENTE"

❌ **FALLO si:**
- La imagen NO aparece
- Hay que refrescar manualmente (F5)
- Aparece después de varios segundos
- Aparece en posición incorrecta

---

## 🐛 Troubleshooting

### Problema: No aparece ningún log en consola

**Causa:** Los archivos no se actualizaron correctamente

**Solución:**
```bash
# Detener el servidor (Ctrl+C)
# Limpiar cache de Next.js
rm -rf .next
# Reiniciar
npm run dev
```

### Problema: Error "Cannot read property 'id' of undefined"

**Causa:** El API no está devolviendo `data.recuerdo`

**Solución:**
1. Ve a Network tab en DevTools
2. Busca la petición POST a `/api/collage/upload`
3. Verifica la respuesta
4. Si no tiene `recuerdo`, revisa el archivo `app/api/collage/upload/route.ts`

### Problema: "📡 Estado de suscripción Realtime: CHANNEL_ERROR"

**Causa:** Realtime no está habilitado en Supabase

**Solución:**
1. Ve a Supabase Dashboard
2. Database → Replication
3. Habilita `collage_recuerdos`
4. Refresca la página

**NOTA:** Esto NO impide que funcione el fix. El optimistic update + refetch garantizan que funcione.

### Problema: La imagen aparece pero desaparece

**Causa:** Duplicado detectado y removido

**Solución:**
- Esto es normal si Realtime está habilitado
- El sistema previene duplicados automáticamente
- Si persiste, revisa que el `id` sea único

### Problema: Aparece después de 2 segundos

**Causa:** El optimistic update no se ejecutó

**Solución:**
1. Verifica que veas el log: `📸 Recuerdo subido, agregando al estado`
2. Si no lo ves, el callback no se está llamando
3. Revisa que `onRecuerdoSubido` esté pasado correctamente al componente

---

## 📊 Métricas de Éxito

| Métrica | Objetivo | Cómo Medir |
|---------|----------|------------|
| Tiempo hasta render | < 1 segundo | Cronómetro desde click hasta ver imagen |
| Logs completos | 5 logs mínimo | Contar logs en consola |
| Posición correcta | Primera posición | Verificar visualmente |
| Sin errores | 0 errores | Revisar consola (rojo) |
| Funciona en móvil | Sí | Probar en dispositivo real |

---

## 🎯 Casos de Prueba Adicionales

### Test 1: Subida Múltiple
1. Sube 3 fotos seguidas
2. Verifica que aparezcan en orden correcto
3. Verifica que no haya duplicados

### Test 2: Filtros
1. Sube una foto
2. Cambia el filtro a "VIDEOS"
3. Cambia de vuelta a "TODOS"
4. Verifica que la foto siga ahí

### Test 3: Ordenamiento
1. Sube una foto
2. Cambia el orden a "ANTIGUO"
3. Verifica que la foto esté al final
4. Cambia a "RECIENTE"
5. Verifica que esté al inicio

### Test 4: Eliminación (Admin)
1. Sube una foto
2. Haz hover sobre ella
3. Click en el botón de eliminar (X rojo)
4. Confirma eliminación
5. Verifica que desaparezca inmediatamente

### Test 5: Multi-Usuario (si Realtime funciona)
1. Abre dos navegadores diferentes
2. Loguéate como admin en ambos
3. Ve a /collage en ambos
4. Sube una foto en el navegador 1
5. Verifica que aparezca automáticamente en el navegador 2

---

## ✅ Checklist de Validación

- [ ] Logs aparecen en consola
- [ ] Imagen aparece en < 1 segundo
- [ ] Aparece en primera posición
- [ ] Toast de confirmación se muestra
- [ ] Scroll automático al inicio funciona
- [ ] Filtros se resetean correctamente
- [ ] No hay errores en consola
- [ ] Funciona con cámara
- [ ] Funciona con galería
- [ ] Funciona en móvil
- [ ] Funciona en desktop
- [ ] Eliminación funciona (admin)
- [ ] No hay duplicados

---

## 📝 Reporte de Resultados

Después de las pruebas, documenta:

```
✅ FUNCIONANDO:
- [x] Upload desde cámara
- [x] Upload desde galería
- [x] Render inmediato
- [x] Posición correcta
- [x] Logs completos

⚠️ PROBLEMAS ENCONTRADOS:
- [ ] Ninguno

🔧 CONFIGURACIÓN:
- Realtime: [SUBSCRIBED / CHANNEL_ERROR]
- Tiempo de render: [X segundos]
- Navegador: [Chrome / Firefox / Safari]
- Dispositivo: [Desktop / Móvil]
```
