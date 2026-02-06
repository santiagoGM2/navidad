/**
 * Constantes para la experiencia de aniversario (10 meses)
 * Preguntas del juego "Quien es mas..." y textos de resultados
 */

export const ANNIVERSARY_LETTER = {
	title: 'Para ti',
	content: `Hoy cumplimos diez meses juntos y quise hacer algo diferente para ti. Algo que no se desgaste con el tiempo, algo que podamos volver a ver cuando queramos recordar todo lo que hemos construido hasta ahora.

Han sido diez meses llenos de momentos que guardo con muchísimo cariño. Momentos simples, conversaciones largas, risas inesperadas, planes que salieron mejor de lo que imaginábamos y otros que simplemente se volvieron especiales por el hecho de vivirlos juntos.

Contigo he aprendido a valorar los detalles pequeños, a tener más paciencia, a escuchar mejor y a querer de una forma más tranquila y más real. Me gusta pensar que hemos ido creciendo poco a poco, con calma, con confianza, con cariño sincero.

No se trata solo del tiempo que llevamos, sino de todo lo que hemos construido en ese tiempo. La forma en la que nos acompañamos, la forma en la que nos entendemos, la forma en la que siempre encontramos cómo volver a reír.

Quise regalarte este espacio porque representa algo que estamos creando juntos. No es solo una página, es una forma de guardar un recuerdo, de dejar marcado este momento, estos diez meses que significan tanto para mí.

Gracias por estar, por tu paciencia, por tu forma de ser, por todo lo que aportas incluso cuando no te das cuenta. Me haces bien, me das tranquilidad, y me gusta imaginar todo lo que todavía nos falta por vivir.

Esto es solo un pequeño detalle comparado con todo lo que significas para mí, pero está hecho con tiempo, con intención y con mucho cariño.

Felices diez meses.`,
} as const

export interface QuienEsMasQuestion {
	id: number
	text: string
	traitSanti: string
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

export const RELATIONSHIP_ANALYSIS = [
	'Ustedes dos se complementan: donde uno es fuerte, el otro suma. Sigan así.',
	'La clave está en reírse juntos. Y ustedes ya lo hacen.',
	'Cada pareja es un equipo. Ustedes ya saben jugar en equipo.',
	'Pequeños detalles hacen la diferencia. No dejen de regalarse momentos.',
	'Diez meses son solo el inicio. Lo mejor viene cuando siguen eligiéndose.',
]
