'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ALBUM_IMAGES } from '@/constants'

export default function AlbumPage() {
	const [selectedImage, setSelectedImage] = useState<string | null>(null)

	return (
		<main className="min-h-screen py-20 px-4">
			<div className="max-w-7xl mx-auto">
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center"
				>
					Álbum
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-16 text-center"
				>
					Nuestra historia en imágenes
				</motion.p>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
					{ALBUM_IMAGES.map((image, index) => (
						<AlbumImageCard
							key={image.id}
							image={image}
							index={index}
							onClick={() => setSelectedImage(image.src)}
						/>
					))}
				</div>
			</div>

			{/* Modal para zoom futuro */}
			{selectedImage && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setSelectedImage(null)}
					className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
				>
					<motion.img
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						src={selectedImage}
						alt="Imagen ampliada"
						className="max-w-full max-h-full rounded-lg"
					/>
				</motion.div>
			)}
		</main>
	)
}

function AlbumImageCard({
	image,
	index,
	onClick,
}: {
	image: typeof ALBUM_IMAGES[number]
	index: number
	onClick: () => void
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
			whileHover={{ y: -10, scale: 1.02 }}
			className="group relative overflow-hidden rounded-2xl aspect-square bg-gradient-animated-soft cursor-pointer"
			onClick={onClick}
		>
			{/* Placeholder por ahora */}
			<div className="w-full h-full flex items-center justify-center">
				<span className="text-6xl opacity-50">📷</span>
			</div>

			{/* Overlay en hover */}
			<motion.div
				initial={{ opacity: 0 }}
				whileHover={{ opacity: 1 }}
				className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-transparent to-transparent flex items-end p-4"
			>
				<p className="text-white font-medium">{image.alt}</p>
			</motion.div>
		</motion.div>
	)
}

