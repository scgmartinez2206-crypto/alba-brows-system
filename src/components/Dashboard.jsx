import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { CRONOGRAMA } from '../data/alba-constants';

export default function Dashboard() {
  const [hoy] = useState(new Date());
  const [diasFaltantes, setDiasFaltantes] = useState(0);
  const [kpisDia, setKpisDia] = useState({
    contactados: 0,
    conversaciones: 0,
    cualificados: 0,
    agendados: 0
  });

  useEffect(() => {
    // Calcular días hasta 15 de julio
    const fecha15julio = new Date(2026, 6, 15);
    const hoy = new Date();
    const diferencia = Math.ceil((fecha15julio - hoy) / (1000 * 60 * 60 * 24));
    setDiasFaltantes(diferencia > 0 ? diferencia : 0);

    // Cargar KPIs del localStorage
    const kpis = JSON.parse(localStorage.getItem('kpis')) || {};
    setKpisDia(kpis);
  }, []);

  const estaEnProspectacion = new Date() >= new Date(2026, 6, 15);
  const cronoHoy = CRONOGRAMA.find(d => {
    const fecha = new Date(d.fecha);
    const hoyNorm = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return fecha.toDateString() === hoyNorm.toDateString();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎀 Alba Brows System</h1>
          <p className="text-slate-400">Setter - {hoy.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
              {estaEnProspectacion ? <AlertCircle size={32} className="text-red-400" /> : <Calendar size={32} className="text-blue-400" />}
            </div>
          </div>

          {/* Días para prospectación */}
          <div className="p-6 rounded-lg border-2 border-amber-500 bg-amber-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Días hasta Prospectación</p>
                <h2 className="text-4xl font-bold text-white mt-1">{diasFaltantes}</h2>
              </div>
              <Calendar size={32} className="text-amber-400" />
            </div>
          </div>

          {/* Tarea de hoy */}
          <div className="p-6 rounded-lg border-2 border-green-500 bg-green-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Tarea Hoy</p>
                <h2 className="text-lg font-bold text-white mt-1">{cronoHoy?.titulo || 'Sin cronograma'}</h2>
              </div>
              <CheckCircle size={32} className="text-green-400" />
            </div>
          </div>
        </div>

        {/* KPIs DEL DÍA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Contactados</p>
            <h3 className="text-3xl font-bold text-blue-400 mt-2">{kpisDia.contactados}</h3>
            <p className="text-slate-500 text-xs mt-1">Meta: 10</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Conversaciones</p>
            <h3 className="text-3xl font-bold text-purple-400 mt-2">{kpisDia.conversaciones}</h3>
            <p className="text-slate-500 text-xs mt-1">Meta: 8</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Cualificados</p>
            <h3 className="text-3xl font-bold text-green-400 mt-2">{kpisDia.cualificados}</h3>
            <p className="text-slate-500 text-xs mt-1">Meta: 5</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Agendados</p>
            <h3 className="text-3xl font-bold text-yellow-400 mt-2">{kpisDia.agendados}</h3>
            <p className="text-slate-500 text-xs mt-1">Meta: 2</p>
          </div>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-bold transition">
            ✓ Checklist Inicio
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-bold transition">
            🎯 Lead Scorer
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-bold transition">
            ✓ Checklist Cierre
          </button>
        </div>
      </div>
    </div>
  );
}
