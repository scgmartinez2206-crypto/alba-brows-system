# ⚡ Quick Start - Alba Brows System

## 🚀 3 minutos para empezar

### Paso 1: Verificar que todo está en GitHub

```bash
https://github.com/scgmartinez2206-crypto/alba-brows-system
```

✅ Código subido  
✅ Firebase configurado  
✅ Google Sheets integrado  

---

### Paso 2: Ejecutar LOCALMENTE (opcional, para probar)

```bash
# En terminal, desde la carpeta del proyecto:
cd C:\Users\HP\Downloads\alba-brows-system

# Instalar dependencias
npm install

# Ejecutar app
npm start

# Abre: http://localhost:3000
```

---

### Paso 3: Configurar Google Sheets (IMPORTANTE)

#### 3.1 Crear Google Apps Script

1. **Abre tu Google Sheet:**
   ```
   https://docs.google.com/spreadsheets/d/1oXf-RKETOsMJgchOeMnmigvZHvd-E1zNWnv336cCcps
   ```

2. **Crea Script:**
   - **Tools** → **Script editor**
   - Nueva ventana se abre

3. **Copia código:**
   - Abre archivo: `GOOGLE_APPS_SCRIPT.js` (en tu proyecto)
   - Copia TODO el contenido
   - Pégalo en Google Script Editor
   - **Ctrl+S** para guardar

4. **Renombra el proyecto:**
   - Click en **"Untitled project"** (arriba)
   - Escribe: `Alba Brows Sync`
   - Click OK

#### 3.2 Desplegar como Web App

1. **Click en "Deploy"** (arriba a la derecha)
2. **Click "New Deployment"**
3. Configura:
   - **Type:** Web app
   - **Execute as:** Tu email
   - **Who has access:** Anyone
4. **Click "Deploy"**
5. **Copia la URL que aparece**

#### 3.3 Actualizar tu App

1. **Abre archivo:**
   ```
   src/services/googleSheetsService.js
   ```

2. **Encuentra línea 10:**
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent';
   ```

3. **Reemplaza `YOUR_SCRIPT_ID` con el ID de tu URL**
   - Ejemplo:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/AKfycbw1234567890/usercontent';
   ```

4. **Guarda archivo** (Ctrl+S)

---

### Paso 4: Deploy en Netlify

```bash
# Build
npm run build

# Commit cambios
git add .
git commit -m "config: google sheets setup"

# Push a GitHub
git push

# Netlify automáticamente despliega en ~2-3 minutos
```

Verificar deployment:
```
https://app.netlify.com
Selecciona: alba-brows-system
```

---

## ✅ Verificación Final

### En la App:
- [ ] Dashboard carga
- [ ] Ve estado (Capacitación/Prospección)
- [ ] KPIs del día muestran (aunque sean 0)
- [ ] Botón "Sync" funciona

### En Google Sheets:
- [ ] Hojas nuevas se crean automáticamente:
  - `KPIs`
  - `Prospectos`
  - `Seguimientos`
  - `Reportes Diarios`
- [ ] Datos aparecen cuando sincroniza

---

## 🎯 Usando el Sistema

### Dashboard
- **Entrada:** http://localhost:3000 (local) o tu URL Netlify
- **Ver:** Estado actual, KPIs, cronograma
- **Botón:** "Sync" para sincronizar manual

### Checklist Diario
- Elige: Inicio o Cierre de jornada
- Marca tareas completadas
- Se auto-guardan

### Lead Scorer
- Ingresa nombre prospecto
- Selecciona criterios que apliquen
- Sistema calcula automático: Caliente/Tibio/Frío

### Guiones y Objeciones
- Copia respuestas listos
- Personaliza con nombre prospecto
- Paste en WhatsApp/Instagram

### Productos
- Ve 4 paquetes con precios
- Bonos autorizados
- Métodos de pago

---

## 📱 Desde el Celular

1. Abre tu URL de Netlify en navegador
2. Funciona 100% responsive
3. Offline: sigue funcionando, sincroniza cuando conecte

---

## 🔄 Sincronización Automática

✅ **Auto-sync cada 5 minutos**  
✅ **Manual con botón "Sync"**  
✅ **Modo offline:** Datos se guardan local, sincroniza después  
✅ **Google Sheets:** Auto-actualiza cuando sincroniza  

---

## ⚠️ Si algo falla

### "App no carga"
- Verifica: `npm install` fue exitoso
- Reinicia: `npm start`

### "No sincroniza con Google Sheets"
- Verifica URL en `googleSheetsService.js`
- Verifica Google Apps Script esté desplegado
- Recarga la app (F5)

### "Google Sheets ID incorrecto"
- Verifica: `SHEET_ID` en `googleSheetsService.js`
- Debe ser: `1oXf-RKETOsMJgchOeMnmigvZHvd-E1zNWnv336cCcps`

### "Offline mode"
- App funciona sin Internet
- Datos se guardan localmente
- Se sincronizan automático cuando reconecte
- Click "Sync" para manual

---

## 📊 Acceso a Datos

### En Google Sheets:
- Abre tu Sheet
- Ve hojas: KPIs, Prospectos, Seguimientos
- Todos tus datos están ahí
- Puedes descargar como CSV/Excel

### En Firebase:
- Consola: https://console.firebase.google.com
- Proyecto: albabeautysettersystem
- Collection: `kpis`, `prospectos`, `seguimientos`

---

## 🚀 Próximos Pasos (Diseño)

Cuando quieras mejorar la apariencia:
- [ ] Diseño profesional
- [ ] Paleta Alba Brows
- [ ] Animaciones suaves
- [ ] Branding completo

---

## 💡 Tips

1. **Usa en móvil:** Mejor experiencia en celular
2. **Guarda diariamente:** Datos se sincronizan automático
3. **Compartir datos:** Comparte Google Sheets con tu equipo
4. **Backup:** Google Sheets mantiene historial (ver versiones)
5. **Reportes:** Exporta datos desde Google Sheets como PDF/CSV

---

## 📞 Checklist de Setup

- [ ] Código descargado/clonado
- [ ] Google Apps Script creado
- [ ] Google Apps Script desplegado como Web App
- [ ] URL Apps Script copiada
- [ ] URL actualizada en `googleSheetsService.js`
- [ ] `npm install` completado
- [ ] App local funciona (`npm start`)
- [ ] Build completado (`npm run build`)
- [ ] Git push completado
- [ ] Netlify desplegó
- [ ] Google Sheets sincroniza datos
- [ ] Dashboard muestra KPIs

---

## 🎀 ¡LISTO!

Tu sistema Alba Brows está 100% operativo con:

✅ Dashboard profesional  
✅ Sincronización Google Sheets  
✅ Firebase backend  
✅ Modo offline  
✅ Auto-backup  
✅ Escalable a todo tu equipo  

**Ahora solo falta**: Usar el sistema y generar resultados 🔥

---

**¿Necesitas ayuda?** Revisa `GOOGLE_SHEETS_SETUP.md` para detalles completos.

**¡Éxito, Stefany! 💜**
