import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import '@/styles/globals.css'
import Navbar from '@/components/Navbar'

// Optimización: Cargar fuentes con next/font para evitar render blocking
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
	preload: true,
})

const playfairDisplay = Playfair_Display({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-playfair',
	preload: true,
})

export const metadata: Metadata = {
	title: 'Cachetona - Un viaje a traves de nuestra historia',
	description: 'Camina por una playa al atardecer y descubre la historia de nuestro amor',
	keywords: ['amor', 'historia', 'recuerdos', 'playa', 'atardecer'],
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cachetona.vercel.app'),
	openGraph: {
		title: 'Cachetona - Un viaje a traves de nuestra historia',
		description: 'Camina por una playa al atardecer y descubre la historia de nuestro amor',
		type: 'website',
	},
	robots: {
		index: true,
		follow: true,
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="es" className="scroll-smooth">
			<head>
				{/* Preconnect para recursos externos */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
			</head>
			<body className={`${inter.variable} ${playfairDisplay.variable} antialiased overflow-x-hidden`}>
				{/* Navbar floating */}
				<Navbar />

				{/* Main content */}
				{children}
			</body>
		</html>
	)
}
