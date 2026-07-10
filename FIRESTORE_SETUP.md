# FIRESTORE SETUP - ALBA BROWS SYSTEM

## Estructura de Datos Requerida

Este documento especifica EXACTAMENTE qué colecciones y campos deben existir en Firestore.

---

## COLECCIÓN: `user_profiles`

**Propósito:** Datos personalizados del usuario (phone, foto, etc.)  
**Relación:** 1:1 con Firebase Auth user (uid)

```javascript
{
  uid: "string" (PK - del Firebase Auth user),
  displayName: "string" (sync con Firebase Auth),
  email: "string" (informativo, del Firebase Auth),
  phoneNumber: "string" (NO está en Firebase Auth, guardamos aquí),
  photoURL: "string" (URL en Firebase Storage),
  rol: "string" (ej: "setter"),
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean
}
```

**Security Rules:**
```
allow read, write: if request.auth.uid == resource.id;
```

---

## COLECCIÓN: `leads`

**Propósito:** Gestionar leads (clientes potenciales)  
**Estructura:** Leads del setter con estado de calificación

```javascript
{
  id: "string" (auto-generated),
  userId: "string" (uid del setter),
  
  // Información del cliente
  nombre: "string",
  email: "string",
  telefono: "string",
  
  // Flujo Setter: Detectar → Situación → Objetivos → Trabas → Calificar → Agendar
  estado: "string" (enum: "nuevo", "contactado", "calificado", "agendado", "seguimiento"),
  
  // Detalles de calificación
  situacionActual: "string", // ¿Qué situación actual tiene?
  objetivos: "string",       // ¿Qué busca lograr?
  trabasDificultades: "string", // ¿Qué lo frena?
  tiempoImplementacion: "string", // ¿Cuándo?
  presupuesto: "string",     // ¿Presupuesto?
  
  // Calificación (Caliente/Tibio/Frío)
  calificacion: "string" (enum: "caliente", "tibio", "frio"),
  puntajeCalificacion: number (0-100),
  razonCalificacion: "string",
  
  // Agendamiento
  llamadaAgendada: boolean,
  fechaLlamada: timestamp,
  linkZoom: "string",
  
  // Seguimiento
  ultimoContacto: timestamp,
  proximoSeguimiento: timestamp,
  notasFollowUp: "string",
  
  // Metadata
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: "string" (uid del setter)
}
```

**Security Rules:**
```
allow read, write: if request.auth.uid == resource.data.userId;
```

---

## COLECCIÓN: `setter_metrics`

**Propósito:** Métricas y KPIs del setter (se sincroniza con Google Sheets)  
**Estructura:** Resumen diario/mensual de actividad

```javascript
{
  id: "string" (auto-generated),
  userId: "string" (uid del setter),
  fecha: date,
  
  // Contadores
  leadsContactados: number,
  conversaciones: number,
  leadsCalificados: number,
  leadsAgendados: number,
  llamasRealizadas: number,
  
  // Calificaciones
  leadsCalientisFrio: {
    calientes: number,
    tibios: number,
    frios: number
  },
  
  // KPIs
  tasaConversionContacto: number, // %
  tasaConversionCalificacion: number, // %
  tasaConversionAgendamiento: number, // %
  comisionEstimada: number, // $
  
  // Sync con Google Sheets
  googleSheetsSyncedAt: timestamp,
  syncStatus: "string" (enum: "pending", "synced", "failed"),
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Security Rules:**
```
allow read, write: if request.auth.uid == resource.data.userId;
```

---

## COLECCIÓN: `call_logs`

**Propósito:** Registro de llamadas agendadas (auditoría y seguimiento)

```javascript
{
  id: "string" (auto-generated),
  leadId: "string", // referencia a lead
  userId: "string", // setter
  
  fechaAgendada: timestamp,
  fechaRealizada: timestamp,
  duracion: number, // segundos
  
  resultado: "string" (enum: "realizada", "no_realizada", "cancelada", "reagendada"),
  notas: "string",
  proximoSeguimiento: timestamp,
  
  createdAt: timestamp
}
```

---

## CÓMO CREAR ESTO EN FIRESTORE CONSOLE:

1. **Firebase Console** → Firestore Database
2. **Create Collection** → Crear cada una arriba
3. **Document ID** → Use UUID o auto (Field: uid)
4. **Add Field** → Agregar los campos descriptos

---

## VALIDACIÓN:

✅ User profiles: Datos del usuario (phone, foto)  
✅ Leads: Gestión de clientes potenciales  
✅ Metrics: KPIs y seguimiento  
✅ Call logs: Auditoría de llamadas  

**TOTAL: 4 colecciones + Security Rules**

Este es el FOUNDATION. Sin esto, ProfileSettings y setter flow no funcionan.
