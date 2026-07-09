import React, { useState } from 'react';
import { DollarSign, Clock, Check } from 'lucide-react';
import { PRODUCTOS, BONOS, METODOS_PAGO } from '../data/alba-constants';

export default function Productos() {
  const [tab, setTab] = useState('productos');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">🎀 Oferta de Productos</h1>
      <p className="text-slate-400 mb-6">Toda la gama Alba Brows - Precios, duraciones, incluyes</p>

      {/* TABS */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <button
          onClick={() => { setTab('productos'); setProductoSeleccionado(null); }}
          className={`px-6 py-3 rounded-lg font-bold transition ${
            tab === 'productos'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          💎 Productos
        </button>
        <button
          onClick={() => setTab('bonos')}
          className={`px-6 py-3 rounded-lg font-bold transition ${
            tab === 'bonos'
              ? 'bg-green-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          🎁 Bonos Autorizados
        </button>
        <button
          onClick={() => setTab('pago')}
          className={`px-6 py-3 rounded-lg font-bold transition ${
            tab === 'pago'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          💳 Métodos de Pago
        </button>
      </div>

      {/* PRODUCTOS */}
      {tab === 'productos' && !productoSeleccionado && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTOS.map((prod) => (
            <div
              key={prod.id}
              onClick={() => setProductoSeleccionado(prod)}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border-2 border-slate-700 hover:border-blue-500 cursor-pointer transition hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{prod.nombre}</h2>
                  <p className="text-slate-400 text-sm mt-1">{prod.descripcion}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900 p-3 rounded">
                  <p className="text-slate-400 text-xs">Duración</p>
                  <p className="text-white font-bold flex items-center gap-1 mt-1">
                    <Clock size={16} /> {prod.duracion}
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded">
                  <p className="text-slate-400 text-xs">Reserva</p>
                  <p className="text-blue-400 font-bold flex items-center gap-1 mt-1">
                    <DollarSign size={16} /> {prod.reserva} USD
                  </p>
                </div>
              </div>

              <div className="bg-blue-900 p-4 rounded mb-4">
                <p className="text-yellow-300 font-bold text-3xl">${prod.precio}</p>
                <p className="text-blue-300 text-sm mt-1">Precio total</p>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition">
                Ver Detalles →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DETALLE PRODUCTO */}
      {productoSeleccionado && (
        <div className="bg-slate-800 rounded-lg p-8 border-2 border-blue-500 mb-8">
          <button
            onClick={() => setProductoSeleccionado(null)}
            className="text-blue-400 hover:text-blue-300 mb-4"
          >
            ← Volver
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{productoSeleccionado.nombre}</h2>
              <p className="text-slate-400 text-lg mb-6">{productoSeleccionado.descripcion}</p>

              <div className="space-y-3 mb-6">
                <div className="bg-slate-900 p-4 rounded">
                  <p className="text-slate-400 text-sm">Precio Total</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-1">${productoSeleccionado.precio}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded">
                  <p className="text-slate-400 text-sm">Reserva</p>
                  <p className="text-2xl font-bold text-blue-400 mt-1">${productoSeleccionado.reserva}</p>
                  <p className="text-slate-500 text-xs mt-1">Se descuenta del total</p>
                </div>
                <div className="bg-slate-900 p-4 rounded">
                  <p className="text-slate-400 text-sm">Duración</p>
                  <p className="text-xl font-bold text-green-400 mt-1">{productoSeleccionado.duracion}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">📦 Incluye:</h3>
              <div className="space-y-2">
                {productoSeleccionado.incluye.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* REGLA DE PAGO */}
          <div className="mt-8 bg-yellow-900/30 border-l-4 border-l-yellow-500 p-4 rounded">
            <p className="text-yellow-300 font-bold mb-2">💡 Condiciones de Pago:</p>
            <ul className="text-yellow-200 text-sm space-y-1">
              <li>✓ Pago completo: primer día clase o día antes</li>
              <li>✓ No reembolsables</li>
              <li>✓ Si no asiste, pierde depósito</li>
            </ul>
          </div>
        </div>
      )}

      {/* BONOS */}
      {tab === 'bonos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BONOS.map((bono) => (
            <div key={bono.id} className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-green-300 mb-2">{bono.nombre}</h2>
              <p className="text-green-200 mb-4">{bono.descripcion}</p>

              <div className="bg-green-900 p-4 rounded mb-4">
                <p className="text-green-400 text-sm">🎁 Bono Especial:</p>
                <p className="text-2xl font-bold text-green-300 mt-1">{bono.bonus}</p>
              </div>

              <div className="bg-slate-900 p-4 rounded">
                <p className="text-slate-400 text-sm">Condición:</p>
                <p className="text-white font-semibold mt-1">{bono.condicion}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* METODOS DE PAGO */}
      {tab === 'pago' && (
        <div className="bg-slate-800 rounded-lg p-8 border-2 border-purple-500">
          <h2 className="text-2xl font-bold text-white mb-6">Métodos de Pago Autorizados</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {METODOS_PAGO.map((metodo, index) => (
              <div key={index} className="bg-slate-900 p-4 rounded border border-slate-700">
                <p className="text-white font-bold text-lg">💳 {metodo}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-purple-900/30 border-l-4 border-l-purple-500 p-4 rounded">
            <p className="text-purple-300 font-bold mb-2">⚠️ Importante:</p>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>✓ Monto reserva se descuenta del total</li>
              <li>✓ Pago completo primer día o día antes</li>
              <li>✓ No reembolsables después de confirmar</li>
              <li>✓ Verifica estatus de transferencia</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
