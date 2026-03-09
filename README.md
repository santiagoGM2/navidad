# Novia Web Application

This project is a modern, responsive, and highly interactive web application built specifically to celebrate a romantic relationship, encapsulating shared memories, interactive games, and future goals. Crafted with cutting-edge web technologies, the application delivers a premium, seamless user experience characterized by fluid animations and glassmorphism design principles.

## Architecture & Technology Stack

The application leverages a robust set of modern web development tools:

- **Framework**: Next.js 14 (App Router)
- **Library**: React 18
- **Styling**: Tailwind CSS integrated with customized theme extensions
- **Animations**: Framer Motion for sophisticated, physics-based UI transitions
- **Database & Authentication**: Supabase (PostgreSQL, Storage, Auth, Realtime APIs)
- **Language**: TypeScript for strict type-checking and improved scalability

## Core Features

### 1. Dynamic User Interface
- Context-aware UI elements including a responsive navigation bar and interactive global particles.
- A fully integrated dark/space theme named "Constellation", using programmatic SVGs and CSS composites.

### 2. Media Management & Collage
- Real-time media gallery fetching images and videos directly from Supabase Storage.
- Implements optimistic UI updates during uploads for instantaneous user feedback.
- Secure fallback mechanisms and caching strategies to ensure smooth load times.

### 3. Interactive Games Suite
Implemented using React state management and Framer Motion for interactive gameplay:
- **Puzzle de Recuerdos**: Features both traditional sliding and free-placement mechanics for custom images.
- **Ahorcado**: A fully functional Hangman variant with a QWERTY-style animated keyboard.
- **Palabritas de Amor**: A daily Wordle clone featuring romantic vocabulary.
- **Triqui**: A classic Tic-Tac-Toe implementation with win-state detection algorithms.
- **Longdog**: A grid-based puzzle requiring complete space coverage through swipe and keyboard controls.

### 4. Real-time Progress Tracking
- Implements Supabase Realtime functionality combined with external serverless functions (Google Apps Script).
- Automatically synchronizes external Google Sheets data updates to the PostgreSQL database, projecting them into the application via WebSocket subscriptions.

### 5. Shared Goals System
- A robust "Dreams/Plans" CRUD component that utilizes persistent local storage layers to orchestrate shared objectives securely.

### 6. Time-Locked Content
- Advanced chronological gates utilizing standard UNIX timestamp comparisons for surprise content reveals, engineered for both client-side and potential server-side execution.

## Installation & Local Development environment

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm, yarn, pnpm or bun package managers
- Supabase account with active project instance

### Environment Variable Configuration
To execute the application locally, you must provide a properly configured `.env.local` file at the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Setup Instructions

1. Clone the repository and navigate to the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the local development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:3000`.

## Database Schema Highlights

The backend relies on structured PostgreSQL tables:
- `collage_recuerdos`: Stores metadata and references for uploaded media items.
- `ahorro_progress`: Single-row configuration bound to Realtime updates for savings tracking.

Row Level Security (RLS) policies are configured directly in Supabase to secure data mutation operations.

## Deployment Strategy

The project is optimized for deployment on Vercel. Continuous Integration/Continuous Deployment (CI/CD) pipelines inherently support Next.js App Router projects on Vercel, assuring that environment variables align with production environment secrets.

---

*Architected and maintained with precision.*
