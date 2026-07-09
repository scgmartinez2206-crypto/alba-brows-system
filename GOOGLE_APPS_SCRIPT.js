// ========================================
// Google Apps Script para Alba Brows
// Copiar este código a Google Apps Script
// y publicar como Web App
// ========================================

// ID de la hoja de cálculo
const SPREADSHEET_ID = '1oXf-RKETOsMJgchOeMnmigvZHvd-E1zNWnv336cCcps';

/**
 * Punto de entrada para GET
 */
function doGet(e) {
  const sheetName = e.parameter.sheet || 'KPIs';
  const data = readFromSheet(sheetName);

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Punto de entrada para POST
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { action, sheetName, data } = payload;

    if (action === 'write') {
      writeToSheet(sheetName, data);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: 'Data written successfully' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Leer datos de una hoja
 */
function readFromSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet;

  try {
    sheet = ss.getSheetByName(sheetName);
  } catch (e) {
    createSheet(sheetName);
    sheet = ss.getSheetByName(sheetName);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Escribir datos a una hoja
 */
function writeToSheet(sheetName, dataArray) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet;

  try {
    sheet = ss.getSheetByName(sheetName);
  } catch (e) {
    createSheet(sheetName);
    sheet = ss.getSheetByName(sheetName);
  }

  // Si la hoja está vacía, crear headers
  if (sheet.getLastRow() === 0) {
    const headers = Object.keys(dataArray[0]);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  // Agregar datos
  dataArray.forEach(data => {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(header => data[header] || '');
    sheet.appendRow(row);
  });

  // Auto-ajustar columnas
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

/**
 * Crear nueva hoja con estructura básica
 */
function createSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  let headers = [];

  if (sheetName === 'KPIs') {
    headers = ['fecha', 'contactados', 'conversaciones', 'cualificados', 'agendados', 'timestamp'];
  } else if (sheetName === 'Prospectos') {
    headers = ['id', 'nombre', 'telefono', 'email', 'leadType', 'score', 'producto', 'status', 'fechaContacto', 'proximoSegui', 'notas', 'metodoPago', 'timestamp'];
  } else if (sheetName === 'Seguimientos') {
    headers = ['prospectId', 'fecha', 'tipo', 'contenido', 'resultado', 'proximoSeguimiento', 'timestamp'];
  } else if (sheetName === 'Reportes Diarios') {
    headers = ['fecha', 'kpis', 'totalProspectos', 'prospectosCalientes', 'prospectosAgendados', 'seguimientosPorFecha', 'timestamp'];
  }

  const sheet = ss.insertSheet(sheetName);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formatear header
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#1e40af');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');

  return sheet;
}

/**
 * Sincronización automática cada hora
 */
function setupAutoSync() {
  // Crear trigger para ejecutar cada hora
  // Ir a Triggers (Disparadores) y crear uno para esta función
  const sheets = ['KPIs', 'Prospectos', 'Seguimientos'];

  sheets.forEach(sheet => {
    const data = readFromSheet(sheet);
    Logger.log(`✅ ${sheet}: ${data.length} registros`);
  });
}

/**
 * Obtener resumen diario
 */
function getDailySummary(fecha) {
  const kpis = readFromSheet('KPIs');
  const prospectos = readFromSheet('Prospectos');
  const seguimientos = readFromSheet('Seguimientos');

  const kpiDelDia = kpis.find(k => k.fecha === fecha);
  const prospectosDelDia = prospectos.filter(p => p.fechaContacto === fecha);
  const seguimientosDelDia = seguimientos.filter(s => s.fecha === fecha);

  return {
    fecha,
    kpis: kpiDelDia || {},
    totalProspectos: prospectos.length,
    prospectosDelDia: prospectosDelDia.length,
    prospectosCalientes: prospectos.filter(p => p.leadType === 'caliente').length,
    prospectosAgendados: prospectos.filter(p => p.status === 'agendado').length,
    prospectosConvertidos: prospectos.filter(p => p.status === 'cerrado').length,
    seguimientosDelDia: seguimientosDelDia.length,
    timestamp: new Date().toISOString()
  };
}

/**
 * Exportar datos a PDF (opcional)
 */
function exportToPDF(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);

  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=pdf&gid=${sheet.getSheetId()}`;
  Logger.log(`📄 PDF disponible: ${url}`);

  return url;
}

// ========================================
// INSTRUCCIONES DE INSTALACIÓN:
// ========================================
// 1. Ir a Google Sheet: 1oXf-RKETOsMJgchOeMnmigvZHvd-E1zNWnv336cCcps
// 2. Tools > Script Editor
// 3. Copiar este código
// 4. Deploy > New Deployment > Type: Web app
//    Execute as: Tu email
//    Who has access: Anyone
// 5. Copiar URL de deployment
// 6. En alba-brows-system, actualizar:
//    src/services/googleSheetsService.js
//    Línea: const GOOGLE_APPS_SCRIPT_URL = 'PEGAR_URL_AQUI'
// 7. npm run build && deploy
// ========================================
