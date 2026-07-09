import React, { useState } from 'react';
import { Lock, Bell, Sun, X, Loader } from 'lucide-react';
import { auth } from '../firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export default function AccountSettings({ user, onClose }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('security');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  const [theme, setTheme] = useState('light');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      // Reautenticar usuario
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Cambiar contraseña
      await updatePassword(user, passwordData.newPassword);

      setMessage('Contraseña actualizada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí podrías guardar las configuraciones en Firestore
      localStorage.setItem('userTheme', theme);
      localStorage.setItem('userNotifications', JSON.stringify(notifications));

      setMessage('Configuraciones guardadas');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error al guardar configuraciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 w-full max-w-md my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>
            Configuración
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors"
            style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <button
            onClick={() => setActiveTab('security')}
            className="px-4 py-3 font-semibold text-sm border-b-2 transition-all"
            style={{
              borderColor: activeTab === 'security' ? 'var(--accent-pink)' : 'transparent',
              color: activeTab === 'security' ? 'var(--accent-pink)' : 'var(--text-light)'
            }}
          >
            Seguridad
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className="px-4 py-3 font-semibold text-sm border-b-2 transition-all"
            style={{
              borderColor: activeTab === 'notifications' ? 'var(--accent-pink)' : 'transparent',
              color: activeTab === 'notifications' ? 'var(--accent-pink)' : 'var(--text-light)'
            }}
          >
            Notificaciones
          </button>
          <button
            onClick={() => setActiveTab('tema')}
            className="px-4 py-3 font-semibold text-sm border-b-2 transition-all"
            style={{
              borderColor: activeTab === 'tema' ? 'var(--accent-pink)' : 'transparent',
              color: activeTab === 'tema' ? 'var(--accent-pink)' : 'var(--text-light)'
            }}
          >
            Tema
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className="p-3 rounded-lg mb-4 text-sm"
            style={{
              backgroundColor: message.includes('error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: message.includes('error') ? '#ef4444' : 'var(--success)'
            }}
          >
            {message}
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={16} style={{ color: 'var(--accent-pink)' }} />
                Contraseña Actual
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full mt-2 px-4 py-3 rounded-lg border"
                style={{ borderColor: 'var(--border-light)' }}
                required
              />
            </div>

            <div>
              <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={16} style={{ color: 'var(--accent-gold)' }} />
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full mt-2 px-4 py-3 rounded-lg border"
                style={{ borderColor: 'var(--border-light)' }}
                required
              />
            </div>

            <div>
              <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={16} style={{ color: 'var(--success)' }} />
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full mt-2 px-4 py-3 rounded-lg border"
                style={{ borderColor: 'var(--border-light)' }}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: 'var(--accent-pink)',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? <Loader size={16} className="animate-spin" /> : null}
                Cambiar
              </button>
            </div>
          </form>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleSaveSettings} className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-2">
                  <Bell size={16} style={{ color: 'var(--accent-gold)' }} />
                  <label style={{ color: 'var(--text-dark)', fontWeight: '500', textTransform: 'capitalize' }}>
                    {key === 'email' ? 'Email' : key === 'push' ? 'Notificaciones Push' : 'SMS'}
                  </label>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: 'var(--accent-pink)'
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all mt-4"
              style={{
                backgroundColor: 'var(--accent-pink)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </form>
        )}

        {/* THEME TAB */}
        {activeTab === 'tema' && (
          <form onSubmit={handleSaveSettings} className="space-y-4">
            {[
              { id: 'light', label: 'Claro' },
              { id: 'dark', label: 'Oscuro' },
              { id: 'auto', label: 'Automático' }
            ].map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--border-light)' }}>
                <input
                  type="radio"
                  name="theme"
                  value={t.id}
                  checked={theme === t.id}
                  onChange={(e) => setTheme(e.target.value)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: 'var(--accent-pink)'
                  }}
                />
                <Sun size={16} style={{ color: 'var(--accent-gold)' }} />
                <label style={{ color: 'var(--text-dark)', fontWeight: '500', cursor: 'pointer' }}>
                  {t.label}
                </label>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all mt-4"
              style={{
                backgroundColor: 'var(--accent-pink)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Guardando...' : 'Guardar Tema'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
