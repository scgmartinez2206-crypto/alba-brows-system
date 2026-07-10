import React, { useState } from 'react';
import { User, Mail, Phone, X, Save, Loader } from 'lucide-react';

export default function ProfileSettings({ user, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || ''
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {};
      if (formData.displayName && formData.displayName !== user.displayName) {
        updateData.displayName = formData.displayName;
      }
      if (formData.phone !== user.phoneNumber) {
        updateData.phoneNumber = formData.phone;
      }

      if (Object.keys(updateData).length > 0) {
        await user.updateProfile(updateData);
        await user.reload();
      }
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al guardar perfil: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>
            Mi Perfil
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors"
            style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* AVATAR */}
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: 'var(--accent-pink)' }}
          >
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '12px' }}>
            ID de usuario: {user?.uid?.slice(0, 8)}...
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} style={{ color: 'var(--accent-pink)' }} />
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full mt-2 px-4 py-3 rounded-lg border"
              style={{ borderColor: 'var(--border-light)' }}
            />
          </div>

          <div>
            <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} style={{ color: 'var(--accent-gold)' }} />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full mt-2 px-4 py-3 rounded-lg border bg-gray-50"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-light)' }}
            />
            <p style={{ color: 'var(--text-light)', fontSize: '11px', marginTop: '6px' }}>
              El email no puede cambiarse aquí
            </p>
          </div>

          <div>
            <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} style={{ color: 'var(--success)' }} />
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="w-full mt-2 px-4 py-3 rounded-lg border"
              style={{ borderColor: 'var(--border-light)' }}
            />
          </div>

          <div className="pt-4 flex gap-3">
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
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-semibold transition-all border"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
