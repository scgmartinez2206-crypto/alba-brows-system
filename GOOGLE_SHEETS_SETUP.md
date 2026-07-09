# 🔗 Integración Google Sheets - Alba Brows System

**Google Sheet ID:** `1oXf-RKETOsMJgchOeMnmigvZHvd-E1zNWnv336cCcps`

## 📋 Paso a Paso - Configuración Completa

### ✅ PASO 1: Crear Google Apps Script

1. **Abre tu Google Sheet:**
   - https://docs.google.com/spreadsheets/d/1oXf-RKETOsMJgchOeMnmigvZHvd-E1zNWnv336cCcps

2. **Crea el Apps Script:**
   - Click en **Tools** → **Script editor**
   - Se abre una nueva ventana

3. **Copia el código:**
   - Abre archivo: `GOOGLE_APPS_SCRIPT.js` (en la carpeta del proyecto)
   - Copia TODO el contenido
   - Pégalo en el Script Editor
   - Guarda (Ctrl+S)

4. **Dale un nombre al proyecto:**
   - Click en **Untitled project**
   - Renombra a: `Alba Brows Sync`
   - Click OK

### ✅ PASO 2: Desplegar como Web App

1. **Ir a Deploy:**
   - Click en **Deploy** (arriba a la derecha)
   - Click en **New Deployment**

2. **Configurar:**
   - Select type: **Web app**
   - Execute as: Tu email (scgmartinez2206-crypto@gmail.com)
   - Who has access: **Anyone**

3. **Deploy:**
   - Click en **Deploy**
   - Google te pide autorización - acepta
   - Te muestra una URL: `https://script.google.com/macros/d/.../usercontent`

4. **COPIA LA URL:**
   ```
   https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent
   ```

### ✅ PASO 3: Configurar en la App

1. **En tu proyecto, archivo:**
   - `src/services/googleSheetsService.js`

2. **Busca la línea:**
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent';
   ```

3. **Reemplaza `YOUR_SCRIPT_ID` con el ID que copiaste**

4. **Ejemplo completo:**
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/AKfycbw1234567890ABC/usercontent';
   ```

### ✅ PASO 4: Usar en la App

**En cualquier componente:**

```javascript
import { 
  saveKPIsToSheet, 
  loadKPIsFromSheet,
  saveProspectToSheet,
  loadProspectsFromSheet,
  getDashboardSummary 
} from '../services/googleSheetsService';

// Guardar KPIs del día
await saveKPIsToSheet('2026-07-09', {
  contactados: 5,
  conversaciones: 4,
  cualificados: 2,
  agendados: 1
});

// Cargar resumen para Dashboard
const summary = await getDashboardSummary();

// Guardar nuevo prospecto
await saveProspectToSheet({
  nombre: 'María González',
  telefono: '+1 (555) 123-4567',
  email: 'maria@example.com',
  leadType: 'caliente',
  score: 85,
  producto: 'Paquete 2',
  status: 'contacto',
  fechaContacto: '2026-07-09'
});
```

---

## 🔄 Flujo de Sincronización

### Datos HACIA Google Sheets (Write):
```
App React → Firebase/localStorage → Google Apps Script → Google Sheets
```

1. Usuario ingresa datos (KPI, prospecto, etc)
2. Se guardan en **localStorage** (offline-ready)
3. Si está online, se sincronizan a **Google Sheets**
4. Auto-sync cada 5 minutos

### Datos DESDE Google Sheets (Read):
```
Google Sheets → Google Apps Script → App React
```

1. Dashboard solicita datos
2. Google Apps Script lee Google Sheets
3. Retorna datos al Dashboard
4. Se cachean en localStorage

---

## 📊 Estructura de Hojas

### 1. **KPIs**
Registro diario de actividad.

| Fecha | Contactados | Conversaciones | Cualificados | Agendados | Timestamp |
|-------|------------|-----------------|--------------|-----------|-----------|
| 2026-07-09 | 10 | 8 | 5 | 2 | ISO 8601 |

### 2. **Prospectos**
Base de todos los leads.

| ID | Nombre | Teléfono | Email | LeadType | Score | Producto | Status | FechaContacto | ProximoSegui | Notas | MetodoPago | Timestamp |
|----|--------|----------|-------|----------|-------|----------|--------|---------------|-------------|-------|-----------|-----------|

Lead Types: `caliente`, `tibio`, `frio`  
Status: `contacto`, `cualificado`, `agendado`, `cerrado`

### 3. **Seguimientos**
Historial de interacciones.

| ProspectID | Fecha | Tipo | Contenido | Resultado | ProximoSeguimiento | Timestamp |
|-----------|-------|------|-----------|-----------|-------------------|-----------|

Tipo: `llamada`, `mensaje`, `email`, `whatsapp`

### 4. **Reportes Diarios**
Resumen ejecutivo por día.

| Fecha | KPIs | TotalProspectos | ProspectosCalientes | ProspectosAgendados | SeguimientosPorFecha | Timestamp |

---

## 🛠️ Troubleshooting

### ❌ "Acceso denegado"
**Solución:**
- Verifica que Google Apps Script esté desplegado como **Web App**
- "Who has access" debe ser **Anyone**
- Redeploy si es necesario

### ❌ "Script not found"
**Solución:**
- Verifica la URL está correcta en `googleSheetsService.js`
- Copia URL completa de Deploy

### ❌ "No data appears"
**Solución:**
- Verifica hojas existan en Google Sheets
- El script las crea automáticamente si no existen
- Recarga la app

### ❌ "Offline mode"
**Solución:**
- App funciona sin conexión
- Datos se guardan en localStorage
- Se sincronizan automático cuando reconecte
- Botón "Sync" para sincronizar manualmente

---

## 🔒 Seguridad

✅ **Datos encriptados en tránsito (HTTPS)**  
✅ **Google Sheets es propiedad tuya**  
✅ **Apps Script usa tu cuenta Google**  
✅ **No se guardan credenciales en el código**  
✅ **Sync bi-directional seguro**

---

## 📱 Sincronización Automática

La app sincroniza automáticamente:
- **Cada 5 minutos** (si está online)
- **Al abrir el Dashboard**
- **Al guardar datos nuevos**
- **Al reconectar después de offline**

### Desactivar auto-sync (opcional):
```javascript
// En App.jsx, comentar:
// setInterval(loadDashboardData, 5 * 60 * 1000);
```

---

## 📤 Exportar Datos

### Generar PDF del Google Sheets:
```javascript
// En Google Apps Script:
exportToPDF('KPIs')
// Retorna URL del PDF
```

### Generar CSV (desde Google Sheets):
```
File → Download → Comma-separated values (.csv)
```

---

## 🚀 Deploy en Netlify

1. Actualiza `googleSheetsService.js` con URL de Apps Script
2. `npm run build`
3. `git add .`
4. `git commit -m "feat: integración Google Sheets"`
5. `git push`
6. Netlify despliega automáticamente

---

## 💡 Tips

- **Backup automático**: Google Sheets hace backup automático
- **Historial de versiones**: Ver > Version history en Google Sheets
- **Compartir datos**: Comparte el Sheet con tu equipo si lo necesitas
- **Verificar sincronización**: Abre DevTools → Network para ver requests
- **Test**: Ingresa datos en la app y verifica aparezcan en Google Sheets

---

## 📞 Soporte

Si algo falla:
1. Abre DevTools (F12)
2. Ve a Console
3. Busca mensajes de error
4. Verifica URL de Apps Script en `googleSheetsService.js`
5. Redeploy Google Apps Script si es necesario

---

**¡Tu sistema está listo para producción! 🎀**
