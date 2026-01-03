# Guía de Mantenimiento - Sitio Web

## Mantenimiento Regular

### 1. Verificación de Accesibilidad

**Herramientas recomendadas:**
- Lighthouse (Chrome DevTools)
- WAVE (Web Accessibility Evaluation Tool)
- axe DevTools

**Checklist mensual:**
- [ ] Ejecutar Lighthouse y verificar score ≥90 en Accesibilidad
- [ ] Verificar contraste de colores con herramientas (ratio ≥4.5:1)
- [ ] Revisar estructura de encabezados (h1 → h2 → h3)
- [ ] Probar navegación con teclado
- [ ] Verificar con lector de pantalla

### 2. Verificación de Rendimiento

**Checklist mensual:**
- [ ] Ejecutar Lighthouse y verificar Performance ≥85 (móvil)
- [ ] Verificar Core Web Vitals:
  - LCP < 3s
  - FID < 100ms
  - CLS < 0.1
- [ ] Probar en dispositivos móviles reales
- [ ] Verificar en red 3G simulada

**Herramientas:**
- Chrome DevTools Performance tab
- PageSpeed Insights
- WebPageTest

### 3. Contador de Tiempo

**Verificación semanal:**
- [ ] Verificar que el contador nunca se detenga
- [ ] Verificar precisión de cálculo
- [ ] Revisar consola por errores

**Si el contador se detiene:**
1. Revisar `hooks/useTimeTogether.ts`
2. Verificar fecha de inicio en `constants/index.ts`
3. Revisar consola del navegador por errores

### 4. Imágenes

**Checklist trimestral:**
- [ ] Verificar que todas las imágenes usen componente `Image` de Next.js
- [ ] Optimizar nuevas imágenes antes de subirlas:
  - Convertir a WebP/AVIF
  - Comprimir sin pérdida
  - Añadir `alt` text descriptivo

**Herramientas:**
- `sharp` (CLI o Node.js)
- Squoosh (web)
- ImageOptim (Mac)

### 5. Actualizaciones de Dependencias

**Checklist mensual:**
- [ ] Revisar actualizaciones de seguridad
- [ ] Actualizar dependencias menores
- [ ] Probar después de actualizar dependencias mayores

**Comandos:**
```bash
npm audit
npm update
npm outdated
```

---

## Modificaciones Comunes

### Añadir Nueva Sección

1. Crear componente en `components/`
2. Añadir a `app/page.tsx` con estructura correcta de encabezados
3. Verificar contraste de colores
4. Añadir a navegación si es necesario

### Modificar Colores del Fondo

**Archivo:** `components/ConstellationBackground.tsx`

Modificar `SKY_COLORS`:
```typescript
const SKY_COLORS = {
    dawn: { top: '#...', mid: '#...', bottom: '#...' },
    dusk: { top: '#...', mid: '#...', bottom: '#...' },
    night: { top: '#...', mid: '#...', bottom: '#...' }
}
```

**Importante:** Verificar contraste de texto después de cambiar colores.

### Añadir Nueva Constelación

**Archivo:** `components/ConstellationBackground.tsx`

Añadir al array `constellations`:
```typescript
{
    id: X,
    stars: [{ x: ..., y: ... }, ...],
    connections: [[0, 1], ...],
    appearAt: 0
}
```

### Modificar Textos

**Siempre verificar:**
- Contraste de color (ratio ≥4.5:1)
- Estructura de encabezados
- Alt text en imágenes

---

## Solución de Problemas

### El contador no funciona

1. Verificar fecha en `constants/index.ts`
2. Revisar consola por errores
3. Verificar que `useTimeTogether` se esté llamando correctamente

### Problemas de rendimiento

1. Verificar número de estrellas (reducir si es necesario)
2. Deshabilitar animaciones si hay `prefers-reduced-motion`
3. Verificar que las imágenes estén optimizadas
4. Revisar bundle size con `npm run build`

### Problemas de contraste

1. Usar herramienta de contraste (WebAIM, etc.)
2. Aumentar opacidad de texto
3. Añadir sombra de texto
4. Ajustar fondo si es necesario

### Animaciones no funcionan

1. Verificar `prefers-reduced-motion` en sistema
2. Verificar que la pestaña esté activa
3. Revisar consola por errores

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linter
npm run lint

# Verificar Supabase
npm run test:supabase
```

---

## Estructura de Archivos Importantes

```
├── app/
│   ├── layout.tsx          # Layout principal
│   └── page.tsx             # Página principal
├── components/
│   ├── ConstellationBackground.tsx  # Fondo dinámico
│   ├── TimeCounter.tsx      # Contador de tiempo
│   ├── DailyPhrase.tsx      # Frase del día
│   └── DepthTimeline.tsx    # Timeline
├── hooks/
│   └── useTimeTogether.ts   # Hook del contador
├── styles/
│   └── globals.css          # Estilos globales
└── next.config.js           # Configuración Next.js
```

---

## Contacto y Soporte

Para problemas o preguntas sobre mantenimiento, consultar:
- Documentación de Next.js: https://nextjs.org/docs
- Documentación de Tailwind: https://tailwindcss.com/docs
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

**Última actualización:** Diciembre 2024

