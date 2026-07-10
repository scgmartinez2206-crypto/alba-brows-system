import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Trash2, FileUp, X, Loader } from 'lucide-react';
import { supabase } from '../supabase';

export default function AIChat({ user, kpis, tasks }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.uid) {
      loadNotes();
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadNotes = async () => {
    if (!user?.uid) return;
    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (!error) setNotes(data || []);
    } catch (err) {
      console.error('Error loading notes:', err);
    }
  };

  const loadChatHistory = async () => {
    if (!user?.uid) return;
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: true });

      if (!error) {
        setMessages(data?.map(m => ({
          role: m.role,
          content: m.content
        })) || []);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  };

  const saveNote = async () => {
    if (!user?.uid || !noteTitle.trim() || !noteContent.trim()) return;

    try {
      const { error } = await supabase
        .from('user_notes')
        .insert({
          user_id: user.uid,
          title: noteTitle,
          content: noteContent,
          created_at: new Date().toISOString()
        });

      if (!error) {
        setNoteTitle('');
        setNoteContent('');
        loadNotes();
      }
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId);

      loadNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Agregar mensaje del usuario
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      // Construir contexto del sistema
      const systemContext = `Eres un asistente IA para Alba Brows, un sistema de gestión para setters de micropigmentación.

CONTEXTO DEL SISTEMA:
- Usuario: ${user?.displayName || 'Setter'}
- KPIs Actuales: ${JSON.stringify(kpis || {})}
- Tareas Pendientes: ${tasks?.length || 0}
- Notas del Usuario: ${notes.map(n => `"${n.title}": ${n.content}`).join('; ')}

Responde de forma concisa, profesional y útil. Proporciona recomendaciones basadas en el contexto del sistema.`;

      // Llamar a Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_CLAUDE_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: systemContext,
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Error en Claude API');
      }

      const data = await response.json();
      const aiMessage = data.content[0].text;

      // Agregar respuesta del IA
      const updatedMessages = [...newMessages, { role: 'assistant', content: aiMessage }];
      setMessages(updatedMessages);

      // Guardar en Supabase
      await supabase.from('chat_history').insert([
        {
          user_id: user.uid,
          role: 'user',
          content: userMessage,
          created_at: new Date().toISOString()
        },
        {
          user_id: user.uid,
          role: 'assistant',
          content: aiMessage,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = 'Error al procesar tu mensaje. Verifica que REACT_APP_CLAUDE_API_KEY esté configurada.';
      setMessages([...newMessages, { role: 'assistant', content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 h-screen md:h-[600px] md:rounded-t-lg shadow-2xl flex flex-col z-40"
      style={{ backgroundColor: 'white', borderTop: '1px solid var(--border-light)' }}>

      {/* HEADER */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-light)', backgroundColor: 'white' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold" style={{ color: 'var(--text-dark)' }}>
            🤖 Asistente IA
          </h3>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="p-2 rounded transition-all"
            style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)' }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* NOTAS PANEL */}
      {showNotes && (
        <div className="p-4 border-b max-h-40 overflow-y-auto" style={{ borderColor: 'var(--border-light)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-dark)' }}>
            📝 Mis Notas
          </p>
          <div className="space-y-2 mb-4">
            {notes.map(note => (
              <div key={note.id} className="p-2 rounded bg-blue-50 text-sm flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-xs" style={{ color: 'var(--accent-pink)' }}>
                    {note.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                    {note.content.substring(0, 50)}...
                  </p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="ml-2 p-1"
                >
                  <X size={14} style={{ color: '#ef4444' }} />
                </button>
              </div>
            ))}
          </div>

          {/* NUEVA NOTA */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Título"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border"
              style={{ borderColor: 'var(--border-light)' }}
            />
            <textarea
              placeholder="Contenido"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border"
              style={{ borderColor: 'var(--border-light)' }}
              rows="2"
            />
            <button
              onClick={saveNote}
              className="w-full py-2 text-xs font-semibold text-white rounded"
              style={{ backgroundColor: 'var(--accent-pink)' }}
            >
              Guardar Nota
            </button>
          </div>
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm mb-2" style={{ color: 'var(--text-light)' }}>
                👋 Hola! Soy tu asistente IA
              </p>
              <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                Pregúntame sobre tus KPIs, tareas o estrategia
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-xs p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: msg.role === 'user' ? 'var(--accent-pink)' : 'var(--bg-light)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-dark)'
                }}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-light)' }}>
              <Loader size={16} className="animate-spin" style={{ color: 'var(--accent-pink)' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Pregunta algo..."
            className="flex-1 px-3 py-2 rounded border text-sm"
            style={{ borderColor: 'var(--border-light)' }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-2 rounded transition-all"
            style={{
              backgroundColor: 'var(--accent-pink)',
              color: 'white',
              opacity: loading || !input.trim() ? 0.5 : 1,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
