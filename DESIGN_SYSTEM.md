# Sistema de Diseño Visual

## 🎨 Identidad Visual

### Inspiración
- **El mar**: Profundidad, calma, movimiento suave
- **La calma**: Tranquilidad, serenidad, paz
- **El amor profundo**: Emoción, conexión, intimidad
- **El paso del tiempo**: Fluidez, continuidad, evolución

### Principios de Diseño
1. **Minimalismo estricto**: Nada recargado, mucho espacio en blanco
2. **Fluidez**: Transiciones lentas y elegantes, nada brusco
3. **Jerarquía visual clara**: Elementos bien organizados y espaciados
4. **Modernidad**: Diseño actual (2024-2025)

## 🌊 Paleta de Colores

### Colores Principales (Ocean)
```css
ocean-light: #BAE6FD    /* Azul cielo claro - aguamarina suave */
ocean-lighter: #E0F2FE  /* Azul muy claro */
ocean-base: #38BDF8     /* Azul aguamarina */
ocean-medium: #0EA5E9   /* Azul medio */
ocean-deep: #0284C7     /* Azul profundo */
ocean-deeper: #0369A1   /* Azul muy profundo */
ocean-darkest: #0C4A6E  /* Azul oscuro */
```

### Colores Neutros (Pearl)
```css
pearl-white: #FAFAFA    /* Blanco perla */
pearl-cream: #F5F5F5    /* Crema suave */
```

### Uso de Colores
- **Fondo principal**: `pearl-white` con overlay de gradiente oceánico sutil
- **Texto principal**: `slate-900` para máximo contraste y legibilidad
- **Acentos**: Gradientes de `ocean-light` a `ocean-deep`
- **Glassmorphism**: Fondos blancos con opacidad (10-30%) y blur

## 📝 Tipografía

### Fuentes

#### Principal (Sans-serif)
- **Familia**: `Inter`
- **Uso**: Texto de cuerpo, navegación, elementos UI
- **Pesos**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

#### Secundaria (Display)
- **Familia**: `Playfair Display`
- **Uso**: Títulos, elementos destacados, citas
- **Pesos**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Escala Tipográfica

| Tamaño | Valor | Line Height | Uso |
|--------|-------|-------------|-----|
| xs | 0.75rem | 1.5 | Texto pequeño, labels |
| sm | 0.875rem | 1.6 | Texto secundario |
| base | 1rem | 1.7 | Texto de cuerpo |
| lg | 1.125rem | 1.7 | Texto destacado |
| xl | 1.25rem | 1.7 | Subtítulos |
| 2xl | 1.5rem | 1.6 | Títulos sección |
| 3xl | 1.875rem | 1.5 | Títulos grandes |
| 4xl | 2.25rem | 1.4 | Títulos hero |
| 5xl | 3rem | 1.3 | Títulos principales |
| 6xl | 3.75rem | 1.2 | Títulos display |
| 7xl | 4.5rem | 1.1 | Títulos hero grandes |

### Principios Tipográficos
- **Tracking**: Ajustado según tamaño (más negativo en tamaños grandes)
- **Line Height**: Generoso para legibilidad (1.6-1.7 en texto de cuerpo)
- **Jerarquía**: Clara diferencia entre niveles

## 📏 Espaciado

### Sistema de Espaciado (Escala 8px)
Basado en múltiplos de 8px para consistencia visual.

| Nombre | Valor | Pixels | Uso |
|--------|-------|--------|-----|
| xs | 0.5rem | 8px | Espaciado mínimo |
| sm | 1rem | 16px | Espaciado pequeño |
| md | 1.5rem | 24px | Espaciado medio |
| lg | 2rem | 32px | Espaciado grande |
| xl | 3rem | 48px | Espaciado extra grande |
| 2xl | 4rem | 64px | Espaciado sección |
| 3xl | 5rem | 80px | Espaciado sección grande |
| 4xl | 6rem | 96px | Espaciado hero |
| 5xl | 8rem | 128px | Espaciado hero grande |
| 6xl | 10rem | 160px | Espaciado máximo |
| 7xl | 12rem | 192px | Espaciado hero máximo |

### Espaciado de Secciones
- **Sección estándar**: `py-20 md:py-30 lg:py-42` (80px / 120px / 168px)
- **Sección pequeña**: `py-12 md:py-18 lg:py-26` (48px / 72px / 104px)

## 🎭 Efectos Visuales

### Glassmorphism
Tres niveles de intensidad:

```css
.glass-subtle    /* Blur suave, opacidad 10% */
.glass           /* Blur medio, opacidad 20% */
.glass-strong    /* Blur fuerte, opacidad 30% */
```

**Uso**: Cards, overlays, elementos flotantes

### Gradientes Animados

#### Gradiente Oceánico Principal
```css
.gradient-animated
```
- Colores: `ocean-light` → `ocean-base` → `ocean-deep`
- Duración: 20s
- Movimiento: Suave y continuo

#### Gradiente Oceánico Suave
```css
.gradient-animated-soft
```
- Colores: `ocean-lighter` → `ocean-light` → `ocean-base`
- Duración: 30s
- Uso: Fondos sutiles

### Fondo Principal
- **Gradiente animado** de 5 colores oceánicos
- **Tamaño**: 400% x 400%
- **Duración**: 30s (muy lento)
- **Opacidad**: 40% (sutil, no distractor)
- **Overlay radial**: Efecto de profundidad con animación `breath`

## ⏱️ Animaciones y Transiciones

### Duración de Transiciones

| Nombre | Duración | Uso |
|--------|----------|-----|
| fast | 300ms | Micro-interacciones |
| normal | 500ms | Transiciones estándar |
| slow | 800ms | Transiciones elegantes |
| slower | 1200ms | Transiciones muy lentas |
| slowest | 2000ms | Transiciones dramáticas |

### Easing Functions

```css
ease-smooth  /* cubic-bezier(0.4, 0, 0.2, 1) - Suave y natural */
ease-soft    /* cubic-bezier(0.25, 0.46, 0.45, 0.94) - Muy suave */
```

### Animaciones Disponibles

| Animación | Duración | Efecto |
|-----------|----------|--------|
| `gradient` | 20s | Gradiente animado |
| `gradient-slow` | 30s | Gradiente muy lento |
| `fade-in` | 1.2s | Fade in suave |
| `fade-in-slow` | 2s | Fade in muy lento |
| `slide-up` | 1s | Deslizar hacia arriba |
| `slide-up-slow` | 1.5s | Deslizar muy lento |
| `float` | 6s | Flotar suavemente |
| `wave` | 8s | Movimiento de ola |
| `breath` | 4s | Respiración (scale + opacity) |

### Utilidades de Transición

```css
.transition-smooth   /* 500ms, ease-smooth */
.transition-slow     /* 800ms, ease-soft */
.transition-slower   /* 1200ms, ease-soft */
```

## 🎯 Utilidades CSS

### Hover Effects
```css
.hover-lift    /* Eleva ligeramente al hover */
.hover-glow    /* Añade sombra con glow oceánico */
```

### Scroll
```css
.scroll-smooth  /* Scroll suave nativo + touch */
```

### Texto con Gradiente
```css
.text-gradient  /* Texto con gradiente oceánico animado */
```

### Animaciones de Entrada
```css
.animate-on-scroll  /* Preparado para animaciones al hacer scroll */
```

## 📐 Layout Base

### Estructura Global
```tsx
<html className="scroll-smooth">
  <body className="antialiased main-container">
    <div className="ocean-background" />
    <div className="ocean-overlay" />
    <div className="relative z-10">
      {children}
    </div>
  </body>
</html>
```

### Z-Index Layers
- **Background**: -1 (fondo animado)
- **Base**: 0 (contenido base)
- **Content**: 10 (contenido principal)
- **Overlay**: 20 (overlays)
- **Modal**: 30 (modales)
- **Tooltip**: 40 (tooltips)

## 🎨 Guía de Uso

### Crear una Sección
```tsx
<section className="section-spacing">
  <div className="container mx-auto px-4">
    {/* Contenido */}
  </div>
</section>
```

### Aplicar Glassmorphism
```tsx
<div className="glass rounded-2xl p-8">
  {/* Contenido con efecto glass */}
</div>
```

### Texto con Gradiente
```tsx
<h1 className="text-gradient font-display text-5xl">
  Título con gradiente
</h1>
```

### Animación de Entrada
```tsx
<div className="animate-on-scroll">
  {/* Se animará al hacer scroll */}
</div>
```

## 🚀 Próximos Pasos

El sistema visual está completamente definido y listo para:
1. Crear secciones con el estilo establecido
2. Implementar animaciones al scroll
3. Añadir componentes con glassmorphism
4. Desarrollar la narrativa visual del sitio


