/**
 * Constantes globales del proyecto
 * Centraliza valores que se reutilizan en toda la aplicacion
 */

// Rutas
export const ROUTES = {
	HOME: '/',
	TIMELINE: '/timeline',
	LETTERS: '/letters',
	MOMENTS: '/moments',
	ALBUM: '/album',
} as const

// Navegacion principal
export const NAVIGATION_ITEMS = [
	{
		id: 'timeline',
		title: 'Linea de Tiempo',
		description: 'Nuestro viaje juntos',
		route: '#timeline',
	},
	{
		id: 'letters',
		title: 'Cartas',
		description: 'Palabras del corazon',
		route: '#letters',
	},
	{
		id: 'moments',
		title: 'Momentos',
		description: 'Recuerdos especiales',
		route: '#moments',
	},
	{
		id: 'album',
		title: 'Album',
		description: 'Nuestra historia',
		route: '#album',
	},
] as const

// Breakpoints (alineados con Tailwind)
export const BREAKPOINTS = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	'2xl': 1536,
} as const

// Colores del tema (alineados con tailwind.config.ts)
export const THEME_COLORS = {
	ocean: {
		light: '#BAE6FD',
		lighter: '#E0F2FE',
		base: '#38BDF8',
		medium: '#0EA5E9',
		deep: '#0284C7',
		deeper: '#0369A1',
		darkest: '#0C4A6E',
	},
	pearl: {
		white: '#FAFAFA',
		cream: '#F5F5F5',
	},
} as const

// Tipografia
export const TYPOGRAPHY = {
	fontFamily: {
		sans: ['Inter', 'system-ui', 'sans-serif'],
		display: ['Playfair Display', 'Georgia', 'serif'],
	},
	fontSize: {
		xs: '0.75rem',
		sm: '0.875rem',
		base: '1rem',
		lg: '1.125rem',
		xl: '1.25rem',
		'2xl': '1.5rem',
		'3xl': '1.875rem',
		'4xl': '2.25rem',
		'5xl': '3rem',
		'6xl': '3.75rem',
		'7xl': '4.5rem',
	},
	lineHeight: {
		tight: 1.2,
		snug: 1.3,
		normal: 1.5,
		relaxed: 1.6,
		loose: 1.7,
	},
} as const

// Espaciados (basados en escala 8px)
export const SPACING = {
	xs: '0.5rem', // 8px
	sm: '1rem', // 16px
	md: '1.5rem', // 24px
	lg: '2rem', // 32px
	xl: '3rem', // 48px
	'2xl': '4rem', // 64px
	'3xl': '5rem', // 80px
	'4xl': '6rem', // 96px
	'5xl': '8rem', // 128px
	'6xl': '10rem', // 160px
	'7xl': '12rem', // 192px
} as const

// Animaciones y transiciones
export const ANIMATIONS = {
	duration: {
		fast: '300ms',
		normal: '500ms',
		slow: '800ms',
		slower: '1200ms',
		slowest: '2000ms',
	},
	easing: {
		smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
		soft: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
	},
} as const

// Z-index layers
export const Z_INDEX = {
	background: -1,
	base: 0,
	content: 10,
	overlay: 20,
	modal: 30,
	tooltip: 40,
} as const

// Fecha de inicio del noviazgo (6 de abril de 2025)
export const RELATIONSHIP_START_DATE = '2025-04-06'

// Hitos de la linea de tiempo
export interface TimelineMilestone {
	id: string
	title: string
	description: string
	date: string
	image?: string
	images?: string[] // Para carrusel de múltiples imágenes
	imageAlt?: string
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
	{
		id: 'first-trip',
		title: 'Nuestro primer viaje al Lago Calima',
		description: 'Conversaciones profundas bajo el cielo abierto, risas compartidas y el inicio de una conexión que cambiaría todo. El día que nos acercamos de verdad.',
		date: '2024-10-12',
		image: '/images/lagocalima.jpeg',
		imageAlt: 'Lago Calima',
	},
	{
		id: 'first-halloween',
		title: 'Nuestro primer Halloween',
		description: 'Nuestra primera celebración juntos, disfrazados y sonriendo. Un recuerdo mágico que guardamos en el corazón para siempre.',
		date: '2024-10-31',
		images: ['/images/halloween.jpeg', '/images/halloween2.jpeg'],
		imageAlt: 'Halloween juntos',
	},
	{
		id: 'birthday-love',
		title: 'Cumpleaños de mi princesa hermosa',
		description: 'El día más especial del año. Celebrando a la persona que ilumina mis días y llena mi vida de alegría.',
		date: '2025-03-16',
		image: '/images/cumpleaños.jpeg',
		imageAlt: 'Cumpleaños',
	},
	{
		id: 'relationship-start',
		title: 'Pedida de noviazgo',
		description: 'El momento en que dejamos de ser "algo" para convertirnos en "todo". El comienzo oficial de nuestra historia de amor.',
		date: '2025-04-06',
		image: '/images/noviazgo.jpg',
		imageAlt: 'Pedida de noviazgo',
	},
	{
		id: 'quince-invitation',
		title: 'Invitación a los 15 años',
		description: 'El honor más grande: ser invitado a formar parte de uno de los días más importantes de tu vida. Un privilegio que valoro infinitamente.',
		date: '2025-08-30',
		image: '/images/fiesta 15.jpeg',
		imageAlt: 'Fiesta de 15',
	},
	{
		id: 'special-outing',
		title: 'Nuestra salida especial',
		description: 'Otra aventura más a tu lado. Cada momento contigo es un recuerdo que atesoro, una historia más en nuestro libro.',
		date: '2025-09-20',
		image: '/images/invitacion especial.jpeg',
		imageAlt: 'Salida especial',
	},
] as const

// Cartas
export interface Letter {
	id: string
	title: string
	content: string
	date?: string
}

export const LETTERS: Letter[] = [
	{
		id: 'letter-1',
		title: 'El momento en que me enamoré de ti',
		content: 'Esta es la primera carta. Aqui puedes escribir todo lo que sientes...',
		date: '2025-04-06',
	},
	{
		id: 'letter-2',
		title: 'Por qué sigo eligiéndote',
		content: 'Esta es la segunda carta. Palabras que vienen del alma...',
		date: '2025-05-15',
	},
	{
		id: 'letter-3',
		title: 'Por qué sigo eligiéndote',
		content: 'Esta es la tercera carta. Cada palabra escrita con amor...',
		date: '2025-06-20',
	},
] as const

// Momentos - Snippets emocionales
export interface Moment {
	id: string
	text: string
	delay?: number
}

export const MOMENTS: Moment[] = [
	{
		id: 'moment-1',
		text: 'yo te amo mas, lo acabo de demostrar',
		delay: 0,
	},
	{
		id: 'moment-2',
		text: 'mi princesa hermosa',
		delay: 200,
	},
	{
		id: 'moment-3',
		text: 'recuerda que si tu me amas, yo te amo mas',
		delay: 400,
	},
	{
		id: 'moment-4',
		text: '¿me regalas ese crespo hermoso?',
		delay: 600,
	},
	{
		id: 'moment-5',
		text: '¿me puedo comer ese cachete?',
		delay: 800,
	},
	{
		id: 'moment-6',
		text: 'amor, eres muy cachetona',
		delay: 1000,
	},
] as const

// Album - Imagenes
export interface AlbumImage {
	id: string
	src: string
	alt: string
	thumbnail?: string
}

export const ALBUM_IMAGES: AlbumImage[] = [
	{
		id: 'img-1',
		src: '/images/photo-1.jpg',
		alt: 'Momento especial',
	},
	{
		id: 'img-2',
		src: '/images/photo-2.jpg',
		alt: 'Recuerdo hermoso',
	},
	{
		id: 'img-3',
		src: '/images/photo-3.jpg',
		alt: 'Aventura juntos',
	},
	{
		id: 'img-4',
		src: '/images/photo-4.jpg',
		alt: 'Risa compartida',
	},
	{
		id: 'img-5',
		src: '/images/photo-5.jpg',
		alt: 'Atardecer',
	},
	{
		id: 'img-6',
		src: '/images/photo-6.jpg',
		alt: 'Momentos unicos',
	},
] as const

// Carta Final Secreta
export const SECRET_LETTER_PASSWORD = 'cachetes' // Palabra secreta
export const SECRET_LETTER = {
	title: 'Para Mi Cachetona Hermosa',
	content: `Mi princesa, mi cachetona hermosa:

A veces me pongo a pensar en todo lo que hemos vivido y me cuesta creer que la vida haya sido tan buena conmigo al ponerte en mi camino. Cuando te conocí no imaginé que ibas a convertirte en alguien tan importante para mí, alguien que poco a poco se iba a meter en mis pensamientos, en mis días, en mi corazón… hasta quedarse ahí.

Hemos pasado por momentos bonitos, momentos difíciles, silencios, conversaciones largas, risas que no se olvidan y también aprendizajes que nos han hecho crecer. No todo ha sido perfecto, pero ha sido real, y eso es lo que más valoro de nosotros. Porque incluso en los momentos complicados, nunca dejé de sentir lo mismo por ti.

Contigo aprendí a tener paciencia, a escuchar, a entender, a mejorar. Aprendí que amar no es solo decirlo, sino demostrarlo, cuidarlo y lucharlo. Y aunque a veces nos equivoquemos, siempre he tenido claro que tú vales cada intento, cada esfuerzo y cada palabra dicha desde el corazón.

Me encanta tu forma de ser, tu manera de hablar, tus gestos, tu sonrisa que me desarma y tu mirada que me calma. Hay días en los que todo pesa, pero pensar en ti hace que todo se sienta más ligero. Eres mi tranquilidad, mi alegría y muchas veces mi refugio.

Gracias por quedarte, por creer, por acompañarme, por no rendirte y por enseñarme tanto sin darte cuenta. Gracias por tu amor, por tu ternura y por ser esa persona que hace que quiera ser mejor cada día.

No sé qué nos depare el futuro, pero sí sé algo con certeza: quiero que seas tú. Quiero seguir caminando contigo, seguir construyendo recuerdos, seguir conociendo cada parte hermosa de tu corazón y seguir eligiéndote una y otra vez.

Te amo de una forma sincera, profunda y real. Y mientras esté a tu lado, siempre haré lo posible por cuidarte, respetarte y amarte como mereces.

Recuerda que si tú me amas, yo te amo más.`,
} as const
