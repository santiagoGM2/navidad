/**
 * Vibración emocional en momentos clave (móviles).
 * Usar al abrir carta, desbloquear recuerdo, completar quiz, subir foto, etc.
 */
export function triggerVibration(pattern: number | number[] = 100): void {
	if (typeof navigator === 'undefined' || !navigator.vibrate) return
	try {
		navigator.vibrate(pattern)
	} catch {
		// ignore
	}
}
