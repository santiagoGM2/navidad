import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./sections/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				// Paleta de colores inspirada en el mar
				'ocean': {
					'light': '#BAE6FD', // Azul cielo claro (aguamarina suave)
					'lighter': '#E0F2FE', // Azul muy claro
					'base': '#38BDF8', // Azul aguamarina
					'medium': '#0EA5E9', // Azul medio
					'deep': '#0284C7', // Azul profundo
					'deeper': '#0369A1', // Azul muy profundo
					'darkest': '#0C4A6E', // Azul oscuro
				},
				'pearl': {
					'white': '#FAFAFA', // Blanco perla
					'cream': '#F5F5F5', // Crema suave
				},
			},
			fontFamily: {
				// Tipografía principal: elegante y legible
				'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
				// Tipografía secundaria: para títulos y elementos especiales
				'display': ['var(--font-playfair)', 'Georgia', 'serif'],
			},
			fontSize: {
				// Escala tipográfica armoniosa
				'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
				'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
				'base': ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
				'lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '-0.01em' }],
				'xl': ['1.25rem', { lineHeight: '1.7', letterSpacing: '-0.015em' }],
				'2xl': ['1.5rem', { lineHeight: '1.6', letterSpacing: '-0.02em' }],
				'3xl': ['1.875rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
				'4xl': ['2.25rem', { lineHeight: '1.4', letterSpacing: '-0.03em' }],
				'5xl': ['3rem', { lineHeight: '1.3', letterSpacing: '-0.035em' }],
				'6xl': ['3.75rem', { lineHeight: '1.2', letterSpacing: '-0.04em' }],
				'7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.045em' }],
			},
			spacing: {
				// Espaciados consistentes basados en escala 8px
				'18': '4.5rem', // 72px
				'22': '5.5rem', // 88px
				'26': '6.5rem', // 104px
				'30': '7.5rem', // 120px
				'34': '8.5rem', // 136px
				'38': '9.5rem', // 152px
				'42': '10.5rem', // 168px
				'46': '11.5rem', // 184px
				'50': '12.5rem', // 200px
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				// Gradientes del mar
				'ocean-gradient': 'linear-gradient(135deg, #BAE6FD 0%, #38BDF8 50%, #0284C7 100%)',
				'ocean-gradient-soft': 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)',
				'ocean-gradient-deep': 'linear-gradient(180deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)',
			},
			animation: {
				// Animaciones suaves y lentas
				'gradient': 'gradient 20s ease infinite',
				'gradient-slow': 'gradient 30s ease infinite',
				'fade-in': 'fadeIn 1.2s ease-out',
				'fade-in-slow': 'fadeIn 2s ease-out',
				'slide-up': 'slideUp 1s ease-out',
				'slide-up-slow': 'slideUp 1.5s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'wave': 'wave 8s ease-in-out infinite',
				'breath': 'breath 4s ease-in-out infinite',
			},
			keyframes: {
				gradient: {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': '0% 50%',
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': '100% 50%',
					},
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(30px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				wave: {
					'0%, 100%': { transform: 'translateX(0) translateY(0)' },
					'25%': { transform: 'translateX(10px) translateY(-5px)' },
					'50%': { transform: 'translateX(-5px) translateY(-10px)' },
					'75%': { transform: 'translateX(-10px) translateY(-5px)' },
				},
				breath: {
					'0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
					'50%': { transform: 'scale(1.05)', opacity: '1' },
				},
			},
			transitionDuration: {
				'slow': '800ms',
				'slower': '1200ms',
				'slowest': '2000ms',
			},
			transitionTimingFunction: {
				'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'ease-soft': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			},
			backdropBlur: {
				'xs': '2px',
			},
		},
	},
	plugins: [],
}
export default config

