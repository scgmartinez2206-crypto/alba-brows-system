import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { CRONOGRAMA } from '../data/alba-constants';

export default function Cronograma() {
  const hoy = new Date();
  const hoyNorm = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">📅 Cronograma Oficial (6-15 Julio)</h1>
      <p className="text-slate-400 mb-8">Capacitación + Inicio Prospección</p>

      <div className="space-y-4">
        {CRONOGRAMA.map((dia, index) => {
          const fechaDia = new Date(dia.fecha);
          const esHoy = fechaDia.toDateString() === hoyNorm.toDateString();
          const esPasado = fechaDia < hoyNorm;
          const esProspectacion = dia.tipo === 'prospectacion';

          return (
            <div
              key={index}
              className={`border-l-4 p-6 rounded-lg transition ${
                esProspectacion
                  ? 'border-l-red-500 bg-red-900/30'
                  : 'border-l-blue-500 bg-blue-900/30'
              } ${esHoy ? 'ring-2 ring-yellow-500' : ''} ${
                esPasado ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    {esHoy && <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>}
                    <h2 className="text-2xl font-bold text-white">{dia.titulo}</h2>
                  </div>
                  <p className="text-slate-400 mt-1">{dia.dia} - {dia.fecha}</p>
                </div>
                {esPasado ? (
                  <CheckCircle className="text-green-500" size={32} />
                ) : esHoy ? (
                  <AlertCircle className="text-yellow-500 animate-pulse" size={32} />
                ) : (
                  <Calendar className="text-blue-500" size={32} />
                )}
              </div>

              {dia.reunion && (
                <div className="bg-slate-900 p-3 rounded mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-amber-400" />
                  <p className="text-amber-300 font-semibold">{dia.reunion}</p>
                </div>
              )}

              <div className="bg-slate-900/50 p-4 rounded">
                <p className="text-slate-300 font-semibold mb-2">📋 Tareas del día:</p>
                <ul className="space-y-2">
                  {dia.tareas.map((tarea, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-200">
                      <span className="text-yellow-400">→</span> {tarea}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 p-3 bg-purple-900/50 rounded">
                <p className="text-purple-300 font-semibold">🎯 KPI esperado:</p>
                <p className="text-purple-200 mt-1">{dia.kpi}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* LEYENDA */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-yellow-900/30 border-l-4 border-l-yellow-500 p-4 rounded">
          <p className="text-yellow-300 font-bold">🟡 Hoy</p>
          <p className="text-yellow-200 text-sm mt-1">Es hoy, enfócate en este día</p>
        </div>
        <div className="bg-green-900/30 border-l-4 border-l-green-500 p-4 rounded">
          <p className="text-green-300 font-bold">✅ Completado</p>
          <p className="text-green-200 text-sm mt-1">Ya pasó, buen trabajo</p>
        </div>
        <div className="bg-blue-900/30 border-l-4 border-l-blue-500 p-4 rounded">
          <p className="text-blue-300 font-bold">📅 Capacitación</p>
          <p className="text-blue-200 text-sm mt-1">Fase de aprendizaje</p>
        </div>
        <div className="bg-red-900/30 border-l-4 border-l-red-500 p-4 rounded">
          <p className="text-red-300 font-bold">🔥 Prospectación</p>
          <p className="text-red-200 text-sm mt-1">Fase de ventas en vivo</p>
        </div>
      </div>
    </div>
  );
}
