import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { GUIONES, OBJECIONES } from '../data/alba-constants';

export default function GuionesObjeciones() {
  const [tab, setTab] = useState('guiones');
  const [copied, setCopied] = useState(null);

  const copiarAlPortapapeles = (texto, id) => {
    navigator.clipboard.writeText(texto);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-6">📝 Guiones y Objeciones</h1>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('guiones')}
          className={`px-6 py-3 rounded-lg font-bold transition ${
            tab === 'guiones'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          🎯 Guiones por Etapa
        </button>
        <button
          onClick={() => setTab('objeciones')}
          className={`px-6 py-3 rounded-lg font-bold transition ${
            tab === 'objeciones'
              ? 'bg-red-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          ⚠️ Respuestas Objeciones
        </button>
      </div>

      {tab === 'guiones' ? (
        <>
          {/* GUIONES */}
          <div className="space-y-4">
            {Object.entries(GUIONES).map(([etapa, textos]) => (
              <div key={etapa} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <div className="bg-blue-900 p-4 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white capitalize">
                    {etapa === 'apertura' && '👋 Apertura/Saludo'}
                    {etapa === 'cualificacion' && '❓ Cualificación'}
                    {etapa === 'presentacion' && '🎀 Presentación Producto'}
                    {etapa === 'cierre' && '🎯 Cierre/Agendamiento'}
                  </h2>
                </div>

                <div className="p-4 space-y-3">
                  {textos.map((texto, index) => (
                    <div
                      key={index}
                      className="bg-slate-700 p-4 rounded border border-slate-600 hover:border-blue-500 transition group"
                    >
                      <p className="text-slate-200 mb-3">{texto}</p>
                      <button
                        onClick={() => copiarAlPortapapeles(texto, `${etapa}-${index}`)}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition"
                      >
                        {copied === `${etapa}-${index}` ? (
                          <>
                            <Check size={16} />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copiar
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* OBJECIONES */}
          <div className="space-y-4">
            {OBJECIONES.map((obj) => (
              <div key={obj.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <div className="bg-red-900 p-4 border-b border-slate-700">
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-bold text-white">❌ "{obj.objecion}"</h2>
                    <span className="text-xs bg-red-800 text-red-200 px-2 py-1 rounded capitalize">
                      {obj.tipo}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="bg-slate-700 p-4 rounded border border-slate-600 mb-3">
                    <p className="text-slate-200 mb-4">{obj.respuesta}</p>
                    <button
                      onClick={() => copiarAlPortapapeles(obj.respuesta, `obj-${obj.id}`)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition"
                    >
                      {copied === `obj-${obj.id}` ? (
                        <>
                          <Check size={16} />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copiar Respuesta
                        </>
                      )}
                    </button>
                  </div>

                  {/* TIPS */}
                  <div className="text-xs text-slate-400 bg-slate-900 p-2 rounded">
                    💡 Personaliza con el nombre y contexto específico del prospecto
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TABLA RESUMEN */}
          <div className="mt-8 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <div className="bg-slate-900 p-4 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white">📊 Resumen Objeciones</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-3 text-slate-300">Objeción</th>
                    <th className="text-left p-3 text-slate-300">Tipo</th>
                    <th className="text-center p-3 text-slate-300">Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {OBJECIONES.map((obj) => (
                    <tr key={obj.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="p-3 text-slate-200">"{obj.objecion}"</td>
                      <td className="p-3 text-slate-300 capitalize">
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded">{obj.tipo}</span>
                      </td>
                      <td className="text-center p-3">
                        {['precio', 'interes', 'dinero'].includes(obj.tipo) && '🔴 Alta'}
                        {['tiempo', 'ubicacion', 'experiencia'].includes(obj.tipo) && '🟡 Media'}
                        {['miedo', 'logistica', 'roi'].includes(obj.tipo) && '🟢 Baja'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
