# Convenciones y Reglas del Proyecto

## 📋 Reglas Generales de Código

### Tabulación
- Usar **tabulación consistente** en todo el proyecto
- Preferir tabs para indentación (configurado en el proyecto)

### Código Limpio
- **Legible y semántico**: Nombres descriptivos, funciones claras
- **Priorizar soluciones simples**: Evitar sobre-ingeniería
- **Evitar duplicación**: Reutilizar componentes y funciones
- **Una responsabilidad por componente**: Cada componente debe hacer una cosa bien

### Organización
- Mantener el proyecto alineado con documentación oficial de React, Next.js y Tailwind
- No introducir dependencias sin justificación clara
- Mobile-first desde el inicio

## 🗂️ Estructura de Carpetas

### `app/`
- Archivos del App Router de Next.js
- `layout.tsx`: Layout principal de la aplicación
- `page.tsx`: Páginas de la aplicación

### `components/`
- **Componentes reutilizables** que se usan en múltiples lugares
- Cada componente debe tener una sola responsabilidad
- Organizar por funcionalidad cuando sea necesario
- Ejemplo: `Button.tsx`, `Card.tsx`, `Container.tsx`

### `sections/`
- **Secciones completas** de la página
- Cada sección es un componente que representa una parte del sitio
- Ejemplo: `HeroSection.tsx`, `StorySection.tsx`, `GallerySection.tsx`

### `hooks/`
- **Custom hooks** de React
- Funciones que encapsulan lógica reutilizable con estado
- Ejemplo: `useScroll.ts`, `useAnimation.ts`, `useMediaQuery.ts`

### `utils/`
- **Funciones utilitarias** puras
- Helpers, formatters, validators
- Ejemplo: `formatDate.ts`, `debounce.ts`, `classNames.ts`

### `styles/`
- **Estilos globales**
- `globals.css`: Estilos globales y utilidades de Tailwind

### `constants/`
- **Constantes y configuraciones**
- Valores que se reutilizan en toda la aplicación
- Ejemplo: `routes.ts`, `theme.ts`, `breakpoints.ts`

## 🎨 Estilo UI

### Principios
- **Minimalista estricto**: Nada recargado
- **Mucho espacio en blanco**: Respiración visual
- **Jerarquía visual clara**: Elementos bien organizados
- **Moderno (2024-2025)**: Diseño actual

### Tema
- **Tema general**: El mar
- **Colores base**: Azul aguamarina, blanco, azul profundo
- Ver `tailwind.config.ts` para colores personalizados

### Preparado para
- Gradientes animados (ver `globals.css` para utilidades)
- Blur / glassmorphism (utilidades `.glass` y `.glass-strong`)
- Fondos animados sutiles (animaciones en `tailwind.config.ts`)

## 📝 Convenciones de Nomenclatura

### Componentes
- **PascalCase** para componentes: `HeroSection.tsx`, `Button.tsx`
- Un componente por archivo
- Nombre del archivo debe coincidir con el nombre del componente

### Hooks
- **camelCase** con prefijo `use`: `useScroll.ts`, `useAnimation.ts`

### Utilidades
- **camelCase**: `formatDate.ts`, `debounce.ts`
- Nombres descriptivos y verbos cuando sea apropiado

### Constantes
- **UPPER_SNAKE_CASE** para constantes: `MAX_WIDTH`, `DEFAULT_TIMEOUT`
- **camelCase** para objetos de configuración: `themeColors`, `routes`

## 🔧 TypeScript

- **Strict mode** habilitado
- Tipar todo: props, funciones, variables cuando sea necesario
- Usar interfaces para props de componentes
- Preferir `type` para uniones y tipos más complejos

## 🎯 Ejemplo de Estructura de Componente

```tsx
// components/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode
	variant?: 'primary' | 'secondary'
}

export default function Button({ 
	children, 
	variant = 'primary', 
	className = '',
	...props 
}: ButtonProps) {
	return (
		<button
			className={`transition-smooth ${className}`}
			{...props}
		>
			{children}
		</button>
	)
}
```

## 🚀 Próximos Pasos

1. Implementar secciones del sitio
2. Crear componentes reutilizables según necesidad
3. Añadir animaciones y efectos visuales
4. Implementar contenido emocional


