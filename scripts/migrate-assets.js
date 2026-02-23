const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const dotenv = require('dotenv');

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
    console.log('--- Iniciando Migración de Activos a WebP ---');

    const { data: recuerdos, error } = await supabase
        .from('collage_recuerdos')
        .select('*')
        .eq('tipo', 'foto');

    if (error) {
        console.error('Error al obtener recuerdos:', error);
        return;
    }

    console.log(`Encontrados ${recuerdos.length} recuerdos de tipo foto.`);

    for (const recuerdo of recuerdos) {
        // Ignorar si ya es WebP optimizado
        if (recuerdo.formato_final === 'image/webp' && recuerdo.url.endsWith('.webp')) {
            console.log(`[SKIPPED] ${recuerdo.id} ya está optimizado.`);
            continue;
        }

        console.log(`[MIGRATING] ${recuerdo.id} - ${recuerdo.url}`);

        try {
            // 1. Descargar imagen
            const response = await fetch(recuerdo.url);
            if (!response.ok) throw new Error('No se pudo descargar la imagen');
            const buffer = await response.arrayBuffer();

            // 2. Optimizar con sharp
            const optimizedBuffer = await sharp(Buffer.from(buffer))
                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 85 })
                .toBuffer();

            // 3. Subir a Storage
            const newFileName = `optimized_${recuerdo.id}_${Date.now()}.webp`;
            const bucket = recuerdo.file_path ? recuerdo.file_path.split('/')[0] : 'collage';
            const filePath = `optimized/${newFileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, optimizedBuffer, {
                    contentType: 'image/webp',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // 4. Obtener nueva URL pública
            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
            const newUrl = urlData.publicUrl;

            // 5. Actualizar DB
            const { error: updateError } = await supabase
                .from('collage_recuerdos')
                .update({
                    url: newUrl,
                    file_path: `${bucket}/${filePath}`,
                    formato_final: 'image/webp',
                    tamano_optimizado: optimizedBuffer.length,
                    fecha_captura: recuerdo.fecha_captura || recuerdo.fecha_subida // Mantener fecha si ya existía
                })
                .eq('id', recuerdo.id);

            if (updateError) throw updateError;

            console.log(`[SUCCESS] ${recuerdo.id} migrado a WebP.`);

        } catch (err) {
            console.error(`[ERROR] Falló migración para ${recuerdo.id}:`, err.message);
        }
    }

    console.log('--- Migración Finalizada ---');
}

migrate();
