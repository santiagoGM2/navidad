'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LettersPreview() {
    return (
        <section className="py-28 md:py-36 px-6 relative z-10">
            <div className="max-w-2xl mx-auto">
                {/* Título de sección */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-display text-3xl md:text-5xl text-white font-bold mb-4"
                        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                        Cartas del Corazón
                    </h2>
                    <p className="text-white/50 text-base md:text-lg font-light">
                        Palabras guardadas solo para ti
                    </p>
                </motion.div>

                {/* Carta grande animada */}
                <Link href="/cartas">
                    <motion.div
                        className="relative cursor-pointer group"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {/* Sobre flotante */}
                        <motion.div
                            className="relative mx-auto"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            whileHover={{
                                scale: 1.02,
                                y: -15,
                            }}
                        >
                            {/* Brillo exterior */}
                            <motion.div
                                className="absolute -inset-8 rounded-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                                style={{
                                    background: 'radial-gradient(ellipse at center, rgba(244, 114, 182, 0.4) 0%, transparent 70%)',
                                }}
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            />

                            {/* Cuerpo del sobre */}
                            <div className="relative bg-gradient-to-br from-rose-100 via-rose-50 to-amber-50 rounded-2xl p-10 md:p-14 shadow-2xl border border-rose-200/50 overflow-hidden">

                                {/* Solapa del sobre (arriba) */}
                                <div
                                    className="absolute -top-16 left-0 right-0 h-32 overflow-hidden"
                                    style={{
                                        clipPath: 'polygon(0% 100%, 50% 40%, 100% 100%)',
                                    }}
                                >
                                    <motion.div
                                        className="w-full h-full bg-gradient-to-b from-rose-200 to-rose-100 border-t border-l border-r border-rose-300/50"
                                        animate={{
                                            rotateX: [0, -5, 0],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: 'easeInOut'
                                        }}
                                    />
                                </div>

                                {/* Sello de corazón con animación de latido */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                                    <motion.div
                                        className="relative w-16 h-16 md:w-20 md:h-20"
                                        animate={{
                                            scale: [1, 1.1, 1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                            times: [0, 0.1, 0.2, 0.3, 1]
                                        }}
                                    >
                                        {/* Círculo exterior del sello */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg" />
                                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-rose-300 to-rose-500" />

                                        {/* Corazón */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.svg
                                                className="w-8 h-8 md:w-10 md:h-10 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                animate={{
                                                    scale: [1, 1.2, 1, 1.2, 1],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut',
                                                    times: [0, 0.1, 0.2, 0.3, 1]
                                                }}
                                            >
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </motion.svg>
                                        </div>

                                        {/* Anillo pulsante */}
                                        <motion.div
                                            className="absolute -inset-2 rounded-full border-2 border-rose-400/50"
                                            animate={{
                                                scale: [1, 1.4, 1],
                                                opacity: [0.5, 0, 0.5]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: 'easeOut'
                                            }}
                                        />
                                    </motion.div>
                                </div>

                                {/* Contenido del sobre */}
                                <div className="mt-6 text-center relative z-10">
                                    <h3 className="font-display text-2xl md:text-3xl font-semibold text-rose-800 mb-4">
                                        Abre y lee mis cartas
                                    </h3>

                                    <p className="text-rose-600/80 mb-8 leading-relaxed max-w-md mx-auto">
                                        Tengo guardadas palabras especiales solo para ti.
                                        <br />
                                        <span className="text-sm opacity-70 mt-2 block">
                                            Haz clic para descubrirlas
                                        </span>
                                    </p>

                                    {/* Botón de acción */}
                                    <motion.div
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl font-medium shadow-lg group-hover:shadow-xl transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                        </svg>
                                        Ver mis cartas
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </motion.div>
                                </div>

                                {/* Decoraciones de esquinas */}
                                <div className="absolute top-4 right-4 w-12 h-12 opacity-10">
                                    <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
                                        <path
                                            d="M50,10 C60,10 70,15 75,25 C80,35 80,45 75,55 C70,65 60,75 50,85 C40,75 30,65 25,55 C20,45 20,35 25,25 C30,15 40,10 50,10"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>
                                <div className="absolute bottom-4 left-4 w-12 h-12 opacity-10 rotate-180">
                                    <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
                                        <path
                                            d="M50,10 C60,10 70,15 75,25 C80,35 80,45 75,55 C70,65 60,75 50,85 C40,75 30,65 25,55 C20,45 20,35 25,25 C30,15 40,10 50,10"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </Link>
            </div>
        </section>
    )
}

