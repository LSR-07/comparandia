/*
 * Teléfonos móviles — especificaciones oficiales de los fabricantes.
 * null = el fabricante no publica el dato o no está verificado.
 * Precio: PVP oficial de lanzamiento del modelo base.
 */
CT.registerData('moviles', {
  updated: '2026-10-15', // fecha de la última revisión de estos datos (se usa en el sitemap)
  schema: [
    { title: 'Pantalla', fields: [
      { k: 'screen', label: 'Tamaño de pantalla', unit: '″', type: 'num', dec: 2 },
      { k: 'refresh', label: 'Tasa de refresco máxima', unit: 'Hz', type: 'num', better: 'high', pro: 'Pantalla más fluida', con: 'Pantalla menos fluida' },
      { k: 'res', label: 'Resolución', type: 'text' }
    ]},
    { title: 'Rendimiento', fields: [
      { k: 'chip', label: 'Procesador', type: 'text' },
      { k: 'ram', label: 'Memoria RAM', unit: 'GB', type: 'num', better: 'high', pro: 'Más memoria RAM', con: 'Menos memoria RAM' },
      { k: 'storage', label: 'Almacenamiento base', unit: 'GB', type: 'num', better: 'high', pro: 'Más almacenamiento de serie', con: 'Menos almacenamiento de serie' }
    ]},
    { title: 'Cámaras', fields: [
      { k: 'mainCam', label: 'Cámara principal', unit: 'MP', type: 'num', better: 'high', pro: 'Sensor principal con más megapíxeles', con: 'Sensor principal con menos megapíxeles', hint: 'Más megapíxeles no implica siempre mejores fotos.' },
      { k: 'rearCams', label: 'Cámaras traseras', type: 'num', better: 'high', pro: 'Más cámaras traseras', con: 'Menos cámaras traseras' },
      { k: 'tele', label: 'Zoom óptico (teleobjetivo)', unit: '×', type: 'num', better: 'high', zero: 'Sin teleobjetivo', pro: 'Mayor zoom óptico', con: 'Menor zoom óptico' },
      { k: 'frontCam', label: 'Cámara frontal', unit: 'MP', type: 'num', better: 'high', pro: 'Cámara de selfies con más resolución', con: 'Cámara de selfies con menos resolución' }
    ]},
    { title: 'Batería', fields: [
      { k: 'battery', label: 'Capacidad de batería', unit: 'mAh', type: 'num', better: 'high', pro: 'Batería de mayor capacidad', con: 'Batería de menor capacidad', hint: 'La autonomía real depende también de la eficiencia del procesador.' },
      { k: 'charge', label: 'Carga rápida por cable', unit: 'W', type: 'num', better: 'high', pro: 'Carga más rápida', con: 'Carga más lenta' }
    ]},
    { title: 'Diseño', fields: [
      { k: 'weight', label: 'Peso', unit: 'g', type: 'num', better: 'low', dec: 1, pro: 'Más ligero', con: 'Más pesado' },
      { k: 'ip', label: 'Resistencia al agua y polvo', type: 'rank', order: ['IP54', 'IP65', 'IP67', 'IP68'], better: 'high', pro: 'Mejor protección IP', con: 'Peor protección IP' }
    ]},
    { title: 'Conectividad y software', fields: [
      { k: 'g5', label: '5G', type: 'bool', better: 'high' },
      { k: 'port', label: 'Conector', type: 'text' },
      { k: 'os', label: 'Sistema de lanzamiento', type: 'text' }
    ]}
  ],
  products: [
    { id: 'iphone-13', name: 'iPhone 13', brand: 'Apple', year: 2021, price: [799, 'USD'],
      s: { screen: 6.1, refresh: 60, res: '2532 × 1170', chip: 'Apple A15 Bionic', ram: 4, storage: 128, mainCam: 12, rearCams: 2, tele: 0, frontCam: 12, battery: 3240, charge: null, weight: 174, ip: 'IP68', g5: true, port: 'Lightning', os: 'iOS 15' },
      n: { ram: 'Apple no publica la RAM; dato de análisis de desmontaje.', battery: 'Apple no publica los mAh; dato de registros regulatorios.', charge: 'Apple no publica la potencia máxima de carga por cable.' } },
    { id: 'iphone-15', name: 'iPhone 15', brand: 'Apple', year: 2023, price: [799, 'USD'],
      s: { screen: 6.1, refresh: 60, res: '2556 × 1179', chip: 'Apple A16 Bionic', ram: 6, storage: 128, mainCam: 48, rearCams: 2, tele: 0, frontCam: 12, battery: 3349, charge: null, weight: 171, ip: 'IP68', g5: true, port: 'USB-C', os: 'iOS 17' },
      n: { ram: 'Apple no publica la RAM; dato de análisis de desmontaje.', battery: 'Apple no publica los mAh; dato de registros regulatorios.', charge: 'Apple no publica la potencia máxima de carga por cable.' } },
    { id: 'iphone-15-pro', name: 'iPhone 15 Pro', brand: 'Apple', year: 2023, price: [999, 'USD'],
      s: { screen: 6.1, refresh: 120, res: '2556 × 1179', chip: 'Apple A17 Pro', ram: 8, storage: 128, mainCam: 48, rearCams: 3, tele: 3, frontCam: 12, battery: 3274, charge: null, weight: 187, ip: 'IP68', g5: true, port: 'USB-C', os: 'iOS 17' },
      n: { ram: 'Apple no publica la RAM; dato de análisis de desmontaje.', battery: 'Apple no publica los mAh; dato de registros regulatorios.', charge: 'Apple no publica la potencia máxima de carga por cable.' } },
    { id: 'iphone-16', name: 'iPhone 16', brand: 'Apple', year: 2024, price: [799, 'USD'],
      s: { screen: 6.1, refresh: 60, res: '2556 × 1179', chip: 'Apple A18', ram: 8, storage: 128, mainCam: 48, rearCams: 2, tele: 0, frontCam: 12, battery: 3561, charge: null, weight: 170, ip: 'IP68', g5: true, port: 'USB-C', os: 'iOS 18' },
      n: { ram: 'Apple no publica la RAM; dato de análisis de desmontaje.', battery: 'Apple no publica los mAh; dato de registros regulatorios.', charge: 'Apple no publica la potencia máxima de carga por cable.' } },
    { id: 'iphone-16-pro', name: 'iPhone 16 Pro', brand: 'Apple', year: 2024, price: [999, 'USD'],
      s: { screen: 6.3, refresh: 120, res: '2622 × 1206', chip: 'Apple A18 Pro', ram: 8, storage: 128, mainCam: 48, rearCams: 3, tele: 5, frontCam: 12, battery: 3582, charge: null, weight: 199, ip: 'IP68', g5: true, port: 'USB-C', os: 'iOS 18' },
      n: { ram: 'Apple no publica la RAM; dato de análisis de desmontaje.', battery: 'Apple no publica los mAh; dato de registros regulatorios.', charge: 'Apple no publica la potencia máxima de carga por cable.' } },
    { id: 'iphone-17', name: 'iPhone 17', brand: 'Apple', year: 2025, price: [799, 'USD'],
      s: { screen: 6.3, refresh: 120, res: '2622 × 1206', chip: 'Apple A19', ram: null, storage: 256, mainCam: 48, rearCams: 2, tele: 0, frontCam: 18, battery: null, charge: null, weight: 177, ip: 'IP68', g5: true, port: 'USB-C', os: 'iOS 26' },
      n: { battery: 'Sin dato verificado de capacidad en mAh.', charge: 'Apple no publica la potencia máxima de carga por cable.' } },
    { id: 'galaxy-s24', name: 'Galaxy S24', brand: 'Samsung', year: 2024, price: [799, 'USD'],
      s: { screen: 6.2, refresh: 120, res: '2340 × 1080', chip: 'Exynos 2400 (Europa) / Snapdragon 8 Gen 3 (EE. UU.)', ram: 8, storage: 128, mainCam: 50, rearCams: 3, tele: 3, frontCam: 12, battery: 4000, charge: 25, weight: 167, ip: 'IP68', g5: true, port: 'USB-C', os: 'Android 14 (One UI 6.1)' } },
    { id: 'galaxy-s24-ultra', name: 'Galaxy S24 Ultra', brand: 'Samsung', year: 2024, price: [1299, 'USD'],
      s: { screen: 6.8, refresh: 120, res: '3120 × 1440', chip: 'Snapdragon 8 Gen 3 for Galaxy', ram: 12, storage: 256, mainCam: 200, rearCams: 4, tele: 5, frontCam: 12, battery: 5000, charge: 45, weight: 232, ip: 'IP68', g5: true, port: 'USB-C', os: 'Android 14 (One UI 6.1)' } },
    { id: 'galaxy-s25', name: 'Galaxy S25', brand: 'Samsung', year: 2025, price: [799, 'USD'],
      s: { screen: 6.2, refresh: 120, res: '2340 × 1080', chip: 'Snapdragon 8 Elite for Galaxy', ram: 12, storage: 128, mainCam: 50, rearCams: 3, tele: 3, frontCam: 12, battery: 4000, charge: 25, weight: 162, ip: 'IP68', g5: true, port: 'USB-C', os: 'Android 15 (One UI 7)' } },
    { id: 'galaxy-a55', name: 'Galaxy A55 5G', brand: 'Samsung', year: 2024, price: null,
      s: { screen: 6.6, refresh: 120, res: '2340 × 1080', chip: 'Exynos 1480', ram: 8, storage: 128, mainCam: 50, rearCams: 3, tele: 0, frontCam: 32, battery: 5000, charge: 25, weight: 213, ip: 'IP67', g5: true, port: 'USB-C', os: 'Android 14 (One UI 6.1)' },
      n: { price: 'El precio varía según el país; sin PVP de referencia verificado.' } },
    { id: 'pixel-8', name: 'Pixel 8', brand: 'Google', year: 2023, price: [699, 'USD'],
      s: { screen: 6.2, refresh: 120, res: '2400 × 1080', chip: 'Google Tensor G3', ram: 8, storage: 128, mainCam: 50, rearCams: 2, tele: 0, frontCam: 10.5, battery: 4575, charge: 27, weight: 187, ip: 'IP68', g5: true, port: 'USB-C', os: 'Android 14' } },
    { id: 'pixel-8-pro', name: 'Pixel 8 Pro', brand: 'Google', year: 2023, price: [999, 'USD'],
      s: { screen: 6.7, refresh: 120, res: '2992 × 1344', chip: 'Google Tensor G3', ram: 12, storage: 128, mainCam: 50, rearCams: 3, tele: 5, frontCam: 10.5, battery: 5050, charge: 30, weight: 213, ip: 'IP68', g5: true, port: 'USB-C', os: 'Android 14' } },
    { id: 'pixel-9', name: 'Pixel 9', brand: 'Google', year: 2024, price: [799, 'USD'],
      s: { screen: 6.3, refresh: 120, res: '2424 × 1080', chip: 'Google Tensor G4', ram: 12, storage: 128, mainCam: 50, rearCams: 2, tele: 0, frontCam: 10.5, battery: 4700, charge: 27, weight: 198, ip: 'IP68', g5: true, port: 'USB-C', os: 'Android 14' } },
    { id: 'xiaomi-14', name: 'Xiaomi 14', brand: 'Xiaomi', year: 2024, price: [999, 'EUR'],
      s: { screen: 6.36, refresh: 120, res: '2670 × 1200', chip: 'Snapdragon 8 Gen 3', ram: 12, storage: 256, mainCam: 50, rearCams: 3, tele: 3.2, frontCam: 32, battery: 4610, charge: 90, weight: 193, ip: 'IP68', g5: true, port: 'USB-C', os: 'Android 14 (HyperOS)' },
      n: { price: 'No se vende oficialmente en EE. UU.; PVP de lanzamiento en Europa.' } },
    { id: 'nothing-phone-2', name: 'Phone (2)', brand: 'Nothing', year: 2023, price: [599, 'USD'], alias: ['nothing phone 2'],
      s: { screen: 6.7, refresh: 120, res: '2412 × 1080', chip: 'Snapdragon 8+ Gen 1', ram: 8, storage: 128, mainCam: 50, rearCams: 2, tele: 0, frontCam: 32, battery: 4700, charge: 45, weight: 201.2, ip: 'IP54', g5: true, port: 'USB-C', os: 'Android 13 (Nothing OS 2.0)' } }
  ]
});
