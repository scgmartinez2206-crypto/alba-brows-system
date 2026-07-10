// ========================================
// ALBA BROWS - DATOS Y CONSTANTES
// ========================================

export const CRONOGRAMA = [
  {
    fecha: "2026-07-06",
    dia: "Lunes",
    tipo: "capacitacion",
    titulo: "Capacitación de Producto",
    tareas: [
      "Revisar todos los productos",
      "Entender diferenciales Alba",
      "Memorizar precios y paquetes",
      "Ver materiales de marca"
    ],
    kpi: "Dominar producto 100%",
    reunion: "9:00 AM - 12:00 PM"
  },
  {
    fecha: "2026-07-07",
    dia: "Martes",
    tipo: "capacitacion",
    titulo: "Capacitación Operativa",
    tareas: [
      "Revisar SOPs diarios",
      "Configurar Google Sheets",
      "Conectar ManyChat",
      "Entender flujos"
    ],
    kpi: "Herramientas listas",
    reunion: "9:00 AM - 12:00 PM"
  },
  {
    fecha: "2026-07-08",
    dia: "Miércoles",
    tipo: "capacitacion",
    titulo: "Entrenamiento Setter",
    tareas: [
      "8 roleplay prácticos",
      "Cualificación perfecta",
      "Objeciones resueltas",
      "Agendamiento exitoso"
    ],
    kpi: "Mínimo 8 roleplay",
    reunion: "8:00 AM - 5:00 PM"
  },
  {
    fecha: "2026-07-09",
    dia: "Jueves",
    tipo: "capacitacion",
    titulo: "Entrenamiento Closer",
    tareas: [
      "Entender flujo Closer",
      "Presentación valoración",
      "Cierre de ventas",
      "Manejo de objeciones"
    ],
    kpi: "Entender flujo completo",
    reunion: "9:00 AM - 12:00 PM"
  },
  {
    fecha: "2026-07-10",
    dia: "Viernes",
    tipo: "capacitacion",
    titulo: "Integración Comercial",
    tareas: [
      "Conectar Setter + Closer",
      "Práctica de entrega",
      "Registro en sistema",
      "Reportes"
    ],
    kpi: "Flujo completo funcional",
    reunion: "9:00 AM - 12:00 PM"
  },
  {
    fecha: "2026-07-11",
    dia: "Sábado",
    tipo: "capacitacion",
    titulo: "Simulación General",
    tareas: [
      "Simulación completa con casos reales",
      "Validación de todas habilidades",
      "Feedback individual",
      "Ajustes finales"
    ],
    kpi: "Simulación exitosa",
    reunion: "9:00 AM - 1:00 PM"
  },
  {
    fecha: "2026-07-13",
    dia: "Lunes",
    tipo: "capacitacion",
    titulo: "Certificación Comercial",
    tareas: [
      "Test de conocimiento",
      "Validación habilidades",
      "Certificación oficial",
      "Socialización celebración"
    ],
    kpi: "Certificación aprobada",
    reunion: "10:00 AM - 12:00 PM"
  },
  {
    fecha: "2026-07-14",
    dia: "Martes",
    tipo: "capacitacion",
    titulo: "Ajustes Finales",
    tareas: [
      "Revisar dudas finales",
      "Pulir técnicas",
      "Preparar para prospección",
      "Mindset competitivo"
    ],
    kpi: "Listo para prospección",
    reunion: "3:00 PM - 5:00 PM"
  },
  {
    fecha: "2026-07-15",
    dia: "Miércoles",
    tipo: "prospectacion",
    titulo: "INICIO PROSPECCIÓN EN VIVO 🔥",
    tareas: [
      "Prospección real con leads",
      "Aplicar todo aprendido",
      "Primeras conversiones",
      "Registro de resultados"
    ],
    kpi: "Mínimo 5 contactos",
    reunion: "8:00 AM"
  }
];

export const PRODUCTOS = [
  {
    id: 1,
    nombre: "Curso Básico",
    descripcion: "Cejas y Pestañas",
    duracion: "1 día",
    precio: 300,
    reserva: 500,
    incluye: [
      "Kit premium",
      "Máquina completa",
      "6 meses seguimiento WhatsApp",
      "Trucos Alba",
      "Mercadeo",
      "Modelo real",
      "Certificado"
    ]
  },
  {
    id: 2,
    nombre: "Paquete 1",
    descripcion: "Cejas",
    duracion: "3 días",
    precio: 1800,
    reserva: 500,
    incluye: [
      "Kit premium completo",
      "Máquina profesional",
      "6 meses seguimiento",
      "Formulas Alba exclusivas",
      "Estrategia de mercadeo",
      "3 modelos",
      "Certificado oficial"
    ]
  },
  {
    id: 3,
    nombre: "Paquete 2",
    descripcion: "Cejas + Labios",
    duracion: "4 días",
    precio: 2800,
    reserva: 600,
    incluye: [
      "Kit premium completo",
      "2 máquinas",
      "6 meses seguimiento",
      "Fórmulas exclusivas cejas + labios",
      "Mercadeo avanzado",
      "4 modelos",
      "Certificado oficial",
      "Bono: Descuento 100 USD si se inscribe en <7 días"
    ]
  },
  {
    id: 4,
    nombre: "Paquete 3 (Master)",
    descripcion: "Cejas + Labios + Capilar",
    duracion: "5 días",
    precio: 3500,
    reserva: 700,
    incluye: [
      "Kit premium completo",
      "3 máquinas",
      "6 meses seguimiento",
      "Fórmulas exclusivas completas",
      "Mercadeo profesional",
      "5 modelos",
      "Certificado Master oficial",
      "Bono: Curso Básico GRATIS si se inscribe en <7 días"
    ]
  }
];

export const OBJECIONES = [
  {
    id: 1,
    objecion: "Está caro",
    respuesta: "No vienes a mirar teoría, vienes a practicar y vivir experiencia completa. Alba enseña desde experiencia real, no improvisado. Saldrás con más claridad, seguridad y técnica que puedas seguir desarrollando. El kit premium y máquina te ayudan a seguir practicando después.",
    tipo: "precio"
  },
  {
    id: 2,
    objecion: "Lo tengo que pensar",
    respuesta: "Perfecto, es una decisión importante. Pero te digo una cosa: julio es la temporada ideal porque vienen dominicanas del extranjero. Si esperas al próximo mes, pierdes esa ventana. ¿Qué es lo que necesitas aclarar ahorita para sentirte segura?",
    tipo: "tiempo"
  },
  {
    id: 3,
    objecion: "No tengo dinero completo",
    respuesta: "Tenemos opciones: reserva solo 500-700 USD y el resto lo pagas el primer día de clase. O si haces transferencia en los próximos 7 días, te damos descuento de hasta 100 USD. ¿Eso te ayuda?",
    tipo: "dinero"
  },
  {
    id: 4,
    objecion: "Vivo fuera",
    respuesta: "Eso es excelente, porque la formación es 100% presencial aquí en RD. Muchas de nuestras alumnas vienen del extranjero justamente en julio-agosto de vacaciones. Ofrecemos guía con hospedaje. ¿De dónde eres?",
    tipo: "ubicacion"
  },
  {
    id: 5,
    objecion: "No sé si pueda aprender",
    respuesta: "No necesitas saber para eso es la formación. Alba enseña paso a paso, desde cero. Nuestras alumnas sin experiencia se vuelven profesionales en una semana. Lo que importa es que quieras aprender.",
    tipo: "miedo"
  },
  {
    id: 6,
    objecion: "No tengo experiencia",
    respuesta: "Perfecto, por eso es la formación. Aprendes técnica, posicionamiento, mercadeo y modelo de negocio. Después del curso, tienes 6 meses de seguimiento WhatsApp con Alba para resolver dudas.",
    tipo: "experiencia"
  },
  {
    id: 7,
    objecion: "No tengo modelo",
    respuesta: "El curso incluye modelos reales. Trabajamos con personas de la comunidad que están disponibles durante tu formación. Eso es parte de tu experiencia.",
    tipo: "logistica"
  },
  {
    id: 8,
    objecion: "No recupero inversión",
    respuesta: "Una alumna que hace 10 cejas por semana a 50 USD recupera los 1800 USD en 9 semanas. Y eso es conservador. Con mercadeo y autoridad Alba, puedes cobrar 80-120 USD. Esto es un negocio, no un hobby.",
    tipo: "roi"
  }
];

export const GUIONES = {
  apertura: [
    "Hola {{nombre}}! 👋 Vimos tu mensajito sobre las formaciones. ¿Cómo estás?",
    "Hola {{nombre}}, qué tal! Vi que te interesa aprender micropigmentación. Cuéntame un poco más",
    "Hey {{nombre}}! 🎀 ¡Qué emoción! ¿De dónde nos escribes?"
  ],
  cualificacion: [
    "¿Tienes experiencia en belleza o sería tu primer paso?",
    "¿Ya trabajas en algo relacionado o estás pensando en empezar?",
    "¿Buscas aprender solo por hobby o es para generar ingresos?"
  ],
  presentacion: [
    "Te voy a explicar cómo es: vienen al curso 100% presencial, aprenden técnica desde cero, practican con modelos reales, y se van con kit completo para seguir practicando en casa.",
    "Tenemos 4 opciones: Básico (1 día, 300 USD), Paquete 1 (3 días, cejas, 1800 USD), Paquete 2 (4 días, cejas + labios, 2800 USD) o Master (5 días, todo, 3500 USD).",
    "Lo especial es que incluye máquina, kit, 6 meses seguimiento WhatsApp conmigo, y trucos que solo Alba comparte."
  ],
  cierre: [
    "¿Cuál te llama más la atención? ¿Cuándo podrías viajar?",
    "¿Qué te parece? ¿Hacemos la reserva para que aseguramos tu cupo?",
    "Mira, julio es perfecto porque vienen muchas chicas del extranjero. ¿Te llama el Paquete 2 o 3?"
  ]
};

export const LEAD_SCORER = {
  criterios: [
    { nombre: "Ya escribió 2+ veces", puntos: 30, tipo: "contacto" },
    { nombre: "Pregunta precio/fechas", puntos: 25, tipo: "interes" },
    { nombre: "Dice que viene USA/PR/Europa", puntos: 20, tipo: "ubicacion" },
    { nombre: "Ya trabaja en belleza", puntos: 20, tipo: "experiencia" },
    { nombre: "Pregunta Paquete 2-3", puntos: 25, tipo: "producto" },
    { nombre: "Urgencia julio-agosto", puntos: 20, tipo: "temporada" }
  ],
  caliente: { min: 90, color: "#ef4444" },
  tibio: { min: 50, max: 89, color: "#f59e0b" },
  frio: { max: 49, color: "#9ca3af" }
};

export const KPIS_META = {
  contactados: 10,
  conversaciones: 8,
  cualificados: 5,
  agendados: 2
};

export const CHECKLIST_INICIO = [
  "Revisar grupos de WhatsApp (General + Comprobantes)",
  "Actualizar Google Sheets",
  "Ver agenda del día",
  "Priorizar follow-ups",
  "Revisar objeciones del día"
];

export const CHECKLIST_CIERRE = [
  "Todas conversaciones respondidas",
  "Seguimientos hechos",
  "Valoraciones confirmadas",
  "Sheets actualizado",
  "Enviar 'Excel actualizado' al grupo"
];

export const METODOS_PAGO = [
  {
    nombre: "Popular",
    titular: "Alba Gutiérrez",
    detalles: [
      "Ahorro en pesos RD: No. 807 532 395",
      "Ahorro en dólares USD: No. 818 159 816"
    ]
  },
  {
    nombre: "BanReservas",
    titular: "Alba Gutiérrez",
    detalles: [
      "Ahorro en pesos RD: No. 960 287 96 62"
    ]
  },
  {
    nombre: "SCOTIABANK",
    titular: "Alba Gutiérrez",
    detalles: [
      "Ahorro en pesos RD: 63200021933",
      "Ahorro en dólares USD: 63200020938"
    ]
  },
  {
    nombre: "BHD León",
    titular: "Alba Gutiérrez",
    detalles: [
      "Ahorro en pesos RD: No. 143 802 800 14"
    ]
  },
  {
    nombre: "Western Union / Caribe Express",
    titular: "Luz María del alba polanco Ramires",
    detalles: [
      "Cédula: 001-0778659-2",
      "Teléfono: 1-829-977-5918",
      "Disponible en ambos servicios"
    ]
  }
];

export const BONOS = [
  {
    id: 1,
    nombre: "Bono Acción Rápida",
    descripcion: "Paquete 2 o 3 en <7 días",
    bonus: "Curso Básico GRATIS (valor 300 USD)",
    condicion: "Inscripción + Transferencia en <7 días"
  },
  {
    id: 2,
    nombre: "Descuento Inscripción Rápida",
    descripcion: "Cualquier paquete en <7 días",
    bonus: "Descuento hasta 100 USD",
    condicion: "Inscripción + Transferencia en <7 días"
  }
];
