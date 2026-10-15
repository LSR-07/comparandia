/* Ordenadores portátiles — configuración base de cada modelo. */
CT.registerData('portatiles', {
  updated: '2026-10-15', // fecha de la última revisión de estos datos (se usa en el sitemap)
  schema: [
    { title: 'Rendimiento', fields: [
      { k: 'cpu', label: 'Procesador', type: 'text' },
      { k: 'cores', label: 'Núcleos de CPU', type: 'num', better: 'high', pro: 'Más núcleos de CPU', con: 'Menos núcleos de CPU' },
      { k: 'gpu', label: 'Gráficos', type: 'text' },
      { k: 'ram', label: 'RAM base', unit: 'GB', type: 'num', better: 'high', pro: 'Más memoria RAM de serie', con: 'Menos memoria RAM de serie' },
      { k: 'storage', label: 'Almacenamiento base', unit: 'GB', type: 'num', better: 'high', pro: 'Más almacenamiento de serie', con: 'Menos almacenamiento de serie' }
    ]},
    { title: 'Pantalla', fields: [
      { k: 'screen', label: 'Tamaño de pantalla', unit: '″', type: 'num', dec: 1 },
      { k: 'res', label: 'Resolución', type: 'text' },
      { k: 'refresh', label: 'Tasa de refresco máxima', unit: 'Hz', type: 'num', better: 'high', pro: 'Pantalla más fluida', con: 'Pantalla menos fluida' }
    ]},
    { title: 'Portabilidad y batería', fields: [
      { k: 'weight', label: 'Peso', unit: 'kg', type: 'num', better: 'low', dec: 2, pro: 'Más ligero', con: 'Más pesado' },
      { k: 'wh', label: 'Batería', unit: 'Wh', type: 'num', better: 'high', dec: 1, pro: 'Batería de mayor capacidad', con: 'Batería de menor capacidad' },
      { k: 'os', label: 'Sistema operativo', type: 'text' }
    ]}
  ],
  products: [
    { id: 'macbook-air-m2', name: 'MacBook Air 13″ (M2)', brand: 'Apple', year: 2022, price: [1199, 'USD'], alias: ['macbook air m2'],
      s: { cpu: 'Apple M2', cores: 8, gpu: 'GPU integrada de 8 núcleos', ram: 8, storage: 256, screen: 13.6, res: '2560 × 1664', refresh: 60, weight: 1.24, wh: 52.6, os: 'macOS' } },
    { id: 'macbook-air-m3', name: 'MacBook Air 13″ (M3)', brand: 'Apple', year: 2024, price: [1099, 'USD'], alias: ['macbook air m3'],
      s: { cpu: 'Apple M3', cores: 8, gpu: 'GPU integrada de 8 núcleos', ram: 8, storage: 256, screen: 13.6, res: '2560 × 1664', refresh: 60, weight: 1.24, wh: 52.6, os: 'macOS' } },
    { id: 'macbook-air-m4', name: 'MacBook Air 13″ (M4)', brand: 'Apple', year: 2025, price: [999, 'USD'], alias: ['macbook air m4'],
      s: { cpu: 'Apple M4', cores: 10, gpu: 'GPU integrada de 8 núcleos', ram: 16, storage: 256, screen: 13.6, res: '2560 × 1664', refresh: 60, weight: 1.24, wh: 53.8, os: 'macOS' } },
    { id: 'macbook-pro-14-m4', name: 'MacBook Pro 14″ (M4)', brand: 'Apple', year: 2024, price: [1599, 'USD'], alias: ['macbook pro m4'],
      s: { cpu: 'Apple M4', cores: 10, gpu: 'GPU integrada de 10 núcleos', ram: 16, storage: 512, screen: 14.2, res: '3024 × 1964', refresh: 120, weight: 1.55, wh: 72.4, os: 'macOS' } },
    { id: 'surface-laptop-7', name: 'Surface Laptop 13,8″ (7.ª ed.)', brand: 'Microsoft', year: 2024, price: [999, 'USD'], alias: ['surface laptop 7'],
      s: { cpu: 'Snapdragon X Plus', cores: 10, gpu: 'Qualcomm Adreno', ram: 16, storage: 256, screen: 13.8, res: '2304 × 1536', refresh: 120, weight: 1.34, wh: 54, os: 'Windows 11' } },
    { id: 'rog-zephyrus-g14-2024', name: 'ROG Zephyrus G14 (2024)', brand: 'ASUS', year: 2024, price: [1599, 'USD'], alias: ['zephyrus g14'],
      s: { cpu: 'AMD Ryzen 9 8945HS', cores: 8, gpu: 'NVIDIA GeForce RTX 4060', ram: 16, storage: 1000, screen: 14, res: '2880 × 1800 OLED', refresh: 120, weight: 1.5, wh: 73, os: 'Windows 11' } }
  ]
});
