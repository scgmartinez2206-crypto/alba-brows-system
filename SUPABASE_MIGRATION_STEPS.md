# SUPABASE MIGRATION - STEP BY STEP

## ⚠️ CRÍTICO: Ejecuta esto en Supabase ANTES de tocar el código

---

## PASO 1: Abre Supabase SQL Editor

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Left sidebar → "SQL Editor"
4. Click "+ New Query"

---

## PASO 2: Copia TODO el SQL

Abre el archivo: `supabase_migration.sql`

**Copia TODO el contenido** (desde `-- ALBA BROWS` hasta el final)

---

## PASO 3: Pega en Supabase

1. En Supabase SQL Editor, pega el contenido
2. Click "RUN" (botón azul arriba-derecha)
3. **ESPERA** a que termine (debería decir "✓ Success")

---

## PASO 4: Verifica que funcionó

1. Left sidebar → "Table Editor"
2. Deberías ver 4 tablas:
   - `user_profiles`
   - `leads`
   - `setter_metrics`
   - `call_logs`

3. Click en cada una para ver columnas

---

## PASO 5: Copia tu Supabase URL y API KEY

(Los necesitarás en el código)

1. Left sidebar → "Project Settings"
2. Tab "API"
3. **ANON KEY**: Copia (ya la tienes en .env)
4. **PROJECT URL**: Copia

Verifica que ya estén en `.env`:
```
REACT_APP_SUPABASE_URL=https://bhwlcfujtadwioaqgyef.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...
```

---

## ✅ LISTO

Una vez que las 4 tablas aparezcan en Table Editor, avísame:

> "Supabase tablas creadas ✅"

Entonces voy a actualizar el código (userService.js) para conectar a Supabase en lugar de Firestore.

---

## 🔄 ROLLBACK (si algo falla)

Si necesitas deshacer:

```sql
-- Ejecuta esto en SQL Editor
DROP TABLE IF EXISTS call_logs;
DROP TABLE IF EXISTS setter_metrics;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS user_profiles;
```

Luego ejecuta el migration.sql de nuevo.

---

## ⏭️ SIGUIENTE

Una vez confirmes que las tablas existen, voy a:
1. Actualizar userService.js para usar Supabase
2. Cambiar App.jsx para sincronizar con Supabase
3. Test ProfileSettings (foto, teléfono, persistencia)
