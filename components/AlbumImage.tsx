'use client'

import { AlbumImage as AlbumImageType } from '@/constants'
import { useState } from 'react'
import Image from 'next/image'

interface AlbumImageProps {
	image: AlbumImageType
}

export default function AlbumImage({ image }: AlbumImageProps) {
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)

	return (
		<div className="group relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-cyan-400/30 to-blue-600/30 shadow-lg">
			{hasError ? (
				// Placeholder si la imagen no carga
				<div className="w-full h-full flex items-center justify-center">
					<div className="text-cyan-600/50 w-16 h-16">
						<svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="3.2" />
							<path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
						</svg>
					</div>
				</div>
			) : (
				<>
					{isLoading && (
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
						</div>
					)}
					<Image
						src={image.src}
						alt={image.alt}
						fill
						className={`object-cover transition-slower group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-100'
							}`}
						onLoad={() => setIsLoading(false)}
						onError={() => {
							setIsLoading(false)
							setHasError(true)
						}}
						sizes="(max-width: 768px) 50vw, 33vw"
						loading="lazy"
						quality={85}
					/>
					{/* Overlay en hover */}
					<div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-slow flex items-end p-4">
						<p className="text-white font-medium">{image.alt}</p>
					</div>
				</>
			)}
		</div>
	)
}

