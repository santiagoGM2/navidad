import type { Metadata } from 'next'
import '@/styles/globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
	title: 'Cachetona - Un viaje a traves de nuestra historia',
	description: 'Camina por una playa al atardecer y descubre la historia de nuestro amor',
	keywords: ['amor', 'historia', 'recuerdos', 'playa', 'atardecer'],
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="es" className="scroll-smooth">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
			</head>
			<body className="antialiased overflow-x-hidden">
				{/* Navbar floating */}
				<Navbar />

				{/* Main content */}
				{children}
			</body>
		</html>
	)
}
