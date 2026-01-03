# Cachetona: Un Viaje a Través de Nuestra Historia

![Project Status](https://img.shields.io/badge/status-production-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## 1. Descripción del Proyecto

**Cachetona** es una aplicación web inmersiva e interactiva diseñada como una experiencia digital narrativa. El proyecto combina diseño UI/UX avanzado, animaciones fluidas y una arquitectura moderna para contar una historia lineal y emocional.

El objetivo principal es ofrecer una plataforma única y personalizada que va más allá de un sitio estático tradicional, incorporando elementos de gamificación suave, descubrimiento progresivo de contenido y persistencia de datos para "frases diarias", creando así una experiencia viva que evoluciona con el tiempo.

## 2. Tabla de Contenidos

1. [Descripción del Proyecto](#1-descripción-del-proyecto)
2. [Tecnologías Utilizadas](#3-tecnologías-utilizadas)
3. [Requisitos Previos](#4-requisitos-previos)
4. [Instalación](#5-instalación)
5. [Uso y Ejecución](#6-uso-y-ejecución)
6. [Estructura del Proyecto](#7-estructura-del-proyecto)
7. [Funcionalidades Principales](#8-funcionalidades-principales)
8. [Buenas Prácticas](#9-buenas-prácticas)
9. [Despliegue](#10-despliegue)
10. [Licencia](#11-licencia)

## 3. Tecnologías Utilizadas

El proyecto está construido sobre un stack moderno priorizando el rendimiento, la escalabilidad y la experiencia de desarrollo:

### Core
- **Next.js 14 (App Router):** Framework principal para renderizado híbrido (SSR/CSR) y enrutamiento.
- **React 18:** Biblioteca de UI para construcción de componentes.
- **TypeScript:** Superset de JavaScript para tipado estático y robustez del código.

### Estilos y Animación
- **Tailwind CSS:** Framework de utilidad para diseño responsivo y sistema de diseño unificado.
- **Framer Motion:** Biblioteca de animaciones de producción para gestos y transiciones complejas.
- **CSS Modules:** Para estilos encapsulados específicos cuando es necesario.

### Backend y Datos
- **Supabase:** Base de datos PostgreSQL como servicio para almacenamiento de contenido dinámico (Frases del Día).
- **Next.js API Routes:** Endpoints serverless para lógica de negocio backend.

## 4. Requisitos Previos

Antes de comenzar, asegúrese de tener instalado en su entorno:

- **Node.js:** Versión 18.17.0 o superior.
- **npm:** Gestor de paquetes (generalmente incluido con Node.js).
- **Git:** Para control de versiones.
- **Cuenta en Supabase:** Para la configuración de la base de datos (opcional si se usa solo frontend estático).

## 5. Instalación

Siga estos pasos para configurar el entorno de desarrollo local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/novia-web.git
   cd novia-web
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configuración de Variables de Entorno:**
   Cree un archivo `.env.local` en la raíz del proyecto basándose en `.env.example`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_anonima
   ```

## 6. Uso y Ejecución

### Desarrollo
Para iniciar el servidor de desarrollo con Hot Module Replacement (HMR):
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### Producción (Build Local)
Para simular el entorno de producción:
```bash
npm run build
npm start
```

### Linting
Para verificar la calidad del código:
```bash
npm run lint
```

## 7. Estructura del Proyecto

La arquitectura sigue las convenciones de Next.js App Router:

```
novia-web/
├── app/                    # Rutas y lógica de la aplicación (App Router)
│   ├── api/                # Endpoints de API (Serverless functions)
│   ├── cartas/             # Páginas de contenido específico
│   ├── momentos/           # Galería de momentos
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout raíz con providers
│   └── page.tsx            # Landing page principal
├── components/             # Componentes React reutilizables (Átomos/Moléculas)
│   ├── ui/                 # Componentes base de UI
│   ├── ConstellationBackground.tsx  # Lógica de renderizado de fondo
│   └── Navbar.tsx          # Navegación principal
├── lib/                    # Utilidades y configuración de clientes (Supabase)
├── public/                 # Assets estáticos (imágenes, fuentes)
├── types/                  # Definiciones de tipos TypeScript globales
├── .env.local              # Variables de entorno (no versionado)
├── next.config.js          # Configuración de Next.js
├── tailwind.config.ts      # Configuración de sistema de diseño
└── tsconfig.json           # Configuración de TypeScript
```

## 8. Funcionalidades Principales

1. **Fondo de Constelaciones Interactivo:**
   - Renderizado dinámico de estrellas y constelaciones.
   - Algoritmo de estrellas fugaces con gestión de memoria optimizada.
   - Solución a problemas de hidratación (Hydration Mismatch Fix).

2. **Sistema de "Frase del Día":**
   - Integración con Supabase para obtener contenido diario.
   - **Fallback System:** Mecanismo de redundancia que garantiza contenido visible incluso ante fallos de conexión a base de datos.
   - Lógica de selección basada en el día del año (doy) para rotación consistente.

3. **Línea de Tiempo Inmersiva:**
   - Componente de scroll con animaciones de entrada.
   - Carga diferida (Lazy Loading) para optimización de LCP (Largest Contentful Paint).

4. **Diseño Responsivo Avanzado:**
   - Adaptación fluida desde móviles (Mobile-First) hasta pantallas 4K.
   - Tipografía fluida y espaciado dinámico.

## 9. Buenas Prácticas

El proyecto implementa estándares de ingeniería de software:
- **Componentización Atómica:** Separación clara de responsabilidades en componentes UI.
- **Server vs Client Components:** Uso estratégico de `'use client'` solo donde es necesario para maximizar el rendimiento SSR.
- **Optimización de Assets:** Uso de `next/image` y formatos modernos (WebP/AVIF).
- **Manejo de Errores:** Implementación de fallbacks graciosos (Graceful Degradation) en llamadas a API.
- **Type Safety:** Tipado estricto con TypeScript para prevenir errores en tiempo de ejecución.

## 10. Despliegue

El proyecto está optimizado para despliegue en plataformas Serverless como **Vercel**.

1. Conectar repositorio de GitHub a Vercel.
2. Configurar variables de entorno en el dashboard de Vercel.
3. Despliegue automático con cada push a `main`.

## 11. Licencia

Este proyecto es software propietario y privado. Todos los derechos reservados.

---
**Desarrollado con ❤️ y ☕ por Santiago GM.**
*Ingeniero de Software Fullstack*
