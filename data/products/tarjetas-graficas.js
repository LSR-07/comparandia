/* Tarjetas gráficas — especificaciones de referencia del fabricante del chip. */
CT.registerData('tarjetas-graficas', {
  updated: '2026-10-15', // fecha de la última revisión de estos datos (se usa en el sitemap)
  schema: [
    { title: 'Chip', fields: [
      { k: 'arch', label: 'Arquitectura', type: 'text' },
      { k: 'shaders', label: 'Núcleos (CUDA / Stream)', type: 'num', better: 'high', pro: 'Más núcleos de cálculo', con: 'Menos núcleos de cálculo', hint: 'Los núcleos de NVIDIA y AMD no son directamente comparables entre sí.' },
      { k: 'boost', label: 'Frecuencia boost', unit: 'GHz', type: 'num', better: 'high', dec: 2, pro: 'Mayor frecuencia', con: 'Menor frecuencia' }
    ]},
    { title: 'Memoria', fields: [
      { k: 'vram', label: 'VRAM', unit: 'GB', type: 'num', better: 'high', pro: 'Más memoria de vídeo', con: 'Menos memoria de vídeo' },
      { k: 'memType', label: 'Tipo de memoria', type: 'rank', order: ['GDDR6', 'GDDR6X', 'GDDR7'], better: 'high', pro: 'Memoria de generación más reciente', con: 'Memoria de generación anterior' },
      { k: 'bus', label: 'Bus de memoria', unit: 'bits', type: 'num', better: 'high', pro: 'Bus de memoria más ancho', con: 'Bus de memoria más estrecho' }
    ]},
    { title: 'Consumo', fields: [
      { k: 'power', label: 'Consumo de la tarjeta', unit: 'W', type: 'num', better: 'low', pro: 'Consume menos energía', con: 'Consume más energía' }
    ]}
  ],
  products: [
    { id: 'rtx-5090', name: 'GeForce RTX 5090', brand: 'NVIDIA', year: 2025, price: [1999, 'USD'], alias: ['5090'],
      s: { arch: 'Blackwell', shaders: 21760, boost: 2.41, vram: 32, memType: 'GDDR7', bus: 512, power: 575 } },
    { id: 'rtx-5080', name: 'GeForce RTX 5080', brand: 'NVIDIA', year: 2025, price: [999, 'USD'], alias: ['5080'],
      s: { arch: 'Blackwell', shaders: 10752, boost: 2.62, vram: 16, memType: 'GDDR7', bus: 256, power: 360 } },
    { id: 'rtx-4090', name: 'GeForce RTX 4090', brand: 'NVIDIA', year: 2022, price: [1599, 'USD'], alias: ['4090'],
      s: { arch: 'Ada Lovelace', shaders: 16384, boost: 2.52, vram: 24, memType: 'GDDR6X', bus: 384, power: 450 } },
    { id: 'rtx-4080-super', name: 'GeForce RTX 4080 SUPER', brand: 'NVIDIA', year: 2024, price: [999, 'USD'], alias: ['4080 super'],
      s: { arch: 'Ada Lovelace', shaders: 10240, boost: 2.55, vram: 16, memType: 'GDDR6X', bus: 256, power: 320 } },
    { id: 'rtx-4070-super', name: 'GeForce RTX 4070 SUPER', brand: 'NVIDIA', year: 2024, price: [599, 'USD'], alias: ['4070 super'],
      s: { arch: 'Ada Lovelace', shaders: 7168, boost: 2.48, vram: 12, memType: 'GDDR6X', bus: 192, power: 220 } },
    { id: 'rtx-4060', name: 'GeForce RTX 4060', brand: 'NVIDIA', year: 2023, price: [299, 'USD'], alias: ['4060'],
      s: { arch: 'Ada Lovelace', shaders: 3072, boost: 2.46, vram: 8, memType: 'GDDR6', bus: 128, power: 115 } },
    { id: 'rx-9070-xt', name: 'Radeon RX 9070 XT', brand: 'AMD', year: 2025, price: [599, 'USD'], alias: ['9070 xt'],
      s: { arch: 'RDNA 4', shaders: 4096, boost: 2.97, vram: 16, memType: 'GDDR6', bus: 256, power: 304 } },
    { id: 'rx-7900-xtx', name: 'Radeon RX 7900 XTX', brand: 'AMD', year: 2022, price: [999, 'USD'], alias: ['7900 xtx'],
      s: { arch: 'RDNA 3', shaders: 6144, boost: 2.5, vram: 24, memType: 'GDDR6', bus: 384, power: 355 } },
    { id: 'rx-7800-xt', name: 'Radeon RX 7800 XT', brand: 'AMD', year: 2023, price: [499, 'USD'], alias: ['7800 xt'],
      s: { arch: 'RDNA 3', shaders: 3840, boost: 2.43, vram: 16, memType: 'GDDR6', bus: 256, power: 263 } }
  ]
});
