import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, X, Save, Loader, Upload, Check, AlertCircle } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import userService from '../services/userService';

export default function ProfileSettings({ user, onClose }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' o 'error'
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phoneNumber: '',
    photoFile: null,
    photoPreview: user?.photoURL || null
  });

  // Cargar perfil completo al abrir
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      try {
        const profile = await userService.getUserProfile(user.uid);
        setUserProfile(profile);
        setFormData(prev => ({
          ...prev,
          displayName: user.displayName || '',
          phoneNumber: profile?.phoneNumber || '',
          photoPreview: profile?.photoURL || user?.photoURL
        }));
      } catch (error) {
        console.error('Error loading profile:', error);
        showMessage('Error al cargar perfil', 'error');
      }
    };
    loadProfile();
  }, [user]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  // Manejar selección de foto
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('Foto muy grande (máx 5MB)', 'error');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      showMessage('Debe ser una imagen', 'error');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoPreview: e.target?.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Guardar cambios
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // PASO 1: Actualizar displayName en Firebase Auth (si cambió)
      if (formData.displayName && formData.displayName !== user.displayName) {
        try {
          await updateProfile(user, {
            displayName: formData.displayName
          });
          await user.reload();
          console.log('✅ Firebase Auth displayName updated');
        } catch (error) {
          console.error('Error updating Firebase Auth:', error);
          throw new Error('No se pudo actualizar el nombre en Firebase Auth');
        }
      }

      // PASO 2: Subir foto a Firebase Storage (si seleccionó una)
      let photoURL = userProfile?.photoURL;
      if (formData.photoFile) {
        setUploading(true);
        try {
          const photoRef = ref(storage, `user-photos/${user.uid}/${Date.now()}_${formData.photoFile.name}`);
          await uploadBytes(photoRef, formData.photoFile);
          photoURL = await getDownloadURL(photoRef);
          console.log('✅ Photo uploaded to Firebase Storage');
        } catch (error) {
          console.error('Error uploading photo:', error);
          throw new Error('No se pudo subir la foto');
        } finally {
          setUploading(false);
        }
      }

      // PASO 3: Guardar todo en Firestore (phone + photoURL)
      const updates = {};
      if (formData.phoneNumber !== userProfile?.phoneNumber) {
        updates.phoneNumber = formData.phoneNumber;
      }
      if (photoURL && photoURL !== userProfile?.photoURL) {
        updates.photoURL = photoURL;
      }

      if (Object.keys(updates).length > 0) {
        await userService.updateUserProfile(user.uid, updates);
        console.log('✅ Firestore profile updated');
      }

      showMessage('✅ Perfil guardado correctamente', 'success');
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      showMessage(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
      setUploading(false);
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

        {/* MESSAGE */}
        {message && (
          <div
            className="p-3 rounded-lg mb-4 text-sm flex items-center gap-2"
            style={{
              backgroundColor: messageType === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: messageType === 'success' ? 'var(--success)' : '#ef4444'
            }}
          >
            {messageType === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            {message}
          </div>
        )}

        {/* AVATAR SECTION */}
        <div className="text-center mb-6">
          <div
            className="w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
            style={{ backgroundColor: 'var(--accent-pink)' }}
          >
            {formData.photoPreview ? (
              <img
                src={formData.photoPreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
                {formData.displayName?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>

          {/* UPLOAD FOTO */}
          <label className="inline-block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
              disabled={uploading || loading}
            />
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
              style={{
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--primary-dark)',
                opacity: uploading || loading ? 0.6 : 1,
                cursor: uploading || loading ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Cambiar Foto
                </>
              )}
            </div>
          </label>

          <p style={{ color: 'var(--text-light)', fontSize: '12px', marginTop: '8px' }}>
            Máx 5MB • JPG, PNG
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* NOMBRE */}
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
              placeholder="Tu nombre"
            />
          </div>

          {/* EMAIL (solo lectura) */}
          <div>
            <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} style={{ color: 'var(--accent-gold)' }} />
              Email
            </label>
            <input
              type="email"
              value={formData.phoneNumber === undefined ? user?.email || '' : user?.email || ''}
              disabled
              className="w-full mt-2 px-4 py-3 rounded-lg border bg-gray-50"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-light)' }}
            />
            <p style={{ color: 'var(--text-light)', fontSize: '11px', marginTop: '6px' }}>
              No puede modificarse aquí
            </p>
          </div>

          {/* TELÉFONO */}
          <div>
            <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} style={{ color: 'var(--success)' }} />
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full mt-2 px-4 py-3 rounded-lg border"
              style={{ borderColor: 'var(--border-light)' }}
              placeholder="+1 (829) 977-5918"
            />
          </div>

          {/* BOTONES */}
          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: 'var(--accent-pink)',
                opacity: loading || uploading ? 0.7 : 1,
                cursor: loading || uploading ? 'not-allowed' : 'pointer'
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
                  Guardar Cambios
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading || uploading}
              className="flex-1 py-3 rounded-lg font-semibold transition-all border"
              style={{
                borderColor: 'var(--border-light)',
                color: 'var(--text-dark)',
                opacity: loading || uploading ? 0.7 : 1,
                cursor: loading || uploading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* DEBUG INFO */}
        <div style={{ marginTop: '12px', padding: '8px', backgroundColor: 'var(--bg-light)', borderRadius: '6px' }}>
          <p style={{ fontSize: '10px', color: 'var(--text-light)' }}>
            UID: {user?.uid?.slice(0, 12)}...
          </p>
        </div>
      </div>
    </div>
  );
}
