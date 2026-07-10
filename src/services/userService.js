import { db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

const USERS_COLLECTION = 'user_profiles';

/**
 * USER SERVICE
 * Maneja todo lo relacionado con perfiles de usuario
 * - Crear perfil
 * - Actualizar datos
 * - Obtener datos
 * - Sincronizar con Firebase Auth
 */

export const userService = {
  /**
   * Crear o actualizar perfil de usuario
   * Se ejecuta después de login/registro
   */
  createOrUpdateUserProfile: async (authUser) => {
    if (!authUser?.uid) throw new Error('No auth user provided');

    try {
      const userRef = doc(db, USERS_COLLECTION, authUser.uid);
      const userSnap = await getDoc(userRef);

      const profileData = {
        displayName: authUser.displayName || '',
        email: authUser.email || '',
        photoURL: authUser.photoURL || null,
        rol: 'setter',
        isActive: true,
        updatedAt: serverTimestamp()
      };

      if (!userSnap.exists()) {
        // Crear nuevo perfil
        profileData.createdAt = serverTimestamp();
        profileData.phoneNumber = ''; // Vacío al inicio
        await setDoc(userRef, profileData);
        console.log('✅ User profile created:', authUser.uid);
      } else {
        // Actualizar perfil existente
        await updateDoc(userRef, profileData);
        console.log('✅ User profile updated:', authUser.uid);
      }

      return profileData;
    } catch (error) {
      console.error('❌ Error creating/updating user profile:', error);
      throw error;
    }
  },

  /**
   * Obtener perfil del usuario
   */
  getUserProfile: async (uid) => {
    if (!uid) throw new Error('No uid provided');

    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.warn('⚠️ User profile not found:', uid);
        return null;
      }

      return {
        uid: userSnap.id,
        ...userSnap.data()
      };
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      throw error;
    }
  },

  /**
   * Actualizar datos del perfil (phone, foto URL, etc.)
   * IMPORTANTE: displayName se guarda en Firebase Auth
   * Phone se guarda AQUÍ en Firestore
   */
  updateUserProfile: async (uid, updates) => {
    if (!uid) throw new Error('No uid provided');
    if (!updates || Object.keys(updates).length === 0) {
      console.warn('⚠️ No updates provided');
      return;
    }

    try {
      const userRef = doc(db, USERS_COLLECTION, uid);

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(userRef, updateData);
      console.log('✅ User profile updated:', uid, updates);

      // Retornar datos actualizados
      return await userService.getUserProfile(uid);
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Actualizar teléfono
   * Guardado en Firestore (NO en Firebase Auth)
   */
  updatePhoneNumber: async (uid, phoneNumber) => {
    return userService.updateUserProfile(uid, { phoneNumber });
  },

  /**
   * Actualizar URL de foto
   * Guardado en Firestore
   */
  updatePhotoURL: async (uid, photoURL) => {
    return userService.updateUserProfile(uid, { photoURL });
  },

  /**
   * Obtener perfil completo del usuario actual
   * (Combina Firebase Auth + Firestore)
   */
  getCompleteUserProfile: async (authUser) => {
    if (!authUser?.uid) return null;

    try {
      const firestoreProfile = await userService.getUserProfile(authUser.uid);

      return {
        // De Firebase Auth
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName,
        firebasePhotoURL: authUser.photoURL,

        // De Firestore
        phoneNumber: firestoreProfile?.phoneNumber || '',
        photoURL: firestoreProfile?.photoURL || authUser.photoURL, // Prioriza Firestore
        rol: firestoreProfile?.rol || 'setter',
        isActive: firestoreProfile?.isActive || true,
        createdAt: firestoreProfile?.createdAt,
        updatedAt: firestoreProfile?.updatedAt
      };
    } catch (error) {
      console.error('❌ Error getting complete user profile:', error);
      return null;
    }
  }
};

export default userService;
