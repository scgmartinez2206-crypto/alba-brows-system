import React, { useState } from 'react';
import { } from 'lucide-react';
import { LEAD_SCORER } from '../data/alba-constants';

export default function LeadScorer() {
  const [nombre, setNombre] = useState('');
  const [criterios, setCriterios] = useState({});
  const [resultado, setResultado] = useState(null);

  const handleCriterio = (index) => {
    const updated = { ...criterios, [index]: !criterios[index] };
    setCriterios(updated);
  };

  const calcularScore = () => {
    let total = 0;
    Object.values(criterios).forEach((seleccionado, index) => {
      if (seleccionado) {
        total += LEAD_SCORER.criterios[index].puntos;
      }
    });

    let tipo, color, icono, accion;
    if (total >= LEAD_SCORER.caliente.min) {
      tipo = 'CALIENTE 🔥';
      color = 'red';
      icono = '🔥';
      accion = 'AGENDAR/CERRAR YA - Máxima prioridad';
    } else if (total >= LEAD_SCORER.tibio.min) {
      tipo = 'TIBIO ⚡';
      color = 'amber';
      icono = '⚡';
      accion = 'SEGUIMIENTO + testimonios + contenido';
    } else {
      tipo = 'FRÍO ❄️';
      color = 'slate';
      icono = '❄️';
      accion = 'Seguimiento ligero, nutrición de contenido';
    }

    setResultado({
      nombre,
      total,
      tipo,
      color,
      icono,
      accion
    });
  };

  const resetear = () => {
    setNombre('');
    setCriterios({});
    setResultado(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-6">🎯 Lead Scorer</h1>

      {!resultado ? (
        <>
          {/* ENTRADA */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
            <label className="block text-white font-bold mb-2">Nombre del Prospecto</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: María González"
              className="w-full p-3 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 outline-none"
            />
          </div>

          {/* CRITERIOS */}
          <div className="space-y-3 mb-6">
            <p className="text-slate-300 font-bold mb-4">¿Cuál de estos aplica?</p>
            {LEAD_SCORER.criterios.map((criterio, index) => (
              <div
                key={index}
                onClick={() => handleCriterio(index)}
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition ${
                  criterios[index]
                    ? 'bg-blue-900 border-2 border-blue-500'
                    : 'bg-slate-800 border-2 border-slate-700 hover:border-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={criterios[index] || false}
                  onChange={() => {}}
                  className="w-5 h-5 accent-blue-500"
                />
                <div>
                  <p className="text-white font-semibold">{criterio.nombre}</p>
                  <p className="text-slate-400 text-sm">+{criterio.puntos} puntos</p>
                </div>
              </div>
            ))}
          </div>

          {/* BOTÓN */}
          <button
            onClick={calcularScore}
            disabled={!nombre}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
          >
            Calcular Score
          </button>
        </>
      ) : (
        <>
          {/* RESULTADO */}
          <div className={`bg-${resultado.color}-900/30 border-2 border-${resultado.color}-500 rounded-lg p-8 text-center mb-6`}>
            <p className="text-3xl mb-2">{resultado.icono}</p>
            <h2 className="text-4xl font-bold text-white mb-2">{resultado.nombre}</h2>
            <p className={`text-3xl font-bold mb-2 text-${resultado.color}-300`}>{resultado.tipo}</p>
            <p className="text-slate-300 text-lg">Puntuación: <span className="font-bold text-2xl">{resultado.total}/100</span></p>
          </div>

          {/* ACCIÓN RECOMENDADA */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border-l-4 border-l-yellow-500">
            <p className="text-yellow-300 font-bold mb-2">📌 Acción Recomendada:</p>
            <p className="text-white text-lg">{resultado.accion}</p>
          </div>

          {/* DETALLES */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
            <p className="text-slate-300 font-bold mb-3">📊 Criterios Seleccionados:</p>
            <div className="space-y-2">
              {LEAD_SCORER.criterios.map((criterio, index) => (
                criterios[index] && (
                  <div key={index} className="flex justify-between text-slate-300">
                    <span>✓ {criterio.nombre}</span>
                    <span className="text-blue-400 font-bold">+{criterio.puntos}</span>
                  </div>
                )
              ))}
            </div>
            <div className="border-t border-slate-600 mt-3 pt-3 flex justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-yellow-400 font-bold text-lg">{resultado.total} pts</span>
            </div>
          </div>

          {/* BOTÓN RESETEAR */}
          <button
            onClick={resetear}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition"
          >
            Evaluar Otro Lead
          </button>
        </>
      )}
    </div>
  );
}
