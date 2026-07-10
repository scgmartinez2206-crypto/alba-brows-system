import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { CRONOGRAMA } from '../data/alba-constants';

export default function Cronograma() {
  const hoy = new Date();
  const hoyNorm = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  return (
    <div style={{ backgroundColor: 'var(--bg-light)' }} className="min-h-screen p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
            📅 Cronograma Oficial
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
            Capacitación (6-14 Julio) + Inicio Prospección (15 Julio)
          </p>
        </div>

        <div className="space-y-4">
          {CRONOGRAMA.map((dia, index) => {
            const fechaDia = new Date(dia.fecha);
            const esHoy = fechaDia.toDateString() === hoyNorm.toDateString();
            const esPasado = fechaDia < hoyNorm;
            const esProspectacion = dia.tipo === 'prospectacion';

            const borderColor = esProspectacion ? 'var(--accent-pink)' : 'var(--accent-gold)';
            const bgColor = esProspectacion
              ? 'rgba(236, 72, 153, 0.08)'
              : 'rgba(251, 191, 36, 0.08)';
            const labelColor = esProspectacion ? 'var(--accent-pink)' : 'var(--accent-gold)';

            return (
              <div
                key={index}
                className="rounded-lg p-6 border transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'white',
                  borderLeft: `4px solid ${borderColor}`,
                  borderColor: 'var(--border-light)',
                  opacity: esPasado ? 0.7 : 1
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {esHoy && (
                        <span
                          className="inline-block w-3 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: 'var(--accent-pink)' }}
                        ></span>
                      )}
                      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>
                        {dia.titulo}
                      </h2>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                      {dia.dia} • {dia.fecha}
                    </p>
                  </div>
                  <div>
                    {esPasado ? (
                      <CheckCircle style={{ color: 'var(--success)' }} size={32} />
                    ) : esHoy ? (
                      <AlertCircle style={{ color: 'var(--accent-pink)' }} size={32} className="animate-pulse" />
                    ) : (
                      <Calendar style={{ color: labelColor }} size={32} />
                    )}
                  </div>
                </div>

                {dia.reunion && (
                  <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: bgColor }}>
                    <Clock size={18} style={{ color: labelColor }} />
                    <p className="font-semibold" style={{ color: 'var(--text-dark)' }}>
                      {dia.reunion}
                    </p>
                  </div>
                )}

                <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-light)' }}>
                  <p className="font-semibold mb-3" style={{ color: 'var(--text-dark)' }}>
                    📋 Tareas del día:
                  </p>
                  <ul className="space-y-2">
                    {dia.tareas.map((tarea, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span style={{ color: labelColor, marginTop: '4px' }}>✓</span>
                        <span style={{ color: 'var(--text-dark)', fontSize: '14px' }}>
                          {tarea}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg border-l-4"
                  style={{
                    backgroundColor: 'white',
                    borderColor: labelColor,
                    borderTopColor: 'var(--border-light)',
                    borderRightColor: 'var(--border-light)',
                    borderBottomColor: 'var(--border-light)'
                  }}>
                  <p className="font-semibold" style={{ color: labelColor }}>
                    🎯 KPI esperado:
                  </p>
                  <p className="mt-1" style={{ color: 'var(--text-dark)', fontSize: '14px' }}>
                    {dia.kpi}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* LEYENDA */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg p-4 border" style={{
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            borderColor: 'var(--accent-pink)',
            borderLeft: '4px solid var(--accent-pink)'
          }}>
            <p className="font-bold" style={{ color: 'var(--accent-pink)' }}>🟡 Hoy</p>
            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px' }}>
              Enfócate en este día
            </p>
          </div>
          <div className="rounded-lg p-4 border" style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'var(--success)',
            borderLeft: '4px solid var(--success)'
          }}>
            <p className="font-bold" style={{ color: 'var(--success)' }}>✅ Completado</p>
            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px' }}>
              Ya pasó, buen trabajo
            </p>
          </div>
          <div className="rounded-lg p-4 border" style={{
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            borderColor: 'var(--accent-gold)',
            borderLeft: '4px solid var(--accent-gold)'
          }}>
            <p className="font-bold" style={{ color: 'var(--accent-gold)' }}>📅 Capacitación</p>
            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px' }}>
              Fase de aprendizaje
            </p>
          </div>
          <div className="rounded-lg p-4 border" style={{
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            borderColor: 'var(--accent-pink)',
            borderLeft: '4px solid var(--accent-pink)'
          }}>
            <p className="font-bold" style={{ color: 'var(--accent-pink)' }}>🔥 Prospectación</p>
            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px' }}>
              Fase de ventas en vivo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
