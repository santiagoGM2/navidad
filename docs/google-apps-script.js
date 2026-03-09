// ============================================================
//  Google Apps Script — Sync "Ahorro Santi & Tefa" → Supabase
//  Copia este archivo completo en:
//  Google Sheets → Extensiones → Apps Script → reemplaza todo
// ============================================================

// CONFIGURACIÓN — reemplaza con tus valores reales
const SUPABASE_URL = "https://TU_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "TU_SERVICE_ROLE_KEY"; // Settings → API → service_role

// Celdas exactas de la hoja "Ahorro Santi & Tefa"
// G6 = META (2000000)
// G7 = AHORRADO (=SUMIF(D19:D98,"✓",C19:C98))
// G8 = RESTANTE (=G6-G7)
// G9 = AVANCE (=IF(G6>0,G7/G6,0)) — valor entre 0 y 1, ej: 0.27
// G10 = DÍAS LISTOS (=COUNTIF(D19:D98,"✓")&" de 80") — texto, ej: "2 de 80"

function syncToSupabase() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("Ahorro Santi & Tefa");
  
  const meta       = sheet.getRange("G6").getValue();  // 2000000
  const ahorrado   = sheet.getRange("G7").getValue();  // número
  const restante   = sheet.getRange("G8").getValue();  // número
  const avanceRaw  = sheet.getRange("G9").getValue();  // 0.27 (decimal)
  const diasTexto  = sheet.getRange("G10").getValue(); // "2 de 80"
  
  // Extrae solo el número de "2 de 80"
  const diasListos = parseInt(diasTexto.toString().split(" ")[0]) || 0;
  const porcentaje = parseFloat((avanceRaw * 100).toFixed(2));

  const payload = JSON.stringify({
    id: 1,
    meta: meta,
    ahorrado: ahorrado,
    restante: restante,
    porcentaje: porcentaje,
    dias_listos: diasListos,
    updated_at: new Date().toISOString()
  });

  UrlFetchApp.fetch(
    SUPABASE_URL + "/rest/v1/ahorro_progress?id=eq.1",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Prefer": "return=minimal"
      },
      payload: payload
    }
  );
  
  Logger.log("Sync OK — Ahorrado: " + ahorrado + " | Avance: " + porcentaje + "%");
}

// Se dispara automáticamente al editar cualquier celda
function onEdit(e) {
  syncToSupabase();
}

// Para prueba manual: ejecuta esta función desde Apps Script
function testSync() {
  syncToSupabase();
}
