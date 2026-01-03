'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { TIMELINE_MILESTONES, TimelineMilestone } from '@/constants'
import Image from 'next/image'

export default function DepthTimeline() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 30,
        damping: 20
    })

    return (
        <section
            ref={containerRef}
            className="relative min-h-[200vh] py-20"
            style={{ perspective: '1000px' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-24 px-4 sticky top-20 z-0"
                style={{ opacity: useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]) }}
            >
                <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                    Nuestra Historia
                </h2>
                <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light">
                    Un camino de momentos que nos trajeron hasta aquí
                </p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto px-4 z-10">
                {/* Línea Central Sutil */}
                <motion.div
                    className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block opacity-30"
                    style={{
                        background: 'linear-gradient(180deg, transparent 0%, #fff 20%, #fff 80%, transparent 100%)'
                    }}
                />

                {TIMELINE_MILESTONES.map((milestone, index) => (
                    <TimelineDepthItem
                        key={milestone.id}
                        milestone={milestone}
                        index={index}
                    />
                ))}
            </div>
        </section>
    )
}

function TimelineDepthItem({ milestone, index }: { milestone: TimelineMilestone, index: number }) {
    const itemRef = useRef<HTMLDivElement>(null)
    const isEven = index % 2 === 0

    const { scrollYProgress } = useScroll({
        target: itemRef,
        offset: ['start end', 'center center', 'end start']
    })

    // Parallax suave y profundidad
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100])
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9])

    const getIcon = (id: string) => {
        return (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                {/* Viaje - Avión/Destino */}
                {id.includes('trip') && <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />}
                {/* Halloween - Calabaza/Luna */}
                {id.includes('halloween') && <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />}
                {/* Cumpleaños - Pastel/Regalo */}
                {id.includes('birthday') && <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 01-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />}
                {/* Noviazgo - Corazón */}
                {id.includes('relationship') && <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                {/* Quinceañera - Corona/Estrella */}
                {id.includes('quince') && <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                {/* Salida - Mapa/Ubicación */}
                {id.includes('outing') && <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />}
                {/* Default - Estrella */}
                {!id.match(/trip|halloween|birthday|relationship|quince|outing/) && <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
            </svg>
        )
    }

    return (
        <motion.div
            ref={itemRef}
            style={{ y, opacity, scale }}
            className={`relative flex items-center mb-40 ${isEven ? 'md:flex-row-reverse' : ''}`}
        >
            <div className={`flex-1 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                <div className={`relative backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-white/20 transition-colors duration-500`}>
                    {/* Header de la tarjeta */}
                    <div className={`flex items-center gap-4 mb-4 ${isEven ? '' : 'md:justify-end'}`}>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            {getIcon(milestone.id)}
                        </div>
                        <span className="text-sm font-semibold tracking-wider text-orange-200/80 uppercase">
                            {new Date(milestone.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    <h3 className={`font-display text-2xl md:text-3xl text-white mb-3 ${isEven ? '' : 'md:text-right'}`}>
                        {milestone.title}
                    </h3>
                    <p className={`text-white/70 leading-relaxed font-light ${isEven ? '' : 'md:text-right'}`}>
                        {milestone.description}
                    </p>

                    {/* Imagen del milestone si existe */}
                    {milestone.image && !milestone.images && (
                        <motion.div
                            className="mt-6 relative overflow-hidden rounded-xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative aspect-[4/3] w-full">
                                <Image
                                    src={milestone.image}
                                    alt={milestone.imageAlt || milestone.title}
                                    fill
                                    className="object-cover rounded-xl border border-white/10 hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    loading="lazy"
                                    quality={85}
                                />
                            </div>
                            {/* Overlay sutil con gradiente */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent rounded-xl pointer-events-none" />
                        </motion.div>
                    )}

                    {/* Carrusel para múltiples imágenes */}
                    {milestone.images && milestone.images.length > 0 && (
                        <ImageCarousel images={milestone.images} alt={milestone.imageAlt || milestone.title} />
                    )}
                </div>
            </div>

            {/* Punto central (Anchor) */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-slate-900 z-10 shadow-[0_0_20px_rgba(255,255,255,0.5)]" />

            {/* Espacio vacío para balancear */}
            <div className="hidden md:block flex-1" />
        </motion.div>
    )
}

// Componente de carrusel de imágenes
function ImageCarousel({ images, alt }: { images: string[], alt: string }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <motion.div
            className="mt-6 relative overflow-hidden rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="relative aspect-[4/3] w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`${alt} - ${currentIndex + 1}`}
                            fill
                            className="object-cover rounded-xl border border-white/10"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading="lazy"
                            quality={85}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent rounded-xl pointer-events-none" />

                {/* Flechas de navegación */}
                <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-300 z-10"
                    aria-label="Imagen anterior"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-300 z-10"
                    aria-label="Siguiente imagen"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Indicadores de puntos */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/50 hover:bg-white/70'
                                }`}
                            aria-label={`Ir a imagen ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
