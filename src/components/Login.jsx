import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import authService from '../services/authService';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerName, setRegisterName] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(email, password, registerName);
      await authService.login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg-light)' }}
    >
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-dark)' }}>
            ALBA
          </h1>
          <p style={{ color: 'var(--accent-gold)' }} className="text-sm font-semibold">
            Setter System
          </p>
          <p style={{ color: 'var(--text-light)' }} className="text-xs mt-3">
            Plataforma operativa profesional
          </p>
        </div>

        {/* CARD */}
        <div
          className="rounded-lg p-8 shadow-sm border"
          style={{
            backgroundColor: 'white',
            borderColor: 'var(--border-light)'
          }}
        >
          {/* TAB SWITCH */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setShowRegister(false)}
              className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
              style={{
                backgroundColor: !showRegister ? 'var(--accent-pink)' : 'var(--bg-light)',
                color: !showRegister ? 'white' : 'var(--text-light)'
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
              style={{
                backgroundColor: showRegister ? 'var(--accent-pink)' : 'var(--bg-light)',
                color: showRegister ? 'white' : 'var(--text-light)'
              }}
            >
              Registrarse
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="p-4 rounded-lg mb-6 flex gap-3"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderLeft: '4px solid #ef4444'
              }}
            >
              <AlertCircle size={20} style={{ color: '#ef4444' }} />
              <p style={{ color: '#7f1d1d', fontSize: '14px' }}>{error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={showRegister ? handleRegister : handleLogin} className="space-y-5">

            {showRegister && (
              <div>
                <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full mt-2 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                  style={{
                    borderColor: 'var(--border-light)',
                    '--tw-ring-color': 'var(--accent-pink)'
                  }}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500' }}>
                Email
              </label>
              <div className="relative mt-2">
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-light)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                  style={{
                    borderColor: 'var(--border-light)',
                    '--tw-ring-color': 'var(--accent-pink)'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500' }}>
                Contraseña
              </label>
              <div className="relative mt-2">
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-light)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                  style={{
                    borderColor: 'var(--border-light)',
                    '--tw-ring-color': 'var(--accent-pink)'
                  }}
                  required
                  minLength="6"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
              style={{
                backgroundColor: 'var(--accent-pink)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                showRegister ? 'Crear Cuenta' : 'Acceder'
              )}
            </button>
          </form>

          {/* DEMO ACCOUNT */}
          <div
            className="mt-6 p-4 rounded-lg text-center"
            style={{
              backgroundColor: 'var(--bg-light)',
              borderTop: '1px solid var(--border-light)'
            }}
          >
            <p style={{ color: 'var(--text-light)', fontSize: '12px', marginBottom: '8px' }}>
              Cuenta de demostración
            </p>
            <p style={{ color: 'var(--text-dark)', fontSize: '13px', fontWeight: '500' }}>
              demo@alba.com / Demo123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
