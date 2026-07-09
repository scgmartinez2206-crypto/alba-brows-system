import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageCircle, CheckCircle2, DollarSign, ChevronRight, Clock } from 'lucide-react';
import { CRONOGRAMA, KPIS_META } from '../data/alba-constants';

export default function Dashboard() {
  const [hoy] = useState(new Date());
  const [diasFaltantes, setDiasFaltantes] = useState(0);
  const [kpis, setKpis] = useState({
    contactados: 0,
    conversaciones: 0,
    cualificados: 0,
    agendados: 0
  });

  useEffect(() => {
    const fecha15julio = new Date(2026, 6, 15);
    const diferencia = Math.ceil((fecha15julio - hoy) / (1000 * 60 * 60 * 24));
    setDiasFaltantes(diferencia > 0 ? diferencia : 0);

    const kpisLocal = JSON.parse(localStorage.getItem('kpis') || '{}');
    setKpis(kpisLocal);
  }, [hoy]);

  const estaEnProspectacion = new Date() >= new Date(2026, 6, 15);
  const cronoHoy = CRONOGRAMA.find(d => {
    const fecha = new Date(d.fecha);
    const hoyNorm = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return fecha.toDateString() === hoyNorm.toDateString();
  });

  const calcProgress = (actual, meta) => {
    return meta > 0 ? Math.min((actual / meta) * 100, 100) : 0;
  };

  const metrics = [
    {
      label: 'Conversaciones',
      value: kpis.conversaciones,
      meta: KPIS_META.conversaciones,
      icon: MessageCircle,
      color: 'var(--accent-pink)'
    },
    {
      label: 'Contactados',
      value: kpis.contactados,
      meta: KPIS_META.contactados,
      icon: TrendingUp,
      color: 'var(--accent-gold)'
    },
    {
      label: 'Cualificados',
      value: kpis.cualificados,
      meta: KPIS_META.cualificados,
      icon: CheckCircle2,
      color: 'var(--success)'
    },
    {
      label: 'Comisión',
      value: `$${(kpis.agendados * 180).toLocaleString()}`,
      meta: 0,
      icon: DollarSign,
      color: 'var(--accent-gold)'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-light)' }} className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
            Dashboard Operativo
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
            Control de actividades y metas diarias
          </p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            const progress = calcProgress(
              typeof metric.value === 'string' ? 0 : metric.value,
              metric.meta
            );
            return (
              <div
                key={idx}
                className="rounded-lg p-6 transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: `${metric.color}15`
                    }}
                  >
                    <Icon size={22} style={{ color: metric.color }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: 'var(--bg-light)',
                      color: 'var(--text-light)'
                    }}
                  >
                    {metric.label}
                  </span>
                </div>

                <div className="mb-3">
                  <p
                    className="text-3xl font-bold"
                    style={{ color: metric.color }}
                  >
                    {metric.value}
                  </p>
                </div>

                {metric.meta > 0 && (
                  <div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--border-light)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: metric.color
                        }}
                      />
                    </div>
                    <p
                      className="text-xs mt-2"
                      style={{ color: 'var(--text-light)' }}
                    >
                      Meta: {metric.meta}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PRIORITY TASKS */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: 'white', border: '1px solid var(--border-light)' }}
          >
            <h3 className="font-semibold mb-5" style={{ color: 'var(--text-dark)' }}>
              Tareas Prioritarias
            </h3>

            <div className="space-y-3">
              <div
                className="p-4 rounded-lg border-l-4"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  borderColor: '#ef4444'
                }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: '#b91c1c' }}>
                  Seguimiento - María López
                </p>
                <p className="text-xs" style={{ color: '#7f1d1d' }}>
                  Pendiente desde hace 5 horas
                </p>
                <button
                  className="mt-3 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                  style={{
                    backgroundColor: 'var(--accent-pink)',
                    color: 'white'
                  }}
                >
                  Actuar Ahora
                </button>
              </div>

              <div
                className="p-4 rounded-lg border-l-4"
                style={{
                  backgroundColor: 'rgba(251, 191, 36, 0.05)',
                  borderColor: 'var(--accent-gold)'
                }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: '#92400e' }}>
                  Enviar información - Andrea Ruiz
                </p>
                <p className="text-xs" style={{ color: '#78350f' }}>
                  Interesada en programa
                </p>
                <button
                  className="mt-3 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                    color: 'var(--primary-dark)'
                  }}
                >
                  Enviar
                </button>
              </div>
            </div>

            <button
              className="w-full mt-5 text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
              style={{
                color: 'var(--accent-pink)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-light)'
              }}
            >
              Ver Todas
              <ChevronRight size={16} />
            </button>
          </div>

          {/* STATE & SCHEDULE */}
          <div className="lg:col-span-2 space-y-6">

            {/* STATUS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="rounded-lg p-6"
                style={{ backgroundColor: 'white', border: '1px solid var(--border-light)' }}
              >
                <p
                  className="text-xs font-semibold mb-3 uppercase tracking-wide"
                  style={{ color: 'var(--text-light)' }}
                >
                  Estado Actual
                </p>
                <p
                  className="text-lg font-bold"
                  style={{
                    color: estaEnProspectacion
                      ? 'var(--accent-pink)'
                      : 'var(--text-dark)'
                  }}
                >
                  {estaEnProspectacion ? 'Prospectación' : 'Capacitación'}
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: 'var(--text-light)' }}
                >
                  Inicia 15 julio
                </p>
              </div>

              <div
                className="rounded-lg p-6"
                style={{ backgroundColor: 'white', border: '1px solid var(--border-light)' }}
              >
                <p
                  className="text-xs font-semibold mb-3 uppercase tracking-wide"
                  style={{ color: 'var(--text-light)' }}
                >
                  Días Restantes
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  {diasFaltantes}
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: 'var(--text-light)' }}
                >
                  Hasta prospectación
                </p>
              </div>

              <div
                className="rounded-lg p-6"
                style={{ backgroundColor: 'white', border: '1px solid var(--border-light)' }}
              >
                <p
                  className="text-xs font-semibold mb-3 uppercase tracking-wide"
                  style={{ color: 'var(--text-light)' }}
                >
                  Hoy
                </p>
                <p
                  className="text-sm font-bold line-clamp-2"
                  style={{ color: 'var(--text-dark)' }}
                >
                  {cronoHoy?.titulo || 'Sin cronograma'}
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: 'var(--text-light)' }}
                >
                  Tareas del día
                </p>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div
              className="rounded-lg p-6"
              style={{ backgroundColor: 'white', border: '1px solid var(--border-light)' }}
            >
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  className="py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md text-sm"
                  style={{ backgroundColor: 'var(--accent-pink)' }}
                >
                  Checklist Inicio
                </button>
                <button
                  className="py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md text-sm"
                  style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--primary-dark)' }}
                >
                  Lead Scorer
                </button>
                <button
                  className="py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md text-sm"
                  style={{ backgroundColor: 'var(--success)' }}
                >
                  Checklist Cierre
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
