-- ============================================
-- ALBA BROWS - MIGRATION TO SUPABASE
-- ============================================
-- Ejecutar esto en: Supabase Dashboard > SQL Editor > New Query
-- Copiar TODO y pegar en Supabase

-- ============================================
-- TABLE 1: user_profiles
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  uid TEXT PRIMARY KEY,
  display_name TEXT,
  email TEXT,
  phone_number TEXT,
  photo_url TEXT,
  rol TEXT DEFAULT 'setter',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- ============================================
-- TABLE 2: leads
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(uid) ON DELETE CASCADE,

  -- Lead info
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,

  -- Setter flow: Detectar → Situación → Objetivos → Trabas → Calificar → Agendar
  estado TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'calificado', 'agendado', 'seguimiento')),

  -- Details
  situacion_actual TEXT,
  objetivos TEXT,
  trabas_dificultades TEXT,
  tiempo_implementacion TEXT,
  presupuesto TEXT,

  -- Qualification
  calificacion TEXT CHECK (calificacion IN ('caliente', 'tibio', 'frio')),
  puntaje_calificacion INTEGER CHECK (puntaje_calificacion >= 0 AND puntaje_calificacion <= 100),
  razon_calificacion TEXT,

  -- Call scheduling
  llamada_agendada BOOLEAN DEFAULT false,
  fecha_llamada TIMESTAMP WITH TIME ZONE,
  link_zoom TEXT,

  -- Follow-up
  ultimo_contacto TIMESTAMP WITH TIME ZONE,
  proximo_seguimiento TIMESTAMP WITH TIME ZONE,
  notas_followup TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL REFERENCES user_profiles(uid) ON DELETE CASCADE
);

CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_estado ON leads(estado);
CREATE INDEX idx_leads_calificacion ON leads(calificacion);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- ============================================
-- TABLE 3: setter_metrics
-- ============================================
CREATE TABLE IF NOT EXISTS setter_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(uid) ON DELETE CASCADE,
  fecha DATE DEFAULT CURRENT_DATE,

  -- Counters
  leads_contactados INTEGER DEFAULT 0,
  conversaciones INTEGER DEFAULT 0,
  leads_calificados INTEGER DEFAULT 0,
  leads_agendados INTEGER DEFAULT 0,
  llamadas_realizadas INTEGER DEFAULT 0,

  -- Breakdown by qualification
  leads_calientes INTEGER DEFAULT 0,
  leads_tibios INTEGER DEFAULT 0,
  leads_frios INTEGER DEFAULT 0,

  -- KPIs
  tasa_conversion_contacto NUMERIC(5,2),
  tasa_conversion_calificacion NUMERIC(5,2),
  tasa_conversion_agendamiento NUMERIC(5,2),
  comision_estimada NUMERIC(10,2),

  -- Google Sheets sync
  google_sheets_synced_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_setter_metrics_user_id ON setter_metrics(user_id);
CREATE INDEX idx_setter_metrics_fecha ON setter_metrics(fecha);
CREATE UNIQUE INDEX idx_setter_metrics_user_fecha ON setter_metrics(user_id, fecha);

-- ============================================
-- TABLE 4: call_logs
-- ============================================
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user_profiles(uid) ON DELETE CASCADE,

  fecha_agendada TIMESTAMP WITH TIME ZONE,
  fecha_realizada TIMESTAMP WITH TIME ZONE,
  duracion INTEGER, -- segundos

  resultado TEXT CHECK (resultado IN ('realizada', 'no_realizada', 'cancelada', 'reagendada')),
  notas TEXT,
  proximo_seguimiento TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_call_logs_lead_id ON call_logs(lead_id);
CREATE INDEX idx_call_logs_user_id ON call_logs(user_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE setter_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECURITY POLICIES
-- ============================================

-- user_profiles: Only owner can read/write
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = uid);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = uid);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = uid);

-- leads: Only creator can read/write
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create leads" ON leads
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own leads" ON leads
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own leads" ON leads
  FOR DELETE USING (auth.uid()::text = user_id);

-- setter_metrics: Only owner can read/write
CREATE POLICY "Users can view own metrics" ON setter_metrics
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create metrics" ON setter_metrics
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own metrics" ON setter_metrics
  FOR UPDATE USING (auth.uid()::text = user_id);

-- call_logs: Only owner can read/write
CREATE POLICY "Users can view own call logs" ON call_logs
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create call logs" ON call_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- DONE
-- ============================================
-- Las tablas están creadas en Supabase
-- Próximo: Actualizar userService.js para conectar a Supabase
