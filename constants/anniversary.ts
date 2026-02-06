/**
 * Constantes para la experiencia de aniversario (10 meses)
 * Incluye preguntas del juego "¿Quién es más...?" y textos de resultados
 */

export const ANNIVERSARY_UNLOCK_CODE = '0602'

/** Placeholder para la carta emocional — editar en AnniversarySection o aquí */
export const ANNIVERSARY_LETTER = {
	title: 'Para ti, en nuestros 10 meses',
	content: `— Aquí irá tu carta o mensaje emocional. Puedes editarlo en components/AnniversarySection.tsx (ANNIVERSARY_LETTER). —`,
} as const

/** Preguntas del juego "¿Quién es más...?" con etiquetas para resultados */
export interface QuienEsMasQuestion {
	id: number
	text: string
	/** Etiqueta cuando gana Santi (ej. "el más terco") */
	traitSanti: string
	/** Etiqueta cuando gana Tefa (ej. "la más sentimental") */
	traitTefa: string
}

export const QUIEN_ES_MAS_QUESTIONS: QuienEsMasQuestion[] = [
	{ id: 1, text: '¿Quién es más divertido?', traitSanti: 'el más divertido', traitTefa: 'la más divertida' },
	{ id: 2, text: '¿Quién se enoja primero?', traitSanti: 'el que se enoja primero', traitTefa: 'la que se enoja primero' },
	{ id: 3, text: '¿Quién pide más comida?', traitSanti: 'el que pide más comida', traitTefa: 'la que pide más comida' },
	{ id: 4, text: '¿Quién se duerme más rápido?', traitSanti: 'el que se duerme más rápido', traitTefa: 'la que se duerme más rápido' },
	{ id: 5, text: '¿Quién es más detallista?', traitSanti: 'el más detallista', traitTefa: 'la más detallista' },
	{ id: 6, text: '¿Quién dice más "te amo"?', traitSanti: 'el que dice más "te amo"', traitTefa: 'la que dice más "te amo"' },
	{ id: 7, text: '¿Quién toma más fotos?', traitSanti: 'el que toma más fotos', traitTefa: 'la que toma más fotos' },
	{ id: 8, text: '¿Quién gasta más dinero?', traitSanti: 'el que gasta más', traitTefa: 'la que gasta más' },
	{ id: 9, text: '¿Quién es más terco?', traitSanti: 'el más terco', traitTefa: 'la más terca' },
	{ id: 10, text: '¿Quién es más sentimental?', traitSanti: 'el más sentimental', traitTefa: 'la más sentimental' },
	{ id: 11, text: '¿Quién llora más fácil?', traitSanti: 'el que llora más fácil', traitTefa: 'la que llora más fácil' },
	{ id: 12, text: '¿Quién hace más chistes malos?', traitSanti: 'el rey de los chistes malos', traitTefa: 'la reina de los chistes malos' },
	{ id: 13, text: '¿Quién es más impuntual?', traitSanti: 'el más impuntual', traitTefa: 'la más impuntual' },
	{ id: 14, text: '¿Quién es más organizado?', traitSanti: 'el más organizado', traitTefa: 'la más organizada' },
	{ id: 15, text: '¿Quién abraza más fuerte?', traitSanti: 'el que abraza más fuerte', traitTefa: 'la que abraza más fuerte' },
	{ id: 16, text: '¿Quién extraña más rápido?', traitSanti: 'el que extraña más rápido', traitTefa: 'la que extraña más rápido' },
	{ id: 17, text: '¿Quién hace más planes?', traitSanti: 'el planificador', traitTefa: 'la planificadora' },
	{ id: 18, text: '¿Quién es más protector?', traitSanti: 'el más protector', traitTefa: 'la más protectora' },
	{ id: 19, text: '¿Quién se ríe más fuerte?', traitSanti: 'el que se ríe más fuerte', traitTefa: 'la que se ríe más fuerte' },
	{ id: 20, text: '¿Quién es más romántico?', traitSanti: 'el más romántico', traitTefa: 'la más romántica' },
]

/** Mensajes de análisis de pareja (se eligen según resultados) */
export const RELATIONSHIP_TIPS = [
	'Ustedes dos se complementan: donde uno es fuerte, el otro suma. Sigan así. 💕',
	'La clave está en reírse juntos. Y ustedes ya lo hacen. 😊',
	'Cada pareja es un equipo. Ustedes ya saben jugar en equipo. 🏆',
	'Pequeños detalles hacen la diferencia. No dejen de regalarse momentos. 🌸',
	'Diez meses son solo el inicio. Lo mejor viene cuando siguen eligiéndose. ✨',
]
