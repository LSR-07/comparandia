/*
 * CATÁLOGO DE CATEGORÍAS — COMPARANDIA
 * ------------------------------------------------------------
 * Para añadir una categoría nueva basta con añadir una línea aquí:
 *   { id: 'slug-unico', name: 'Nombre visible', icon: 'nombre-icono' }
 * Si además tiene productos, indica `data: 'archivo'` y crea
 * data/products/archivo.js (ver README.md). Nada más que tocar.
 * Varias categorías pueden compartir el mismo archivo de datos.
 */
window.CT = window.CT || {};

CT.groups = [
  {
    id: 'tecnologia', name: 'Tecnología', icon: 'cpu', hue: 255,
    categories: [
      { id: 'moviles', name: 'Teléfonos móviles', icon: 'phone', data: 'moviles' },
      { id: 'portatiles', name: 'Ordenadores portátiles', icon: 'laptop', data: 'portatiles' },
      { id: 'sobremesa', name: 'Ordenadores de sobremesa', icon: 'desktop' },
      { id: 'tablets', name: 'Tablets', icon: 'tablet', data: 'tablets' },
      { id: 'smartwatches', name: 'Smartwatches', icon: 'watch', data: 'smartwatches' },
      { id: 'auriculares', name: 'Auriculares', icon: 'headphones', data: 'auriculares' },
      { id: 'altavoces', name: 'Altavoces', icon: 'speaker' },
      { id: 'televisores', name: 'Televisores', icon: 'tv' },
      { id: 'monitores', name: 'Monitores', icon: 'desktop' },
      { id: 'camaras', name: 'Cámaras', icon: 'camera' },
      { id: 'teclados', name: 'Teclados', icon: 'keyboard' },
      { id: 'ratones', name: 'Ratones', icon: 'mouse' },
      { id: 'impresoras', name: 'Impresoras', icon: 'printer' },
      { id: 'tarjetas-graficas', name: 'Tarjetas gráficas', icon: 'gpu', data: 'tarjetas-graficas' },
      { id: 'procesadores', name: 'Procesadores', icon: 'cpu', data: 'procesadores' },
      { id: 'discos-duros', name: 'Discos duros y SSD', icon: 'disk' },
      { id: 'routers', name: 'Routers', icon: 'router' },
      { id: 'proyectores', name: 'Proyectores', icon: 'projector' },
      { id: 'drones', name: 'Drones', icon: 'drone' }
    ]
  },
  {
    id: 'moda', name: 'Moda', icon: 'shirt', hue: 330,
    categories: [
      { id: 'zapatillas-deportivas', name: 'Zapatillas deportivas', icon: 'shoe' },
      { id: 'zapatillas-casual', name: 'Zapatillas casual', icon: 'shoe' },
      { id: 'camisetas', name: 'Camisetas', icon: 'shirt' },
      { id: 'sudaderas', name: 'Sudaderas', icon: 'shirt' },
      { id: 'pantalones', name: 'Pantalones', icon: 'pants' },
      { id: 'chaquetas', name: 'Chaquetas', icon: 'shirt' },
      { id: 'abrigos', name: 'Abrigos', icon: 'shirt' },
      { id: 'relojes', name: 'Relojes', icon: 'watch' },
      { id: 'gafas-de-sol', name: 'Gafas de sol', icon: 'glasses' },
      { id: 'mochilas', name: 'Mochilas', icon: 'backpack' },
      { id: 'bolsos', name: 'Bolsos', icon: 'bag' },
      { id: 'perfumes', name: 'Perfumes', icon: 'perfume' },
      { id: 'accesorios-moda', name: 'Accesorios', icon: 'sparkle' }
    ]
  },
  {
    id: 'videojuegos', name: 'Videojuegos', icon: 'gamepad', hue: 150,
    categories: [
      { id: 'consolas', name: 'Consolas', icon: 'gamepad', data: 'consolas' },
      { id: 'juegos', name: 'Videojuegos', icon: 'disc' },
      { id: 'mandos', name: 'Mandos', icon: 'gamepad' },
      { id: 'sillas-gaming', name: 'Sillas gaming', icon: 'chair' },
      { id: 'auriculares-gaming', name: 'Auriculares gaming', icon: 'headphones' },
      { id: 'teclados-gaming', name: 'Teclados gaming', icon: 'keyboard' },
      { id: 'ratones-gaming', name: 'Ratones gaming', icon: 'mouse' },
      { id: 'monitores-gaming', name: 'Monitores gaming', icon: 'desktop' },
      { id: 'pc-gaming', name: 'Ordenadores gaming', icon: 'desktop' },
      { id: 'accesorios-gaming', name: 'Accesorios gaming', icon: 'sparkle' }
    ]
  },
  {
    id: 'motor', name: 'Motor y movilidad', icon: 'car', hue: 25,
    categories: [
      { id: 'coches', name: 'Coches', icon: 'car' },
      { id: 'coches-electricos', name: 'Coches eléctricos', icon: 'bolt' },
      { id: 'motos', name: 'Motos', icon: 'moto' },
      { id: 'bicicletas', name: 'Bicicletas', icon: 'bike' },
      { id: 'bicicletas-electricas', name: 'Bicicletas eléctricas', icon: 'bike' },
      { id: 'patinetes', name: 'Patinetes eléctricos', icon: 'scooter' },
      { id: 'cascos', name: 'Cascos', icon: 'helmet' },
      { id: 'accesorios-vehiculos', name: 'Accesorios de vehículos', icon: 'wrench' }
    ]
  },
  {
    id: 'hogar', name: 'Hogar', icon: 'home', hue: 200,
    categories: [
      { id: 'aspiradoras', name: 'Aspiradoras', icon: 'vacuum' },
      { id: 'robots-aspiradores', name: 'Robots aspiradores', icon: 'robot' },
      { id: 'frigorificos', name: 'Frigoríficos', icon: 'fridge' },
      { id: 'lavadoras', name: 'Lavadoras', icon: 'washer' },
      { id: 'secadoras', name: 'Secadoras', icon: 'washer' },
      { id: 'microondas', name: 'Microondas', icon: 'oven' },
      { id: 'hornos', name: 'Hornos', icon: 'oven' },
      { id: 'cafeteras', name: 'Cafeteras', icon: 'coffee' },
      { id: 'freidoras-de-aire', name: 'Freidoras de aire', icon: 'airfryer' },
      { id: 'aires-acondicionados', name: 'Aires acondicionados', icon: 'snow' },
      { id: 'ventiladores', name: 'Ventiladores', icon: 'fan' },
      { id: 'colchones', name: 'Colchones', icon: 'bed' },
      { id: 'sofas', name: 'Sofás', icon: 'sofa' },
      { id: 'escritorios', name: 'Escritorios', icon: 'desk' },
      { id: 'sillas-oficina', name: 'Sillas de oficina', icon: 'chair' }
    ]
  },
  {
    id: 'deporte', name: 'Deporte', icon: 'trophy', hue: 95,
    categories: [
      { id: 'zapatillas-running', name: 'Zapatillas de running', icon: 'shoe' },
      { id: 'bicicletas-deporte', name: 'Bicicletas', icon: 'bike' },
      { id: 'relojes-deportivos', name: 'Relojes deportivos', icon: 'watch', data: 'smartwatches' },
      { id: 'gimnasio', name: 'Equipamiento de gimnasio', icon: 'dumbbell' },
      { id: 'futbol', name: 'Material de fútbol', icon: 'ball' },
      { id: 'baloncesto', name: 'Material de baloncesto', icon: 'basket' },
      { id: 'padel', name: 'Material de pádel', icon: 'racket' },
      { id: 'ciclismo', name: 'Material de ciclismo', icon: 'helmet' },
      { id: 'accesorios-deportivos', name: 'Accesorios deportivos', icon: 'sparkle' }
    ]
  },
  {
    id: 'belleza', name: 'Belleza y cuidado personal', icon: 'sparkle', hue: 300,
    categories: [
      { id: 'secadores', name: 'Secadores de pelo', icon: 'dryer' },
      { id: 'planchas', name: 'Planchas de pelo', icon: 'straightener' },
      { id: 'afeitadoras', name: 'Afeitadoras', icon: 'razor' },
      { id: 'cepillos-electricos', name: 'Cepillos eléctricos', icon: 'toothbrush' },
      { id: 'cuidado-facial', name: 'Cuidado facial', icon: 'face' },
      { id: 'maquillaje', name: 'Maquillaje', icon: 'lipstick' },
      { id: 'perfumes-belleza', name: 'Perfumes', icon: 'perfume' }
    ]
  },
  {
    id: 'otras', name: 'Otras categorías', icon: 'box', hue: 45,
    categories: [
      { id: 'juguetes', name: 'Juguetes', icon: 'toy' },
      { id: 'mascotas', name: 'Productos para mascotas', icon: 'paw' },
      { id: 'bebes', name: 'Productos para bebés', icon: 'baby' },
      { id: 'libros', name: 'Libros', icon: 'book' },
      { id: 'instrumentos', name: 'Instrumentos musicales', icon: 'music' },
      { id: 'material-escolar', name: 'Material escolar', icon: 'pencil' },
      { id: 'viaje', name: 'Accesorios de viaje', icon: 'suitcase' },
      { id: 'camping', name: 'Equipamiento de camping', icon: 'tent' }
    ]
  }
];

