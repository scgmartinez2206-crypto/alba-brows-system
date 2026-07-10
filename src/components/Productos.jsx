import React, { useState } from 'react';
import { DollarSign, Clock, Gift, ChevronRight } from 'lucide-react';
import { PRODUCTOS, BONOS, METODOS_PAGO } from '../data/alba-constants';

export default function Productos() {
  const [activeTab, setActiveTab] = useState('productos');

  return (
    <div style={{ backgroundColor: 'var(--bg-light)' }} className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
            Catálogo de Servicios
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
            Programas de capacitación y micropigmentación
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'productos', label: 'Servicios' },
            { id: 'bonos', label: 'Bonificaciones' },
            { id: 'metodos', label: 'Métodos de Pago' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-6 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--accent-pink)' : 'white',
                color: activeTab === tab.id ? 'white' : 'var(--text-dark)',
                border: '1px solid var(--border-light)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PRODUCTOS */}
        {activeTab === 'productos' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRODUCTOS.map((producto, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-8 border transition-all duration-200 hover:shadow-lg"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--border-light)'
                  }}
                >
                  {/* HEADER */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-dark)' }}>
                      {producto.nombre}
                    </h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                      {producto.descripcion}
                    </p>
                  </div>

                  {/* DETAILS GRID */}
                  <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} style={{ color: 'var(--accent-gold)' }} />
                        <span style={{ color: 'var(--text-light)', fontSize: '12px', fontWeight: '500' }}>
                          Duración
                        </span>
                      </div>
                      <p className="font-semibold" style={{ color: 'var(--text-dark)' }}>
                        {producto.duracion}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign size={16} style={{ color: 'var(--accent-gold)' }} />
                        <span style={{ color: 'var(--text-light)', fontSize: '12px', fontWeight: '500' }}>
                          Reserva
                        </span>
                      </div>
                      <p className="font-semibold" style={{ color: 'var(--text-dark)' }}>
                        ${producto.reserva}
                      </p>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: 'var(--bg-light)' }}>
                    <p style={{ color: 'var(--text-light)', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                      Precio Total
                    </p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>
                      ${producto.precio}
                    </p>
                  </div>

                  {/* INCLUDES */}
                  <div className="mb-6">
                    <p style={{ color: 'var(--text-light)', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                      Incluye
                    </p>
                    <ul className="space-y-2">
                      {producto.incluye?.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                            style={{ backgroundColor: 'var(--accent-pink)' }}
                          />
                          <span style={{ color: 'var(--text-dark)', fontSize: '14px' }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA BUTTON */}
                  <button
                    className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                    style={{ backgroundColor: 'var(--accent-pink)' }}
                  >
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BONOS */}
        {activeTab === 'bonos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BONOS.map((bono, idx) => (
              <div
                key={idx}
                className="rounded-lg p-8 border"
                style={{
                  backgroundColor: 'white',
                  borderColor: 'var(--border-light)',
                  borderLeft: `4px solid var(--accent-gold)`
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
                  >
                    <Gift size={20} style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--text-dark)' }}>
                      {bono.nombre}
                    </h3>
                  </div>
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                  {bono.descripcion}
                </p>
                {bono.valor && (
                  <p className="mt-4 font-semibold" style={{ color: 'var(--accent-gold)' }}>
                    {bono.valor}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* METODOS DE PAGO */}
        {activeTab === 'metodos' && (
          <div>
            <div className="mb-6 p-6 rounded-lg" style={{ backgroundColor: 'rgba(236, 72, 153, 0.05)', borderLeft: '4px solid var(--accent-pink)' }}>
              <p style={{ color: 'var(--text-dark)', fontSize: '14px', marginBottom: '8px' }}>
                <strong>📱 Contacto Directo:</strong>
              </p>
              <p style={{ color: 'var(--text-dark)', fontSize: '14px', marginBottom: '4px' }}>
                Luz María del alba polanco Ramires | Teléfono: 1-829-977-5918
              </p>
              <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>
                Disponible para consultas sobre métodos de pago y transferencias
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {METODOS_PAGO.map((metodo, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-6 border transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--border-light)',
                    borderLeft: '4px solid var(--accent-gold)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--accent-pink)' }}>
                        {metodo.nombre}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-light)' }}>
                        A nombre de: {metodo.titular}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                    {metodo.detalles?.map((detalle, i) => (
                      <p
                        key={i}
                        style={{ color: 'var(--text-dark)', fontSize: '14px' }}
                        className="flex items-start gap-2 font-medium"
                      >
                        <span style={{ color: 'var(--accent-gold)', marginTop: '2px' }}>✓</span>
                        {detalle}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
