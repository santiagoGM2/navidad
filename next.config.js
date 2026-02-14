/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		formats: ['image/avif', 'image/webp'],
		// Supabase Storage: add your project hostname if using next/image for storage URLs, e.g.:
		// remotePatterns: [{ protocol: 'https', hostname: 'xxx.supabase.co', pathname: '/storage/v1/object/public/**' }],
	},
}

module.exports = nextConfig


