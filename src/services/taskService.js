import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const TASKS_COLLECTION = 'tasks';

export const taskService = {
  // Crear tarea
  createTask: async (userId, taskData) => {
    try {
      const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
        userId,
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'low_priority',
        dueDate: taskData.dueDate ? Timestamp.fromDate(new Date(taskData.dueDate)) : null,
        createdAt: Timestamp.now(),
        completedAt: null
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Obtener tareas del usuario
  getUserTasks: async (userId) => {
    try {
      const q = query(
        collection(db, TASKS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
        completedAt: doc.data().completedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  // Actualizar estado de tarea
  updateTaskStatus: async (taskId, status) => {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        status,
        completedAt: status === 'completed' ? Timestamp.now() : null
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Actualizar tarea
  updateTask: async (taskId, taskData) => {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        dueDate: taskData.dueDate ? Timestamp.fromDate(new Date(taskData.dueDate)) : null
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Eliminar tarea
  deleteTask: async (taskId) => {
    try {
      await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

export default taskService;
