// ========================================
// Google Sheets Integration Service
// ========================================

const SHEET_ID = '1oXf-RKETOsMJgchOeMnmigvZHvd-E1zNWnv336cCcps';
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent';

/**
 * Guardar KPIs del día en Google Sheets
 */
export const saveKPIsToSheet = async (date, kpis) => {
  try {
    const data = {
      fecha: date,
      contactados: kpis.contactados,
      conversaciones: kpis.conversaciones,
      cualificados: kpis.cualificados,
      agendados: kpis.agendados,
      timestamp: new Date().toISOString()
    };

    // Guardar en localStorage primero (offline)
    const historico = JSON.parse(localStorage.getItem('kpis_historico') || '{}');
    historico[date] = data;
    localStorage.setItem('kpis_historico', JSON.stringify(historico));

    // Intentar sincronizar con Google Sheets
    if (navigator.onLine) {
      await syncToGoogleSheets('KPIs', [data]);
    }

    return data;
  } catch (error) {
    console.error('Error saving KPIs:', error);
    throw error;
  }
};

/**
 * Cargar KPIs históricos de Google Sheets
 */
export const loadKPIsFromSheet = async () => {
  try {
    // Primero intentar desde cache local
    const cached = JSON.parse(localStorage.getItem('kpis_historico') || '{}');

    if (navigator.onLine) {
      // Sincronizar con Google Sheets si estamos online
      const sheetData = await syncFromGoogleSheets('KPIs');
      if (sheetData && sheetData.length > 0) {
        // Guardar en cache
        sheetData.forEach(row => {
          cached[row.fecha] = row;
        });
        localStorage.setItem('kpis_historico', JSON.stringify(cached));
      }
    }

    return cached;
  } catch (error) {
    console.error('Error loading KPIs:', error);
    return JSON.parse(localStorage.getItem('kpis_historico') || '{}');
  }
};

/**
 * Guardar Prospectos en Google Sheets
 */
export const saveProspectToSheet = async (prospect) => {
  try {
    const data = {
      id: prospect.id || Date.now(),
      nombre: prospect.nombre,
      telefono: prospect.telefono,
      email: prospect.email || '',
      leadType: prospect.leadType, // caliente/tibio/frio
      score: prospect.score,
      producto: prospect.producto,
      status: prospect.status, // contacto/cualificado/agendado/cerrado
      fechaContacto: prospect.fechaContacto,
      proximoSegui: prospect.proximoSeguimiento,
      notas: prospect.notas || '',
      metodoPago: prospect.metodoPago || '',
      timestamp: new Date().toISOString()
    };

    // Guardar en localStorage
    const prospectos = JSON.parse(localStorage.getItem('prospectos') || '[]');
    const index = prospectos.findIndex(p => p.id === data.id);

    if (index >= 0) {
      prospectos[index] = { ...prospectos[index], ...data };
    } else {
      prospectos.push(data);
    }

    localStorage.setItem('prospectos', JSON.stringify(prospectos));

    // Sincronizar con Google Sheets
    if (navigator.onLine) {
      await syncToGoogleSheets('Prospectos', [data]);
    }

    return data;
  } catch (error) {
    console.error('Error saving prospect:', error);
    throw error;
  }
};

/**
 * Cargar todos los Prospectos
 */
export const loadProspectsFromSheet = async () => {
  try {
    const cached = JSON.parse(localStorage.getItem('prospectos') || '[]');

    if (navigator.onLine) {
      const sheetData = await syncFromGoogleSheets('Prospectos');
      if (sheetData && sheetData.length > 0) {
        localStorage.setItem('prospectos', JSON.stringify(sheetData));
        return sheetData;
      }
    }

    return cached;
  } catch (error) {
    console.error('Error loading prospects:', error);
    return JSON.parse(localStorage.getItem('prospectos') || '[]');
  }
};

/**
 * Guardar Seguimientos en Google Sheets
 */
export const saveFollowUpToSheet = async (followUp) => {
  try {
    const data = {
      prospectId: followUp.prospectId,
      fecha: followUp.fecha,
      tipo: followUp.tipo, // llamada/mensaje/email
      contenido: followUp.contenido,
      resultado: followUp.resultado,
      proximoSeguimiento: followUp.proximoSeguimiento,
      timestamp: new Date().toISOString()
    };

    const followUps = JSON.parse(localStorage.getItem('seguimientos') || '[]');
    followUps.push(data);
    localStorage.setItem('seguimientos', JSON.stringify(followUps));

    if (navigator.onLine) {
      await syncToGoogleSheets('Seguimientos', [data]);
    }

    return data;
  } catch (error) {
    console.error('Error saving follow-up:', error);
    throw error;
  }
};

/**
 * Sincronizar datos HACIA Google Sheets
 */
async function syncToGoogleSheets(sheetName, data) {
  try {
    // Esta función envía datos a Google Apps Script
    // que escribe en Google Sheets

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        action: 'write',
        sheetName: sheetName,
        data: data
      })
    });

    console.log(`✅ Datos sincronizados a Google Sheets: ${sheetName}`);
    return true;
  } catch (error) {
    console.warn('⚠️ No se pudo sincronizar con Google Sheets (pero se guardó localmente):', error);
    return false;
  }
}

/**
 * Sincronizar datos DESDE Google Sheets
 */
async function syncFromGoogleSheets(sheetName) {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();
    console.log(`✅ Datos sincronizados desde Google Sheets: ${sheetName}`);
    return data;
  } catch (error) {
    console.warn('⚠️ No se pudo sincronizar desde Google Sheets:', error);
    return null;
  }
}

/**
 * Exportar reporte diario a Google Sheets
 */
export const exportDailyReport = async (fecha, kpis, prospectos, seguimientos) => {
  try {
    const report = {
      fecha,
      kpis,
      totalProspectos: prospectos.length,
      prospectosCalientes: prospectos.filter(p => p.leadType === 'caliente').length,
      prospectosAgendados: prospectos.filter(p => p.status === 'agendado').length,
      seguimientosPorFecha: seguimientos.filter(s => s.fecha === fecha).length,
      timestamp: new Date().toISOString()
    };

    await syncToGoogleSheets('Reportes Diarios', [report]);
    return report;
  } catch (error) {
    console.error('Error exporting daily report:', error);
    throw error;
  }
};

/**
 * Obtener resumen de Google Sheets para Dashboard
 */
export const getDashboardSummary = async () => {
  try {
    const hoy = new Date().toISOString().split('T')[0];

    // Cargar datos locales
    const kpis = JSON.parse(localStorage.getItem(`kpis_${hoy}`) || '{"contactados":0,"conversaciones":0,"cualificados":0,"agendados":0}');
    const prospectos = JSON.parse(localStorage.getItem('prospectos') || '[]');
    const seguimientos = JSON.parse(localStorage.getItem('seguimientos') || '[]');

    return {
      fecha: hoy,
      kpis,
      totalProspectos: prospectos.length,
      prospectosCalientes: prospectos.filter(p => p.leadType === 'caliente').length,
      prospectosAgendados: prospectos.filter(p => p.status === 'agendado').length,
      prospectosConvertidos: prospectos.filter(p => p.status === 'cerrado').length,
      ultimosSeguimientos: seguimientos.slice(-5)
    };
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    return null;
  }
};

export default {
  saveKPIsToSheet,
  loadKPIsFromSheet,
  saveProspectToSheet,
  loadProspectsFromSheet,
  saveFollowUpToSheet,
  exportDailyReport,
  getDashboardSummary,
  SHEET_ID
};
