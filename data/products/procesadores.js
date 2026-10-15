/* Procesadores de sobremesa — especificaciones oficiales de Intel y AMD. */
CT.registerData('procesadores', {
  updated: '2026-10-15', // fecha de la última revisión de estos datos (se usa en el sitemap)
  schema: [
    { title: 'Núcleos y frecuencia', fields: [
      { k: 'cores', label: 'Núcleos', type: 'num', better: 'high', pro: 'Más núcleos', con: 'Menos núcleos' },
      { k: 'coreMix', label: 'Configuración', type: 'text' },
      { k: 'threads', label: 'Hilos', type: 'num', better: 'high', pro: 'Más hilos', con: 'Menos hilos' },
      { k: 'boost', label: 'Frecuencia máxima', unit: 'GHz', type: 'num', better: 'high', dec: 1, pro: 'Mayor frecuencia máxima', con: 'Menor frecuencia máxima' }
    ]},
    { title: 'Memoria caché y consumo', fields: [
      { k: 'l3', label: 'Caché L3', unit: 'MB', type: 'num', better: 'high', pro: 'Más caché L3', con: 'Menos caché L3' },
      { k: 'tdp', label: 'TDP base', unit: 'W', type: 'num', better: 'low', pro: 'Menor consumo base', con: 'Mayor consumo base' }
    ]},
    { title: 'Plataforma', fields: [
      { k: 'socket', label: 'Socket', type: 'text' },
      { k: 'igpu', label: 'Gráficos integrados', type: 'bool', better: 'high', pro: 'Incluye gráficos integrados', con: 'Sin gráficos integrados' }
    ]}
  ],
  products: [
    { id: 'core-i9-14900k', name: 'Core i9-14900K', brand: 'Intel', year: 2023, price: [589, 'USD'], alias: ['14900k'],
      s: { cores: 24, coreMix: '8 P + 16 E', threads: 32, boost: 6.0, l3: 36, tdp: 125, socket: 'LGA 1700', igpu: true } },
    { id: 'core-i5-14600k', name: 'Core i5-14600K', brand: 'Intel', year: 2023, price: [319, 'USD'], alias: ['14600k'],
      s: { cores: 14, coreMix: '6 P + 8 E', threads: 20, boost: 5.3, l3: 24, tdp: 125, socket: 'LGA 1700', igpu: true } },
    { id: 'core-ultra-9-285k', name: 'Core Ultra 9 285K', brand: 'Intel', year: 2024, price: [589, 'USD'], alias: ['285k'],
      s: { cores: 24, coreMix: '8 P + 16 E', threads: 24, boost: 5.7, l3: 36, tdp: 125, socket: 'LGA 1851', igpu: true } },
    { id: 'ryzen-9-9950x', name: 'Ryzen 9 9950X', brand: 'AMD', year: 2024, price: [649, 'USD'], alias: ['9950x'],
      s: { cores: 16, coreMix: '16 Zen 5', threads: 32, boost: 5.7, l3: 64, tdp: 170, socket: 'AM5', igpu: true } },
    { id: 'ryzen-9-7950x', name: 'Ryzen 9 7950X', brand: 'AMD', year: 2022, price: [699, 'USD'], alias: ['7950x'],
      s: { cores: 16, coreMix: '16 Zen 4', threads: 32, boost: 5.7, l3: 64, tdp: 170, socket: 'AM5', igpu: true } },
    { id: 'ryzen-7-9800x3d', name: 'Ryzen 7 9800X3D', brand: 'AMD', year: 2024, price: [479, 'USD'], alias: ['9800x3d'],
      s: { cores: 8, coreMix: '8 Zen 5 + 3D V-Cache', threads: 16, boost: 5.2, l3: 96, tdp: 120, socket: 'AM5', igpu: true } },
    { id: 'ryzen-7-7800x3d', name: 'Ryzen 7 7800X3D', brand: 'AMD', year: 2023, price: [449, 'USD'], alias: ['7800x3d'],
      s: { cores: 8, coreMix: '8 Zen 4 + 3D V-Cache', threads: 16, boost: 5.0, l3: 96, tdp: 120, socket: 'AM5', igpu: true } },
    { id: 'ryzen-5-7600x', name: 'Ryzen 5 7600X', brand: 'AMD', year: 2022, price: [299, 'USD'], alias: ['7600x'],
      s: { cores: 6, coreMix: '6 Zen 4', threads: 12, boost: 5.3, l3: 32, tdp: 105, socket: 'AM5', igpu: true } }
  ]
});
