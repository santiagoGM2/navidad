const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fixDates() {
    console.log('--- Iniciando Corrección de Fechas (Colombia Timezone Fix) ---');

    const { data: recuerdos, error } = await supabase
        .from('collage_recuerdos')
        .select('*');

    if (error) {
        console.error('Error al obtener recuerdos:', error);
        return;
    }

    console.log(`Analizando ${recuerdos.length} recuerdos.`);

    for (const recuerdo of recuerdos) {
        let needsUpdate = false;
        let updates = {};

        // 1. Corregir el bug del "31 de diciembre"
        // Este bug ocurre cuando la fecha es 2025-01-01T00:00:00Z y se convierte a Colombia (-5h)
        const dateObj = new Date(recuerdo.fecha_captura || recuerdo.fecha_subida);
        const dateStr = dateObj.toISOString();

        if (dateStr.includes('12-31T') || (recuerdo.fecha_captura && recuerdo.fecha_captura.startsWith('2025-01-01T00:00:00'))) {
            console.log(`[FIXING] ${recuerdo.id} - Detectada fecha inconsistente: ${recuerdo.fecha_captura}`);
            // Normalizar a una fecha más segura (por ejemplo, forzar 12:00 PM para evitar saltos de día)
            const correctedDate = new Date(dateObj.getTime() + 12 * 60 * 60 * 1000);
            updates.fecha_captura = correctedDate.toISOString();
            needsUpdate = true;
        }

        // 2. Asegurar que hora_captura esté en formato Colombia si falta o está en UTC
        if (!recuerdo.hora_captura || recuerdo.timezone !== 'America/Bogota') {
            const options = { timeZone: 'America/Bogota', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
            updates.hora_captura = new Intl.DateTimeFormat('es-CO', options).format(dateObj);
            updates.timezone = 'America/Bogota';
            needsUpdate = true;
        }

        if (needsUpdate) {
            console.log(`[SAVING] ${recuerdo.id} -> ${updates.fecha_captura || 'same date'} | ${updates.hora_captura}`);
            const { error: updateError } = await supabase
                .from('collage_recuerdos')
                .update(updates)
                .eq('id', recuerdo.id);

            if (updateError) console.error(`Error actualizando ${recuerdo.id}:`, updateError);
        }
    }

    console.log('--- Corrección Finalizada ---');
}

fixDates();
