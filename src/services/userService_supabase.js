import { supabase } from '../supabase';

/**
 * USER SERVICE - SUPABASE EDITION
 *
 * Maneja todo lo relacionado con perfiles de usuario usando Supabase PostgreSQL
 * - Crear perfil
 * - Actualizar datos
 * - Obtener datos
 * - Sincronizar con Firebase Auth
 *
 * VENTAJAS:
 * ✅ PostgreSQL (queries más poderosas)
 * ✅ Interfaz SQL amigable (Supabase Studio)
 * ✅ Row-level security integrada
 * ✅ Relaciones entre tablas
 */

export const userService = {
  /**
   * Crear o actualizar perfil de usuario
   * Se ejecuta después de login/registro
   */
  createOrUpdateUserProfile: async (authUser) => {
    if (!authUser?.uid) throw new Error('No auth user provided');

    try {
      // Primero: intentar obtener el perfil
      const { data: existingProfile, error: selectError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('uid', authUser.uid)
        .single();

      const profileData = {
        uid: authUser.uid,
        display_name: authUser.displayName || '',
        email: authUser.email || '',
        photo_url: authUser.photoURL || null,
        rol: 'setter',
        is_active: true
      };

      if (selectError || !existingProfile) {
        // Crear nuevo perfil
        const { data, error } = await supabase
          .from('user_profiles')
          .insert([profileData])
          .select()
          .single();

        if (error) throw error;
        console.log('✅ User profile created in Supabase:', authUser.uid);
        return data;
      } else {
        // Actualizar perfil existente
        const { data, error } = await supabase
          .from('user_profiles')
          .update({
            display_name: profileData.display_name,
            email: profileData.email,
            photo_url: profileData.photo_url,
            updated_at: new Date().toISOString()
          })
          .eq('uid', authUser.uid)
          .select()
          .single();

        if (error) throw error;
        console.log('✅ User profile updated in Supabase:', authUser.uid);
        return data;
      }
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
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('uid', uid)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No row found
          console.warn('⚠️ User profile not found:', uid);
          return null;
        }
        throw error;
      }

      return {
        uid: data.uid,
        displayName: data.display_name,
        email: data.email,
        phoneNumber: data.phone_number,
        photoURL: data.photo_url,
        rol: data.rol,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      throw error;
    }
  },

  /**
   * Actualizar datos del perfil (phone, foto URL, etc.)
   */
  updateUserProfile: async (uid, updates) => {
    if (!uid) throw new Error('No uid provided');
    if (!updates || Object.keys(updates).length === 0) {
      console.warn('⚠️ No updates provided');
      return;
    }

    try {
      // Convertir nombres de camelCase a snake_case
      const snakeCaseUpdates = {
        updated_at: new Date().toISOString()
      };

      if (updates.phoneNumber) snakeCaseUpdates.phone_number = updates.phoneNumber;
      if (updates.photoURL) snakeCaseUpdates.photo_url = updates.photoURL;
      if (updates.displayName) snakeCaseUpdates.display_name = updates.displayName;

      const { data, error } = await supabase
        .from('user_profiles')
        .update(snakeCaseUpdates)
        .eq('uid', uid)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ User profile updated in Supabase:', uid, updates);

      // Retornar datos en formato camelCase
      return {
        uid: data.uid,
        displayName: data.display_name,
        email: data.email,
        phoneNumber: data.phone_number,
        photoURL: data.photo_url,
        rol: data.rol,
        isActive: data.is_active
      };
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Actualizar teléfono
   */
  updatePhoneNumber: async (uid, phoneNumber) => {
    return userService.updateUserProfile(uid, { phoneNumber });
  },

  /**
   * Actualizar URL de foto
   */
  updatePhotoURL: async (uid, photoURL) => {
    return userService.updateUserProfile(uid, { photoURL });
  },

  /**
   * Obtener perfil completo del usuario actual
   * (Combina Firebase Auth + Supabase)
   */
  getCompleteUserProfile: async (authUser) => {
    if (!authUser?.uid) return null;

    try {
      const supabaseProfile = await userService.getUserProfile(authUser.uid);

      return {
        // De Firebase Auth
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName,
        firebasePhotoURL: authUser.photoURL,

        // De Supabase
        phoneNumber: supabaseProfile?.phoneNumber || '',
        photoURL: supabaseProfile?.photoURL || authUser.photoURL,
        rol: supabaseProfile?.rol || 'setter',
        isActive: supabaseProfile?.isActive || true,
        createdAt: supabaseProfile?.createdAt,
        updatedAt: supabaseProfile?.updatedAt
      };
    } catch (error) {
      console.error('❌ Error getting complete user profile:', error);
      return null;
    }
  }
};

export default userService;
