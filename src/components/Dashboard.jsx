import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageCircle, CheckCircle2, DollarSign, ChevronRight } from 'lucide-react';
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
    { label: 'Conversaciones', value: kpis.conversaciones, meta: KPIS_META.conversaciones, icon: MessageCircle, color: 'rgb(236, 72, 153)' },
    { label: 'Seguimientos', value: kpis.contactados, meta: KPIS_META.contactados, icon: TrendingUp, color: 'rgb(251, 191, 36)' },
    { label: 'Valoraciones', value: kpis.cualificados, meta: KPIS_META.cualificados, icon: CheckCircle2, color: 'rgb(139, 92, 246)' },
    { label: 'Comisión', value: `$${(kpis.agendados * 180).toLocaleString()}`, meta: 0, icon: DollarSign, color: 'rgb(34, 197, 94)' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh' }} className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* GREETING */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
            Hoy es un gran día para transformar vidas 🎀
          </h2>
          <p style={{ color: 'var(--text-light)' }}>Continúa con tu plan y alcanza tus metas</p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="rounded-lg p-6 border transition-all hover:shadow-lg cursor-pointer"
                style={{
                  backgroundColor: 'white',
                  borderColor: 'var(--border-light)',
                  borderLeft: `4px solid ${metric.color}`
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: `${metric.color}20`
                    }}
                  >
                    <Icon size={24} style={{ color: metric.color }} />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-light)' }}>
                    {metric.label}
                  </span>
                </div>
                <p className="text-3xl font-bold mb-2" style={{ color: metric.color }}>
                  {metric.value}
                </p>
                {metric.meta > 0 && (
                  <div>
                    <div className="h-1 rounded-full mb-2" style={{ backgroundColor: 'var(--border-light)' }}>
                      <div
                        className="h-1 rounded-full transition-all"
                        style={{
                          width: `${calcProgress(metric.value, metric.meta)}%`,
                          backgroundColor: metric.color
                        }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-light)' }}>
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

          {/* TU PRIORIDAD HOY */}
          <div className="lg:col-span-1 rounded-lg p-6 bg-white border" style={{ borderColor: 'var(--border-light)' }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
              <span>👋</span> Tu prioridad hoy
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-red-50 border-l-4 border-red-500">
                <p className="text-sm font-bold text-red-600">Responder a María López</p>
                <p className="text-xs text-red-500">Hace 5h que espera respuesta</p>
                <button className="text-xs font-bold mt-2 px-3 py-1 rounded" style={{ backgroundColor: 'var(--accent-pink)', color: 'white' }}>
                  Responder
                </button>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border-l-4 border-amber-500">
                <p className="text-sm font-bold text-amber-600">Enviar información Master Lips</p>
                <p className="text-xs text-amber-500">Andrea Ruiz - Interesada en curso</p>
                <button className="text-xs font-bold mt-2 px-3 py-1 rounded" style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--primary-dark)' }}>
                  Enviar
                </button>
              </div>
            </div>

            <button className="w-full mt-4 text-center text-sm font-bold py-2 rounded-lg transition" style={{ color: 'var(--accent-pink)' }}>
              Ver todas mis tareas <ChevronRight size={16} className="inline ml-1" />
            </button>
          </div>

          {/* ESTADO Y CRONOGRAMA */}
          <div className="lg:col-span-2 space-y-6">

            {/* ESTADO ACTUAL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg p-6 bg-white border text-center" style={{ borderColor: 'var(--border-light)' }}>
                <p style={{ color: 'var(--text-light)' }} className="text-sm mb-2">Estado Actual</p>
                <h4 className="text-2xl font-bold mb-2" style={{ color: estaEnProspectacion ? 'var(--accent-pink)' : 'var(--text-dark)' }}>
                  {estaEnProspectacion ? '🔥 Prospectación' : '📚 Capacitación'}
                </h4>
                <div className="text-xs p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-light)' }}>
                  <p style={{ color: 'var(--text-light)' }}>Comienza 15 de julio</p>
                </div>
              </div>

              <div className="rounded-lg p-6 bg-white border text-center" style={{ borderColor: 'var(--border-light)' }}>
                <p style={{ color: 'var(--text-light)' }} className="text-sm mb-2">Días Faltantes</p>
                <h4 className="text-4xl font-bold" style={{ color: 'var(--accent-gold)' }}>
                  {diasFaltantes}
                </h4>
                <p className="text-xs mt-2" style={{ color: 'var(--text-light)' }}>Vamos por más 💪</p>
              </div>

              <div className="rounded-lg p-6 bg-white border" style={{ borderColor: 'var(--border-light)' }}>
                <p style={{ color: 'var(--text-light)' }} className="text-sm mb-2">Tarea Hoy</p>
                <h4 className="font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
                  {cronoHoy?.titulo || 'Sin cronograma'}
                </h4>
                <div className="text-xs space-y-1">
                  {cronoHoy?.tareas?.slice(0, 2).map((t, i) => (
                    <p key={i} style={{ color: 'var(--text-light)' }}>• {t}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="rounded-lg p-6 bg-white border" style={{ borderColor: 'var(--border-light)' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-dark)' }}>Acciones Rápidas</h3>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 rounded-lg font-bold transition hover:shadow-lg text-white" style={{ backgroundColor: 'var(--accent-pink)' }}>
                  ✓ Checklist Inicio
                </button>
                <button className="p-4 rounded-lg font-bold transition hover:shadow-lg text-white" style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--primary-dark)' }}>
                  🎯 Lead Scorer
                </button>
                <button className="p-4 rounded-lg font-bold transition hover:shadow-lg text-white" style={{ backgroundColor: 'var(--success)' }}>
                  ✓ Checklist Cierre
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
