/*
 * CONFIGURACIÓN SEO — COMPARANDIA
 * ------------------------------------------------------------
 * Todo lo que afecta a Google se controla desde aquí.
 * Tras cambiar algo, vuelve a generar la web (ver README.md).
 */
window.CT = window.CT || {};

CT.site = {
  name: 'Comparandia',
  slogan: 'Compara todo. Elige mejor.',
  url: 'https://comparandia.com', // ← tu dominio real, sin barra final
  base: '/',                          // subcarpeta si la web no está en la raíz (p. ej. '/comparandia/')
  lang: 'es',
  locale: 'es_ES',
  updated: '2026-10-15',              // última revisión del catálogo y de las páginas generales

  // Google Search Console (opcional). Rellena UNO de los dos métodos de verificación:
  googleVerification: '',             // valor de content="" de la meta google-site-verification
  googleFile: '',                     // nombre del archivo HTML que da Google, p. ej. 'google1a2b3c.html'
  bingVerification: '',               // Bing Webmaster Tools (msvalidate.01), opcional

  // IndexNow: avisa a Bing (Edge), Yandex, Seznam y Naver de cada página nueva o
  // actualizada al publicar. Es una clave pública, no una contraseña.
  indexNowKey: '667fba8e4c90975a83663b73cb6a02f4'
};

/*
 * Reglas de calidad: una comparación solo genera página indexable si
 * aporta contenido real. Las demás siguen funcionando para el usuario,
 * pero con «noindex» y fuera del sitemap.
 */
CT.seoRules = {
  minDecided: 5,            // apartados con ganador objetivo, como mínimo
  minDiffering: 6,          // características en las que difieren, como mínimo
  minCompleteness: 0.75,    // proporción mínima de datos conocidos de cada producto
  maxPriceRatio: 2.5,       // no indexar enfrentamientos de gamas muy distintas (precio x2,5)
  maxYearGap: 4,            // si no hay precios comparables: diferencia máxima de años
  minProductCompleteness: 0.6
};

/*
 * Comparaciones populares (selección editorial: sin analítica de pago no
 * hay datos de tráfico; ordénalas según Search Console cuando los tengas).
 */
CT.popular = [
  ['iphone-16', 'galaxy-s25'],
  ['iphone-16', 'pixel-9'],
  ['iphone-15', 'iphone-16'],
  ['ps5-slim', 'xbox-series-x'],
  ['switch-2', 'switch-oled'],
  ['rtx-5080', 'rx-9070-xt'],
  ['rtx-4070-super', 'rx-7800-xt'],
  ['ryzen-7-9800x3d', 'core-ultra-9-285k'],
  ['macbook-air-m4', 'surface-laptop-7'],
  ['airpods-pro-2', 'sony-wf-1000xm5'],
  ['apple-watch-s10', 'galaxy-watch6'],
  ['ipad-air-11-m2', 'galaxy-tab-s9']
];

/*
 * Nuevas comparaciones: se calculan solas a partir de los modelos más
 * recientes. Aquí puedes forzar alguna con su fecha de publicación.
 */
CT.newComparisons = [
  { ids: ['iphone-17', 'galaxy-s25'], added: '2026-10-15' },
  { ids: ['switch-2', 'steam-deck-oled'], added: '2026-10-15' }
];

/*
 * Textos SEO de cada categoría: palabra clave, singular y una guía
 * original de compra. Sin guía, la página de categoría se genera igual.
 */
CT.catSeo = {
  moviles: {
    kw: 'móviles', one: 'móvil',
    guide: [
      ['Pantalla y fluidez', 'El tamaño importa por comodidad, pero la tasa de refresco se nota más en el día a día: a 120 Hz el desplazamiento por menús y webs es claramente más suave que a 60 Hz. La resolución apenas marca diferencias por encima de Full HD en pantallas de este tamaño.'],
      ['Batería y carga', 'La capacidad en mAh es una pista, no una garantía: la eficiencia del procesador y del software pesa tanto como la batería. Compara también la potencia de carga si sueles ir justo de tiempo.'],
      ['Cámaras', 'Los megapíxeles del sensor principal no lo dicen todo. Un teleobjetivo real (zoom óptico) sí es una ventaja objetiva para fotos de lejos y retratos.'],
      ['Durabilidad y actualizaciones', 'La certificación IP68 protege frente a polvo e inmersión en agua dulce según el fabricante. Revisa también cuántos años de actualizaciones promete cada marca.']
    ]
  },
  portatiles: {
    kw: 'portátiles', one: 'portátil',
    guide: [
      ['Procesador y memoria', 'Para ofimática y navegación sobra con cualquier procesador actual; para edición de vídeo o programación, prioriza más núcleos y al menos 16 GB de RAM, que en muchos modelos no se puede ampliar después.'],
      ['Pantalla', 'Una resolución alta mejora la nitidez del texto y los 120 Hz hacen más agradable el desplazamiento. Si trabajas al aire libre, busca brillo alto.'],
      ['Peso y batería', 'Por debajo de 1,4 kg un portátil se lleva sin notarlo a diario. La capacidad en Wh permite comparar baterías entre marcas mejor que las horas declaradas.'],
      ['Gráficos', 'Una gráfica dedicada solo compensa si juegas o usas programas 3D; a cambio, suele aumentar el peso y el consumo.']
    ]
  },
  tablets: {
    kw: 'tablets', one: 'tablet',
    guide: [
      ['Para qué la quieres', 'Para leer y ver series basta una pantalla de 60 Hz; para dibujar o tomar notas con lápiz, compara la compatibilidad con lápiz y la fluidez de la pantalla.'],
      ['Almacenamiento', 'Muchas tablets no admiten tarjetas de memoria: elige bien la capacidad desde el principio si vas a descargar contenido.'],
      ['Peso', 'Una diferencia de 100 g se nota mucho al sostenerla con una mano durante un rato.']
    ]
  },
  smartwatches: {
    kw: 'smartwatches', one: 'smartwatch',
    guide: [
      ['Compatibilidad', 'Antes que nada, comprueba que el reloj funcione con tu móvil: algunos solo se pueden usar con iPhone o con Android.'],
      ['Autonomía', 'Las horas declaradas se miden con usos distintos en cada marca. Úsalas como orientación y compara modelos de la misma marca para afinar.'],
      ['Salud y deporte', 'GPS integrado y electrocardiograma (ECG) son funciones objetivas que conviene comprobar si vas a entrenar sin el móvil o vigilar tu salud.']
    ]
  },
  'relojes-deportivos': {
    kw: 'relojes deportivos', one: 'reloj deportivo',
    guide: [
      ['GPS y autonomía', 'Para correr o montar en bici sin móvil, el GPS integrado es imprescindible. Los relojes de marcas deportivas suelen ofrecer más días de batería a cambio de menos funciones inteligentes.'],
      ['Resistencia al agua', 'Para nadar, 5 ATM suele ser suficiente; 10 ATM ofrece más margen para deportes acuáticos.']
    ]
  },
  auriculares: {
    kw: 'auriculares', one: 'auricular',
    guide: [
      ['Formato', 'Los in-ear son más cómodos de transportar; los de diadema suelen aislar mejor y ofrecer más autonomía.'],
      ['Cancelación de ruido', 'La cancelación activa de ruido marca la diferencia en transporte público y aviones. Compara también la autonomía con la cancelación activada, que es la que mostramos.'],
      ['Códecs y compatibilidad', 'Códecs como LDAC o aptX solo aportan si tu móvil también los admite. Con iPhone, el códec relevante es AAC.']
    ]
  },
  consolas: {
    kw: 'consolas', one: 'consola',
    guide: [
      ['Catálogo antes que potencia', 'Los juegos exclusivos de cada plataforma suelen pesar más que los TFLOPS a la hora de elegir.'],
      ['Formato', 'Las consolas portátiles permiten jugar fuera de casa; las de sobremesa ofrecen más potencia y resolución en la televisión.'],
      ['Almacenamiento y discos', 'Los juegos actuales ocupan mucho: compara el almacenamiento útil y si la consola admite discos, que permiten comprar juegos de segunda mano.']
    ]
  },
  'tarjetas-graficas': {
    kw: 'tarjetas gráficas', one: 'tarjeta gráfica',
    guide: [
      ['VRAM', 'Para jugar en 1440p o 4K con texturas altas, 12–16 GB de VRAM dan margen para los próximos años.'],
      ['Consumo y fuente', 'Comprueba que tu fuente de alimentación soporte el consumo de la tarjeta, con un margen razonable.'],
      ['Entre marcas', 'Los núcleos CUDA de NVIDIA y los Stream Processors de AMD no se comparan uno a uno: para el rendimiento real, consulta pruebas en juegos.']
    ]
  },
  procesadores: {
    kw: 'procesadores', one: 'procesador',
    guide: [
      ['Plataforma', 'El socket determina qué placas base puedes usar: Intel LGA 1700 y LGA 1851, y AMD AM5 no son intercambiables.'],
      ['Juegos frente a productividad', 'Los modelos con mucha caché L3 (como los X3D de AMD) destacan en juegos; para renderizar o compilar, cuentan más los núcleos y los hilos.'],
      ['Consumo', 'Un TDP más alto exige mejor refrigeración. Ten en cuenta el coste del disipador al comparar precios.']
    ]
  }
};
