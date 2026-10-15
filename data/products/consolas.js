/* Consolas — especificaciones oficiales. */
CT.registerData('consolas', {
  updated: '2026-10-15', // fecha de la última revisión de estos datos (se usa en el sitemap)
  schema: [
    { title: 'Potencia', fields: [
      { k: 'cpu', label: 'CPU', type: 'text' },
      { k: 'tflops', label: 'Potencia GPU', unit: 'TFLOPS', type: 'num', better: 'high', dec: 2, pro: 'GPU más potente', con: 'GPU menos potente', hint: 'Los TFLOPS solo son orientativos entre arquitecturas distintas.' },
      { k: 'ram', label: 'Memoria', unit: 'GB', type: 'num', better: 'high', pro: 'Más memoria', con: 'Menos memoria' },
      { k: 'storage', label: 'Almacenamiento', unit: 'GB', type: 'num', better: 'high', pro: 'Más almacenamiento', con: 'Menos almacenamiento' }
    ]},
    { title: 'Imagen', fields: [
      { k: 'maxres', label: 'Resolución máxima en TV', type: 'rank', order: ['1080p', '1440p', '4K'], better: 'high', pro: 'Mayor resolución de salida', con: 'Menor resolución de salida' },
      { k: 'screen', label: 'Pantalla integrada', type: 'text' }
    ]},
    { title: 'Formato', fields: [
      { k: 'disc', label: 'Lector de discos', type: 'bool', better: 'high', pro: 'Con lector de discos', con: 'Sin lector de discos' },
      { k: 'portable', label: 'Portátil', type: 'bool', better: 'high', pro: 'Se puede jugar en cualquier parte', con: 'No es portátil' },
      { k: 'weight', label: 'Peso', unit: 'kg', type: 'num', better: 'low', dec: 2, pro: 'Más ligera', con: 'Más pesada' }
    ]}
  ],
  products: [
    { id: 'ps5', name: 'PlayStation 5 (2020)', brand: 'Sony', year: 2020, price: [499.99, 'USD'], alias: ['ps5', 'play 5'],
      s: { cpu: 'AMD Zen 2, 8 núcleos, hasta 3,5 GHz', tflops: 10.28, ram: 16, storage: 825, maxres: '4K', screen: 'No', disc: true, portable: false, weight: 4.5 } },
    { id: 'ps5-slim', name: 'PlayStation 5 Slim', brand: 'Sony', year: 2023, price: [499.99, 'USD'], alias: ['ps5 slim'],
      s: { cpu: 'AMD Zen 2, 8 núcleos, hasta 3,5 GHz', tflops: 10.28, ram: 16, storage: 1000, maxres: '4K', screen: 'No', disc: true, portable: false, weight: 3.2 } },
    { id: 'ps5-pro', name: 'PlayStation 5 Pro', brand: 'Sony', year: 2024, price: [699.99, 'USD'], alias: ['ps5 pro'],
      s: { cpu: 'AMD Zen 2, 8 núcleos, hasta 3,85 GHz', tflops: 16.7, ram: 16, storage: 2000, maxres: '4K', screen: 'No', disc: false, portable: false, weight: null },
      n: { ram: '16 GB GDDR6 + 2 GB DDR5 adicionales para el sistema.', disc: 'Lector de discos opcional, se vende aparte.', weight: 'Sin dato verificado.' } },
    { id: 'xbox-series-x', name: 'Xbox Series X', brand: 'Microsoft', year: 2020, price: [499.99, 'USD'],
      s: { cpu: 'AMD Zen 2, 8 núcleos, 3,8 GHz', tflops: 12.15, ram: 16, storage: 1000, maxres: '4K', screen: 'No', disc: true, portable: false, weight: 4.45 } },
    { id: 'xbox-series-s', name: 'Xbox Series S', brand: 'Microsoft', year: 2020, price: [299.99, 'USD'],
      s: { cpu: 'AMD Zen 2, 8 núcleos, 3,6 GHz', tflops: 4, ram: 10, storage: 512, maxres: '1440p', screen: 'No', disc: false, portable: false, weight: 1.93 } },
    { id: 'switch-oled', name: 'Nintendo Switch (modelo OLED)', brand: 'Nintendo', year: 2021, price: [349.99, 'USD'], alias: ['switch oled'],
      s: { cpu: 'NVIDIA Tegra personalizado', tflops: null, ram: 4, storage: 64, maxres: '1080p', screen: '7″ OLED, 1280 × 720', disc: false, portable: true, weight: 0.42 },
      n: { tflops: 'Nintendo no publica la potencia de la GPU.', disc: 'Usa cartuchos.' } },
    { id: 'switch-2', name: 'Nintendo Switch 2', brand: 'Nintendo', year: 2025, price: [449.99, 'USD'],
      s: { cpu: 'NVIDIA personalizado', tflops: null, ram: null, storage: 256, maxres: '4K', screen: '7,9″ LCD, 1920 × 1080, 120 Hz', disc: false, portable: true, weight: 0.534 },
      n: { tflops: 'Nintendo no publica la potencia de la GPU.', ram: 'Nintendo no publica la memoria oficialmente.', disc: 'Usa cartuchos.' } },
    { id: 'steam-deck-oled', name: 'Steam Deck OLED (512 GB)', brand: 'Valve', year: 2023, price: [549, 'USD'], alias: ['steam deck'],
      s: { cpu: 'AMD Zen 2, 4 núcleos / 8 hilos', tflops: 1.6, ram: 16, storage: 512, maxres: null, screen: '7,4″ OLED, 1280 × 800, 90 Hz', disc: false, portable: true, weight: 0.64 },
      n: { maxres: 'La salida externa depende del juego y del dock; no hay valor oficial único.' } }
  ]
});
