/* Tablets — configuración base (Wi-Fi). */
CT.registerData('tablets', {
  updated: '2026-10-15', // fecha de la última revisión de estos datos (se usa en el sitemap)
  schema: [
    { title: 'Pantalla', fields: [
      { k: 'screen', label: 'Tamaño de pantalla', unit: '″', type: 'num', dec: 1 },
      { k: 'res', label: 'Resolución', type: 'text' },
      { k: 'refresh', label: 'Tasa de refresco máxima', unit: 'Hz', type: 'num', better: 'high', pro: 'Pantalla más fluida', con: 'Pantalla menos fluida' }
    ]},
    { title: 'Rendimiento', fields: [
      { k: 'chip', label: 'Procesador', type: 'text' },
      { k: 'ram', label: 'Memoria RAM', unit: 'GB', type: 'num', better: 'high', pro: 'Más memoria RAM', con: 'Menos memoria RAM' },
      { k: 'storage', label: 'Almacenamiento base', unit: 'GB', type: 'num', better: 'high', pro: 'Más almacenamiento de serie', con: 'Menos almacenamiento de serie' }
    ]},
    { title: 'Diseño y extras', fields: [
      { k: 'weight', label: 'Peso', unit: 'g', type: 'num', better: 'low', pro: 'Más ligera', con: 'Más pesada' },
      { k: 'port', label: 'Conector', type: 'text' },
      { k: 'pen', label: 'Lápiz compatible', type: 'text' },
      { k: 'os', label: 'Sistema operativo', type: 'text' }
    ]}
  ],
  products: [
    { id: 'ipad-10', name: 'iPad (10.ª generación)', brand: 'Apple', year: 2022, price: [449, 'USD'], alias: ['ipad 10'],
      s: { screen: 10.9, res: '2360 × 1640', refresh: 60, chip: 'Apple A14 Bionic', ram: null, storage: 64, weight: 477, port: 'USB-C', pen: 'Apple Pencil (USB-C) / 1.ª gen.', os: 'iPadOS' },
      n: { ram: 'Apple no publica la RAM de este modelo.' } },
    { id: 'ipad-mini-a17', name: 'iPad mini (A17 Pro)', brand: 'Apple', year: 2024, price: [499, 'USD'], alias: ['ipad mini 7'],
      s: { screen: 8.3, res: '2266 × 1488', refresh: 60, chip: 'Apple A17 Pro', ram: null, storage: 128, weight: 293, port: 'USB-C', pen: 'Apple Pencil Pro / USB-C', os: 'iPadOS' },
      n: { ram: 'Apple no publica la RAM de este modelo.' } },
    { id: 'ipad-air-11-m2', name: 'iPad Air 11″ (M2)', brand: 'Apple', year: 2024, price: [599, 'USD'], alias: ['ipad air m2'],
      s: { screen: 11, res: '2360 × 1640', refresh: 60, chip: 'Apple M2', ram: null, storage: 128, weight: 462, port: 'USB-C', pen: 'Apple Pencil Pro / USB-C', os: 'iPadOS' },
      n: { ram: 'Apple no publica la RAM de este modelo.' } },
    { id: 'ipad-pro-11-m4', name: 'iPad Pro 11″ (M4)', brand: 'Apple', year: 2024, price: [999, 'USD'], alias: ['ipad pro m4'],
      s: { screen: 11.1, res: '2420 × 1668 OLED', refresh: 120, chip: 'Apple M4', ram: 8, storage: 256, weight: 444, port: 'USB-C (Thunderbolt)', pen: 'Apple Pencil Pro / USB-C', os: 'iPadOS' } },
    { id: 'galaxy-tab-s9', name: 'Galaxy Tab S9', brand: 'Samsung', year: 2023, price: [799, 'USD'],
      s: { screen: 11, res: '2560 × 1600 AMOLED', refresh: 120, chip: 'Snapdragon 8 Gen 2 for Galaxy', ram: 8, storage: 128, weight: 498, port: 'USB-C', pen: 'S Pen (incluido)', os: 'Android' } },
    { id: 'galaxy-tab-s9-fe', name: 'Galaxy Tab S9 FE', brand: 'Samsung', year: 2023, price: [449, 'USD'],
      s: { screen: 10.9, res: '2304 × 1440', refresh: 90, chip: 'Exynos 1380', ram: 6, storage: 128, weight: 523, port: 'USB-C', pen: 'S Pen (incluido)', os: 'Android' } }
  ]
});
