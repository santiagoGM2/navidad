'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
	threshold?: number
	rootMargin?: string
	triggerOnce?: boolean
}

/**
 * Hook para animar elementos cuando entran en el viewport al hacer scroll
 */
export function useScrollAnimation(
	options: UseScrollAnimationOptions = {}
) {
	const {
		threshold = 0.1,
		rootMargin = '0px 0px -100px 0px',
		triggerOnce = false,
	} = options

	const elementRef = useRef<HTMLDivElement>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const element = elementRef.current
		if (!element) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					if (triggerOnce) {
						observer.unobserve(element)
					}
				} else if (!triggerOnce) {
					setIsVisible(false)
				}
			},
			{
				threshold,
				rootMargin,
			}
		)

		observer.observe(element)

		return () => {
			observer.disconnect()
		}
	}, [threshold, rootMargin, triggerOnce])

	return { elementRef, isVisible }
}

