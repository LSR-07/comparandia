/* Smartwatches y relojes deportivos — talla pequeña salvo que se indique. */
CT.registerData('smartwatches', {
  updated: '2026-10-15', // fecha de la última revisión de estos datos (se usa en el sitemap)
  schema: [
    { title: 'General', fields: [
      { k: 'size', label: 'Tamaño de caja', type: 'text' },
      { k: 'chip', label: 'Procesador', type: 'text' },
      { k: 'os', label: 'Sistema', type: 'text' }
    ]},
    { title: 'Autonomía y pantalla', fields: [
      { k: 'hours', label: 'Autonomía (fabricante)', unit: 'h', type: 'num', better: 'high', pro: 'Más autonomía declarada', con: 'Menos autonomía declarada', hint: 'Cada fabricante mide la autonomía con un uso distinto.' },
      { k: 'nits', label: 'Brillo máximo', unit: 'nits', type: 'num', better: 'high', pro: 'Pantalla más brillante', con: 'Pantalla menos brillante' }
    ]},
    { title: 'Diseño y sensores', fields: [
      { k: 'weight', label: 'Peso (caja)', unit: 'g', type: 'num', better: 'low', dec: 1, pro: 'Más ligero', con: 'Más pesado' },
      { k: 'water', label: 'Resistencia al agua', type: 'rank', order: ['5 ATM', '10 ATM'], better: 'high', pro: 'Mayor resistencia al agua', con: 'Menor resistencia al agua' },
      { k: 'gps', label: 'GPS integrado', type: 'bool', better: 'high' },
      { k: 'ecg', label: 'Electrocardiograma (ECG)', type: 'bool', better: 'high', pro: 'Incluye ECG', con: 'Sin ECG' }
    ]}
  ],
  products: [
    { id: 'apple-watch-s9', name: 'Apple Watch Series 9', brand: 'Apple', year: 2023, price: [399, 'USD'],
      s: { size: '41 mm (también 45 mm)', chip: 'Apple S9 SiP', os: 'watchOS', hours: 18, nits: 2000, weight: 31.9, water: '5 ATM', gps: true, ecg: true } },
    { id: 'apple-watch-s10', name: 'Apple Watch Series 10', brand: 'Apple', year: 2024, price: [399, 'USD'],
      s: { size: '42 mm (también 46 mm)', chip: 'Apple S10 SiP', os: 'watchOS', hours: 18, nits: 2000, weight: 30, water: '5 ATM', gps: true, ecg: true } },
    { id: 'apple-watch-ultra-2', name: 'Apple Watch Ultra 2', brand: 'Apple', year: 2023, price: [799, 'USD'],
      s: { size: '49 mm', chip: 'Apple S9 SiP', os: 'watchOS', hours: 36, nits: 3000, weight: 61.4, water: '10 ATM', gps: true, ecg: true } },
    { id: 'galaxy-watch6', name: 'Galaxy Watch6', brand: 'Samsung', year: 2023, price: [299, 'USD'],
      s: { size: '40 mm (también 44 mm)', chip: 'Exynos W930', os: 'Wear OS', hours: 40, nits: 2000, weight: 28.7, water: '5 ATM', gps: true, ecg: true } },
    { id: 'pixel-watch-2', name: 'Pixel Watch 2', brand: 'Google', year: 2023, price: [349, 'USD'],
      s: { size: '41 mm', chip: 'Snapdragon W5 Gen 1', os: 'Wear OS', hours: 24, nits: 1000, weight: 31, water: '5 ATM', gps: true, ecg: true } },
    { id: 'forerunner-265', name: 'Forerunner 265', brand: 'Garmin', year: 2023, price: [449.99, 'USD'],
      s: { size: '46 mm (265S: 42 mm)', chip: null, os: 'Garmin OS', hours: 312, nits: null, weight: 47, water: '5 ATM', gps: true, ecg: false },
      n: { hours: 'Hasta 13 días en modo smartwatch, según Garmin.', chip: 'Garmin no publica el procesador.', nits: 'Garmin no publica el brillo máximo.' } }
  ]
});
