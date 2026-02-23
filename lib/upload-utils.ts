import heic2any from 'heic2any'
import exifr from 'exifr'

const MAX_SIZE = 1200
const QUALITY = 0.85

export interface UploadMetadata {
    isCamera: boolean
    capturedAt: string | null
    location: { lat: number, lng: number } | null
    originalFormat: string
    timezone: string
}

export async function processImageForUpload(file: File, isCamera: boolean, location: { lat: number, lng: number } | null) {
    let workingFile: File | Blob = file
    const metadata: UploadMetadata = {
        isCamera,
        capturedAt: null,
        location: location,
        originalFormat: file.type,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    // 1. HEIC Handling
    const isHEIC = file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic'
    if (isHEIC) {
        try {
            const result = await heic2any({
                blob: file,
                toType: 'image/webp',
                quality: QUALITY
            })
            workingFile = Array.isArray(result) ? result[0] : result
        } catch (err) {
            console.error('HEIC conversion failed', err)
            throw new Error('No se pudo convertir el formato HEIC de iPhone.')
        }
    }

    // 2. EXIF Extraction
    if (!isCamera && workingFile.type.startsWith('image/')) {
        try {
            const exif = await exifr.parse(workingFile, {
                gps: true,
                pick: ['DateTimeOriginal', 'latitude', 'longitude']
            })

            if (exif) {
                if (exif.DateTimeOriginal) metadata.capturedAt = exif.DateTimeOriginal.toISOString()
                if (exif.latitude && exif.longitude) {
                    metadata.location = { lat: exif.latitude, lng: exif.longitude }
                }
            }
        } catch (e) {
            console.warn('Metadata extraction skipped', e)
        }
    }

    // 3. Compression and WebP Normalization
    if (workingFile.type.startsWith('image/')) {
        workingFile = await compressImageToWebP(workingFile)
    }

    return { finalFile: workingFile, metadata }
}

function compressImageToWebP(file: File | Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(url)
            const canvas = document.createElement('canvas')
            let { width, height } = img
            if (width > MAX_SIZE || height > MAX_SIZE) {
                if (width > height) {
                    height = Math.round((height * MAX_SIZE) / width)
                    width = MAX_SIZE
                } else {
                    width = Math.round((width * MAX_SIZE) / height)
                    height = MAX_SIZE
                }
            }
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            if (!ctx) return reject(new Error('Canvas not supported'))
            ctx.drawImage(img, 0, 0, width, height)
            canvas.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error('Compress failed'))),
                'image/webp',
                QUALITY
            )
        }
        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Image load failed'))
        }
        img.src = url
    })
}
