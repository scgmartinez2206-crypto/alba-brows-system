import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Calendar, X } from 'lucide-react';
import taskService from '../services/taskService';

export default function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const statuses = [
    { id: 'urgent', label: 'Urgentes', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.05)' },
    { id: 'in_progress', label: 'En Proceso', color: 'var(--accent-gold)', bg: 'rgba(251, 191, 36, 0.05)' },
    { id: 'completed', label: 'Terminadas', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.05)' },
    { id: 'low_priority', label: 'No Urgentes', color: 'var(--text-light)', bg: 'rgba(107, 114, 128, 0.05)' }
  ];

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const userTasks = await taskService.getUserTasks(user.uid);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cargar tareas
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, loadTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setError('');
      await taskService.createTask(user.uid, {
        ...formData,
        status: 'low_priority'
      });
      setFormData({ title: '', description: '', dueDate: '' });
      setShowModal(false);
      await loadTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Error al crear tarea: ' + (err?.message || 'Intenta de nuevo'));
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-light)' }} className="min-h-screen p-6 flex items-center justify-center">
        <p style={{ color: 'var(--text-light)' }}>Cargando tareas...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-light)' }} className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
              Gestor de Tareas
            </h1>
            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
              Organiza tu flujo de trabajo diario
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="py-3 px-6 rounded-lg font-semibold text-white flex items-center gap-2 transition-all hover:shadow-lg"
            style={{ backgroundColor: 'var(--accent-pink)' }}
          >
            <Plus size={20} />
            Nueva Tarea
          </button>
        </div>

        {/* KANBAN BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statuses.map((status) => {
            const statusTasks = getTasksByStatus(status.id);
            return (
              <div key={status.id}>
                {/* COLUMN HEADER */}
                <div className="mb-4 pb-4 border-b-2" style={{ borderColor: status.color }}>
                  <h2 className="font-bold text-lg mb-1" style={{ color: status.color }}>
                    {status.label}
                  </h2>
                  <p style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                    {statusTasks.length} tarea{statusTasks.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* TASKS */}
                <div className="space-y-3">
                  {statusTasks.length === 0 ? (
                    <p
                      style={{
                        backgroundColor: status.bg,
                        color: status.color,
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        textAlign: 'center'
                      }}
                    >
                      Sin tareas
                    </p>
                  ) : (
                    statusTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 rounded-lg border-l-4 transition-all hover:shadow-md"
                        style={{
                          backgroundColor: 'white',
                          borderColor: status.color,
                          borderTop: '1px solid var(--border-light)',
                          borderRight: '1px solid var(--border-light)',
                          borderBottom: '1px solid var(--border-light)'
                        }}
                      >
                        {/* TITLE */}
                        <p className="font-semibold mb-2" style={{ color: 'var(--text-dark)', fontSize: '14px' }}>
                          {task.title}
                        </p>

                        {/* DESCRIPTION */}
                        {task.description && (
                          <p
                            className="text-xs mb-3 line-clamp-2"
                            style={{ color: 'var(--text-light)' }}
                          >
                            {task.description}
                          </p>
                        )}

                        {/* DUE DATE */}
                        {task.dueDate && (
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar size={12} style={{ color: status.color }} />
                            <span style={{ color: 'var(--text-light)', fontSize: '11px' }}>
                              {new Date(task.dueDate).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        )}

                        {/* STATUS BUTTONS */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {status.id !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'completed')}
                              className="text-xs px-2 py-1 rounded transition-all"
                              style={{
                                backgroundColor: 'var(--success)',
                                color: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              Completar
                            </button>
                          )}
                          {status.id !== 'in_progress' && status.id !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'in_progress')}
                              className="text-xs px-2 py-1 rounded transition-all"
                              style={{
                                backgroundColor: 'var(--accent-gold)',
                                color: 'var(--primary-dark)',
                                cursor: 'pointer'
                              }}
                            >
                              En Proceso
                            </button>
                          )}
                          {status.id !== 'urgent' && status.id !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'urgent')}
                              className="text-xs px-2 py-1 rounded transition-all"
                              style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              Urgente
                            </button>
                          )}
                          {status.id !== 'low_priority' && status.id !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'low_priority')}
                              className="text-xs px-2 py-1 rounded transition-all"
                              style={{
                                backgroundColor: 'var(--text-light)',
                                color: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              No Urgente
                            </button>
                          )}
                        </div>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="w-full py-2 flex items-center justify-center gap-2 text-xs rounded transition-all"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>
                Nueva Tarea
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded transition-colors"
                style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)' }}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div
                className="p-3 rounded-lg mb-4 text-sm"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444'
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500' }}>
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título de la tarea"
                  className="w-full mt-2 px-4 py-3 rounded-lg border"
                  style={{ borderColor: 'var(--border-light)' }}
                  required
                />
              </div>

              <div>
                <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500' }}>
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles de la tarea"
                  className="w-full mt-2 px-4 py-3 rounded-lg border"
                  style={{ borderColor: 'var(--border-light)' }}
                  rows="3"
                />
              </div>

              <div>
                <label style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: '500' }}>
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full mt-2 px-4 py-3 rounded-lg border"
                  style={{ borderColor: 'var(--border-light)' }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition-all"
                  style={{ backgroundColor: 'var(--accent-pink)' }}
                >
                  Crear Tarea
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-lg font-semibold transition-all border"
                  style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
