import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { CHECKLIST_INICIO, CHECKLIST_CIERRE } from '../data/alba-constants';

export default function DailyChecklist() {
  const [checklist, setChecklist] = useState('inicio');
  const [checkboxes, setCheckboxes] = useState({});

  const items = checklist === 'inicio' ? CHECKLIST_INICIO : CHECKLIST_CIERRE;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`checklist_${checklist}`) || '{}');
    setCheckboxes(saved);
  }, [checklist]);

  const handleCheck = (index) => {
    const updated = { ...checkboxes, [index]: !checkboxes[index] };
    setCheckboxes(updated);
    localStorage.setItem(`checklist_${checklist}`, JSON.stringify(updated));
  };

  const completados = Object.values(checkboxes).filter(v => v).length;
  const total = items.length;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-6">📋 Checklist Diario</h1>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setChecklist('inicio')}
          className={`px-6 py-3 rounded-lg font-bold transition ${
            checklist === 'inicio'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          🌅 Inicio de Jornada
        </button>
        <button
          onClick={() => setChecklist('cierre')}
          className={`px-6 py-3 rounded-lg font-bold transition ${
            checklist === 'cierre'
              ? 'bg-red-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          🌙 Cierre de Jornada
        </button>
      </div>

      {/* PROGRESO */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
        <div className="flex justify-between mb-2">
          <p className="text-slate-300">Progreso</p>
          <p className="text-white font-bold">{completados}/{total}</p>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(completados / total) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCheck(index)}
            className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition ${
              checkboxes[index]
                ? 'bg-green-900 border-2 border-green-500'
                : 'bg-slate-800 border-2 border-slate-700 hover:border-slate-600'
            }`}
          >
            {checkboxes[index] ? (
              <CheckCircle2 size={24} className="text-green-400 flex-shrink-0" />
            ) : (
              <Circle size={24} className="text-slate-500 flex-shrink-0" />
            )}
            <span className={`text-lg ${checkboxes[index] ? 'text-green-300 line-through' : 'text-slate-200'}`}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* BOTÓN COMPLETADO */}
      {completados === total && (
        <div className="mt-8 p-6 bg-green-900 border-2 border-green-500 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-300">✅ ¡Jornada Completada!</h2>
          <p className="text-green-400 mt-2">Excelente trabajo, Stefany. Sigue así 🔥</p>
        </div>
      )}
    </div>
  );
}
