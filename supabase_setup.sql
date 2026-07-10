-- Tabla: user_notes
-- Para guardar notas y contexto del usuario
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: chat_history
-- Para guardar historial de conversaciones con el IA
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL, -- 'user' o 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at);

-- Enable RLS (Row Level Security) si lo necesitas
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Policy: Los usuarios solo ven sus propias notas
CREATE POLICY "Users can view own notes" ON user_notes
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own notes" ON user_notes
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own notes" ON user_notes
  FOR DELETE USING (user_id = auth.uid()::text);

-- Policy: Los usuarios solo ven su propio chat
CREATE POLICY "Users can view own chat" ON chat_history
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own chat" ON chat_history
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);
