# 🚀 SETUP INSTRUCTIONS - ALBA BROWS SYSTEM

## ⚠️ IMPORTANT: FIRESTORE CONFIGURATION REQUIRED

La aplicación **NO funciona completamente sin Firestore setup**. Estos pasos son **OBLIGATORIOS**.

---

## PASO 1: Crear Colecciones en Firestore (5 min)

### Opción A: Manual (Recomendado para entender)

1. **Abre Firebase Console**
   - https://console.firebase.google.com/
   - Selecciona proyecto: `albabeautysettersystem`
   - Ve a: Firestore Database

2. **Crea Colección: `user_profiles`**
   - Click "Create collection"
   - Nombre: `user_profiles`
   - Primer documento ID: `auto`
   - Campos:
     - `displayName`: string
     - `email`: string
     - `phoneNumber`: string
     - `photoURL`: string (puede ser null)
     - `rol`: string (default: "setter")
     - `createdAt`: timestamp
     - `updatedAt`: timestamp
     - `isActive`: boolean

3. **Crea Colección: `leads`**
   - Nombre: `leads`
   - Campos básicos:
     - `userId`: string
     - `nombre`: string
     - `email`: string
     - `telefono`: string
     - `estado`: string
     - `calificacion`: string (caliente/tibio/frio)
     - `createdAt`: timestamp

4. **Crea Colección: `setter_metrics`**
   - Nombre: `setter_metrics`
   - Campos:
     - `userId`: string
     - `fecha`: date
     - `leadsContactados`: number
     - `conversaciones`: number
     - `leadsCalificados`: number
     - `leadsAgendados`: number
     - `comisionEstimada`: number
     - `createdAt`: timestamp

5. **Crea Colección: `call_logs`**
   - Nombre: `call_logs`
   - Campos:
     - `leadId`: string
     - `userId`: string
     - `fechaAgendada`: timestamp
     - `resultado`: string
     - `notas`: string
     - `createdAt`: timestamp

### Opción B: Automática (SQL)
Si Firestore soporta importación, usa el contenido de `FIRESTORE_SETUP.md`

---

## PASO 2: Firestore Security Rules (2 min)

En Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - only owner can read/write
    match /user_profiles/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Leads - only creator can read/write
    match /leads/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Metrics - only owner can read/write
    match /setter_metrics/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Call logs - only owner can read/write
    match /call_logs/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

Click "Publish"

---

## PASO 3: Firebase Storage (Photo Upload)

1. Firebase Console → Storage → Crear bucket
2. Default settings
3. Rules: Permite lectura pública, escritura solo autenticados

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /user-photos/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId && 
                      request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

---

## PASO 4: Configuración Local (.env)

Ya están en `.env`, pero verifica:

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_CLAUDE_API_KEY=sk-ant-... (si usas Chat IA)
```

---

## PASO 5: Test ProfileSettings

1. `npm start`
2. Login con cuenta Firebase válida
3. Click avatar → "Mi Perfil"
4. **Prueba estos actions:**
   - [ ] Cambiar nombre
   - [ ] Cambiar teléfono
   - [ ] Subir foto (JPG/PNG, max 5MB)
   - [ ] Foto aparece como preview
   - [ ] Click "Guardar"
   - [ ] Mensaje "✅ Perfil guardado"
   - [ ] Cerrar modal
   - [ ] Abrir modal nuevamente
   - [ ] **Datos persisten** (nombre, teléfono, foto)
   - [ ] Logout y login
   - [ ] **Datos aún persisten**

---

## ✅ VERIFICACIÓN FINAL

Una vez todo funciona:

1. **En Firebase Console - Firestore**
   - Abre colección `user_profiles`
   - Deberías ver documento con tu UID
   - Campos: displayName, phoneNumber, photoURL, etc.

2. **En Firebase Storage**
   - Si subiste foto, debería estar en `user-photos/{tu-uid}/...`

3. **En App**
   - Tu foto aparece en avatar
   - Tu teléfono se guardó
   - Datos persisten entre sesiones

---

## 🚨 TROUBLESHOOTING

**Error: "iupdateProfile is not a function"**
- ✅ FIXED en commit 357081a
- Si aún ves esto: borra caché y recarga (`Ctrl+Shift+R`)

**Foto no sube**
- Verifica Firebase Storage bucket existe
- Verifica Storage Rules permiten escritura

**Phone no se guarda**
- Verifica `user_profiles` colección existe en Firestore
- Verifica Security Rules están publicadas

**Datos no persisten entre logout/login**
- Verifica Firestore rules permiten lectura/escritura para tu UID
- Verifica user profile se crea automáticamente al login

---

## 📋 PRÓXIMOS PASOS (FASE 2)

Una vez ProfileSettings funciona perfectamente:

1. FASE 2: Setter Flow Completo
   - LeadScorer (calificar leads)
   - Call Scheduling (agendar llamadas)
   - Metrics Sync (Google Sheets)

2. FASE 3: End-to-End Testing
   - Crear lead ficticio
   - Seguir todo el flow
   - Verificar Google Sheets

---

## 📞 COMMIT REFERENCE

- **Commit:** 357081a
- **Changes:** ProfileSettings rewritten, userService added, Firestore structure documented
- **Status:** Awaiting Firestore setup to test

---

**⏭️ PRÓXIMO: Luego de hacer esto, avísame cuando hayas creado las colecciones en Firestore y podremos testear ProfileSettings completamente.**
