/* Auriculares — autonomía con cancelación de ruido activada (dato del fabricante). */
CT.registerData('auriculares', {
  updated: '2026-10-15', // fecha de la última revisión de estos datos (se usa en el sitemap)
  schema: [
    { title: 'General', fields: [
      { k: 'type', label: 'Formato', type: 'text' },
      { k: 'anc', label: 'Cancelación activa de ruido', type: 'bool', better: 'high', pro: 'Con cancelación de ruido', con: 'Sin cancelación de ruido' },
      { k: 'chip', label: 'Chip', type: 'text' }
    ]},
    { title: 'Autonomía', fields: [
      { k: 'hours', label: 'Autonomía por carga', unit: 'h', type: 'num', better: 'high', pro: 'Más autonomía por carga', con: 'Menos autonomía por carga' },
      { k: 'total', label: 'Autonomía total con estuche', unit: 'h', type: 'num', better: 'high', pro: 'Más autonomía total', con: 'Menos autonomía total' }
    ]},
    { title: 'Diseño y conexión', fields: [
      { k: 'weight', label: 'Peso', unit: 'g', type: 'num', better: 'low', dec: 2, pro: 'Más ligeros', con: 'Más pesados', hint: 'In-ear: peso de cada auricular. Diadema: peso total.' },
      { k: 'ip', label: 'Resistencia', type: 'rank', order: ['IPX4', 'IP54', 'IPX7'], better: 'high', pro: 'Mejor resistencia al agua', con: 'Peor resistencia al agua' },
      { k: 'bt', label: 'Bluetooth', type: 'num', better: 'high', dec: 1 },
      { k: 'codecs', label: 'Códecs', type: 'text' }
    ]}
  ],
  products: [
    { id: 'airpods-pro-2', name: 'AirPods Pro (2.ª gen., USB-C)', brand: 'Apple', year: 2023, price: [249, 'USD'], alias: ['airpods pro 2'],
      s: { type: 'In-ear (true wireless)', anc: true, chip: 'Apple H2', hours: 6, total: 30, weight: 5.3, ip: 'IP54', bt: 5.3, codecs: 'AAC' } },
    { id: 'airpods-4-anc', name: 'AirPods 4 con cancelación de ruido', brand: 'Apple', year: 2024, price: [179, 'USD'], alias: ['airpods 4'],
      s: { type: 'Semi in-ear (true wireless)', anc: true, chip: 'Apple H2', hours: 4, total: 20, weight: null, ip: 'IP54', bt: 5.3, codecs: 'AAC' },
      n: { weight: 'Sin dato verificado.' } },
    { id: 'airpods-max', name: 'AirPods Max', brand: 'Apple', year: 2020, price: [549, 'USD'],
      s: { type: 'Diadema (over-ear)', anc: true, chip: 'Apple H1', hours: 20, total: null, weight: 384.8, ip: null, bt: 5.0, codecs: 'AAC' },
      n: { total: 'No aplica: sin estuche de carga.', ip: 'Sin certificación IP.' } },
    { id: 'sony-wf-1000xm5', name: 'WF-1000XM5', brand: 'Sony', year: 2023, price: [299.99, 'USD'],
      s: { type: 'In-ear (true wireless)', anc: true, chip: 'Sony V2 + QN2e', hours: 8, total: 24, weight: 5.9, ip: 'IPX4', bt: 5.3, codecs: 'SBC, AAC, LDAC, LC3' } },
    { id: 'sony-wh-1000xm5', name: 'WH-1000XM5', brand: 'Sony', year: 2022, price: [399.99, 'USD'],
      s: { type: 'Diadema (over-ear)', anc: true, chip: 'Sony V1 + QN1', hours: 30, total: null, weight: 250, ip: null, bt: 5.2, codecs: 'SBC, AAC, LDAC' },
      n: { total: 'No aplica: sin estuche de carga.', ip: 'Sin certificación IP.' } },
    { id: 'galaxy-buds2-pro', name: 'Galaxy Buds2 Pro', brand: 'Samsung', year: 2022, price: [229.99, 'USD'],
      s: { type: 'In-ear (true wireless)', anc: true, chip: null, hours: 5, total: 18, weight: 5.5, ip: 'IPX7', bt: 5.3, codecs: 'SBC, AAC, Samsung Seamless' } },
    { id: 'bose-qc-ultra-earbuds', name: 'QuietComfort Ultra Earbuds', brand: 'Bose', year: 2023, price: [299, 'USD'],
      s: { type: 'In-ear (true wireless)', anc: true, chip: null, hours: 6, total: 24, weight: 6.24, ip: 'IPX4', bt: 5.3, codecs: 'SBC, AAC, aptX Adaptive' } }
  ]
});
