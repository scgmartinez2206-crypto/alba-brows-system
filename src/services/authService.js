import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

export const authService = {
  // Registrar nuevo usuario
  register: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await userCredential.user.updateProfile({
        displayName: displayName
      });
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Iniciar sesión
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Escuchar cambios de autenticación
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};

export default authService;
