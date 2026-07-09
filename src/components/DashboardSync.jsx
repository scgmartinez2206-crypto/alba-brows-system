import React, { useState, useEffect } from 'react';
import { Cloud, AlertCircle, RefreshCw, Check } from 'lucide-react';
import { getDashboardSummary } from '../services/googleSheetsService';
import { CRONOGRAMA, KPIS_META } from '../data/alba-constants';

export default function DashboardSync() {
  const [hoy, setHoy] = useState(new Date());
  const [diasFaltantes, setDiasFaltantes] = useState(0);
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, syncing, error
  const [summary, setSummary] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calcular días hasta 15 julio
    const fecha15julio = new Date(2026, 6, 15);
    const hoy = new Date();
    const diferencia = Math.ceil((fecha15julio - hoy) / (1000 * 60 * 60 * 24));
    setDiasFaltantes(diferencia > 0 ? diferencia : 0);

    // Cargar datos
    loadDashboardData();

    // Auto-sync cada 5 minutos
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setSyncStatus('syncing');

    try {
      const data = await getDashboardSummary();
      setSummary(data);
      setSyncStatus('synced');
      setLastSync(new Date());

      // Guardar KPIs en localStorage también
      if (data?.kpis) {
        localStorage.setItem(`kpis_${data.fecha}`, JSON.stringify(data.kpis));
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setSyncStatus('error');

      // Usar datos locales en caso de error
      const hoy = new Date().toISOString().split('T')[0];
      const kpisLocal = JSON.parse(localStorage.getItem(`kpis_${hoy}`) || '{"contactados":0,"conversaciones":0,"cualificados":0,"agendados":0}');
      setSummary({
        fecha: hoy,
        kpis: kpisLocal,
        totalProspectos: 0,
        prospectosCalientes: 0,
        prospectosAgendados: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = () => {
    loadDashboardData();
  };

  const estaEnProspectacion = new Date() >= new Date(2026, 6, 15);
  const cronoHoy = CRONOGRAMA.find(d => {
    const fecha = new Date(d.fecha);
    const hoyNorm = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return fecha.toDateString() === hoyNorm.toDateString();
  });

  const kpis = summary?.kpis || { contactados: 0, conversaciones: 0, cualificados: 0, agendados: 0 };

  // Calcular progreso
  const getProgress = (actual, meta) => {
    return meta > 0 ? Math.min((actual / meta) * 100, 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER CON SYNC STATUS */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🎀 Alba Brows System</h1>
            <p className="text-slate-400">Setter - {hoy.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* SYNC INDICATOR */}
          <div className="flex items-center gap-2">
            {syncStatus === 'synced' && (
              <div className="flex items-center gap-2 text-green-400">
                <Check size={20} className="animate-pulse" />
                <span className="text-sm">Sincronizado</span>
              </div>
            )}
            {syncStatus === 'syncing' && (
              <div className="flex items-center gap-2 text-blue-400">
                <RefreshCw size={20} className="animate-spin" />
                <span className="text-sm">Sincronizando...</span>
              </div>
            )}
            {syncStatus === 'error' && (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle size={20} className="animate-pulse" />
                <span className="text-sm">Offline</span>
              </div>
            )}

            {/* BOTÓN SYNC MANUAL */}
            <button
              onClick={handleManualSync}
              disabled={syncStatus === 'syncing'}
              className="ml-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition disabled:opacity-50"
            >
              <Cloud size={20} className="text-blue-400" />
            </button>
          </div>
        </div>

        {/* ESTADO ACTUAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {/* Estado */}
          <div className={`p-6 rounded-lg border-2 ${estaEnProspectacion ? 'bg-red-900 border-red-500' : 'bg-blue-900 border-blue-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Estado Actual</p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {estaEnProspectacion ? '🔥 Prospectación' : '📚 Capacitación'}
                </h2>
              </div>
            </div>
          </div>

          {/* Días para prospectación */}
          <div className="p-6 rounded-lg border-2 border-amber-500 bg-amber-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Días hasta Prospectación</p>
                <h2 className="text-4xl font-bold text-white mt-1">{diasFaltantes}</h2>
              </div>
            </div>
          </div>

          {/* Tarea de hoy */}
          <div className="p-6 rounded-lg border-2 border-green-500 bg-green-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Tarea Hoy</p>
                <h2 className="text-lg font-bold text-white mt-1">{cronoHoy?.titulo || 'Sin cronograma'}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs CON PROGRESO VISUAL */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Contactados', key: 'contactados', color: 'blue', meta: KPIS_META.contactados },
            { label: 'Conversaciones', key: 'conversaciones', color: 'purple', meta: KPIS_META.conversaciones },
            { label: 'Cualificados', key: 'cualificados', color: 'green', meta: KPIS_META.cualificados },
            { label: 'Agendados', key: 'agendados', color: 'yellow', meta: KPIS_META.agendados }
          ].map(({ label, key, color, meta }) => {
            const actual = kpis[key] || 0;
            const progreso = getProgress(actual, meta);
            const colorMap = {
              blue: 'bg-blue-600',
              purple: 'bg-purple-600',
              green: 'bg-green-600',
              yellow: 'bg-yellow-600'
            };

            return (
              <div key={key} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-slate-400 text-sm">{label}</p>
                  <span className="text-xs text-slate-500">{actual}/{meta}</span>
                </div>
                <h3 className={`text-3xl font-bold text-${color}-400 mb-2`}>{actual}</h3>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`${colorMap[color]} h-2 rounded-full transition-all`}
                    style={{ width: `${progreso}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RESUMEN DE PROSPECTOS */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Prospectos</p>
              <h3 className="text-3xl font-bold text-white mt-2">{summary.totalProspectos}</h3>
            </div>

            <div className="bg-red-900/30 rounded-lg p-4 border border-red-500">
              <p className="text-red-300 text-sm">🔥 Calientes</p>
              <h3 className="text-3xl font-bold text-red-400 mt-2">{summary.prospectosCalientes}</h3>
            </div>

            <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-500">
              <p className="text-amber-300 text-sm">⚡ Tibios</p>
              <h3 className="text-3xl font-bold text-amber-400 mt-2">{summary.prospectosAgendados}</h3>
            </div>

            <div className="bg-green-900/30 rounded-lg p-4 border border-green-500">
              <p className="text-green-300 text-sm">✅ Convertidos</p>
              <h3 className="text-3xl font-bold text-green-400 mt-2">{summary.prospectosConvertidos || 0}</h3>
            </div>
          </div>
        )}

        {/* INFO SYNC */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-sm text-slate-400">
          {lastSync ? (
            <p>
              ✅ Última sincronización: {lastSync.toLocaleTimeString('es-ES')}
            </p>
          ) : (
            <p>📡 Esperando primera sincronización...</p>
          )}
          {syncStatus === 'error' && (
            <p className="text-yellow-400 mt-1">
              ⚠️ Trabajando en modo offline - Los datos se sincronizarán cuando se reconecte
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
