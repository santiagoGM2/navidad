/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	
	// Optimizaciones de rendimiento
	compiler: {
		// Eliminar console.log en producción
		removeConsole: process.env.NODE_ENV === 'production' ? {
			exclude: ['error', 'warn'],
		} : false,
	},
	
	// Optimizaciones de imágenes
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
	},
	
	// Optimización de bundle
	experimental: {
		optimizePackageImports: ['framer-motion'],
	},
	
	// Headers de seguridad, caché y rendimiento
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on'
					},
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN'
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin'
					},
				],
			},
			{
				source: '/_next/static/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			{
				source: '/images/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		]
	},
}

module.exports = nextConfig


