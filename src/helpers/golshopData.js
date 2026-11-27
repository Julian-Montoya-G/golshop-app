export const ART = {
  colombia: { base: '#F7C600', secondary: '#F7C600', trim: '#1D3C8F', pattern: 'solid' },
  nacional: { base: '#FFFFFF', secondary: '#0B8A3E', trim: '#0B8A3E', pattern: 'stripes' },
  balon: { base: '#FFFFFF', secondary: '#0F1F18', trim: '#1FB35A', pattern: 'ball' },
}

export const SIZES = ['S', 'M', 'L', 'XL']

export const TEAM_FILTERS = [
  'Todos',
  'Colombia',
  'Atlético Nacional',
  'Millonarios',
  'América de Cali',
  'Real Madrid',
  'FC Barcelona',
  'Argentina',
  'Boca Juniors',
  'Accesorios',
]

export const formatCOP = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

// Productos de ejemplo: se cargan a Firestore desde el panel de admin
export const PRODUCTS = [
  {
    id: 'colombia-local-2026',
    name: 'Camiseta Local 2026',
    team: 'Colombia',
    category: 'Camiseta',
    price: 329900,
    oldPrice: 389900,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 24,
    rating: 4.9,
    badge: 'Mundial',
    description:
      'La amarilla de la Selección para el Mundial 2026. Tela transpirable de secado rápido y escudo bordado.',
    art: { base: '#F7C600', secondary: '#F7C600', trim: '#1D3C8F', pattern: 'solid' },
  },
  {
    id: 'real-madrid-local',
    name: 'Camiseta Local 25/26',
    team: 'Real Madrid',
    category: 'Camiseta',
    price: 359900,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 12,
    rating: 4.8,
    badge: 'Top ventas',
    description: 'Blanco clásico con detalles dorados. Corte ajustado tipo jugador.',
    art: { base: '#F5F5F0', secondary: '#F5F5F0', trim: '#C9A227', pattern: 'solid' },
  },
  {
    id: 'barcelona-local',
    name: 'Camiseta Local 25/26',
    team: 'FC Barcelona',
    category: 'Camiseta',
    price: 349900,
    sizes: ['M', 'L', 'XL'],
    stock: 9,
    rating: 4.7,
    description: 'Las franjas blaugrana de siempre con tecnología de ventilación.',
    art: { base: '#A50044', secondary: '#004D98', trim: '#EDBB00', pattern: 'stripes' },
  },
  {
    id: 'nacional-local',
    name: 'Camiseta Local 2026',
    team: 'Atlético Nacional',
    category: 'Camiseta',
    price: 249900,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    rating: 4.9,
    badge: 'Nuevo',
    description: 'El verde y blanco del Verdolaga. Edición oficial Liga BetPlay.',
    art: { base: '#FFFFFF', secondary: '#0B8A3E', trim: '#0B8A3E', pattern: 'stripes' },
  },
  {
    id: 'millonarios-local',
    name: 'Camiseta Local 2026',
    team: 'Millonarios',
    category: 'Camiseta',
    price: 239900,
    sizes: ['S', 'M', 'L'],
    stock: 4,
    rating: 4.6,
    description: 'Azul embajador con cuello en V blanco. Edición oficial.',
    art: { base: '#1846A3', secondary: '#1846A3', trim: '#FFFFFF', pattern: 'solid' },
  },
  {
    id: 'argentina-local',
    name: 'Camiseta Local 2026',
    team: 'Argentina',
    category: 'Camiseta',
    price: 339900,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    rating: 4.8,
    description: 'Las franjas celestes y blancas de la campeona del mundo.',
    art: { base: '#FFFFFF', secondary: '#6CACE4', trim: '#1B2A4A', pattern: 'stripes' },
  },
  {
    id: 'boca-local',
    name: 'Camiseta Local 25/26',
    team: 'Boca Juniors',
    category: 'Camiseta',
    price: 299900,
    sizes: ['M', 'L', 'XL'],
    stock: 7,
    rating: 4.7,
    description: 'Azul y oro con la franja horizontal que la hace única.',
    art: { base: '#0B2A6F', secondary: '#F2B705', trim: '#F2B705', pattern: 'band' },
  },
  {
    id: 'america-local',
    name: 'Camiseta Local 2026',
    team: 'América de Cali',
    category: 'Camiseta',
    price: 239900,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 18,
    rating: 4.6,
    description: 'El rojo de la Mechita, con banda diagonal en el pecho.',
    art: { base: '#C8102E', secondary: '#8A0A1F', trim: '#FFFFFF', pattern: 'sash' },
  },
  {
    id: 'balon-mundial',
    name: 'Balón Oficial Mundial 2026',
    team: 'Accesorios',
    category: 'Accesorio',
    price: 189900,
    sizes: ['Única'],
    stock: 40,
    rating: 4.9,
    description: 'Balón talla 5 con costura térmica, ideal para cancha sintética y natural.',
    art: { base: '#FFFFFF', secondary: '#0F1F18', trim: '#1FB35A', pattern: 'ball' },
  },
  {
    id: 'bufanda-nacional',
    name: 'Bufanda Verdolaga',
    team: 'Accesorios',
    category: 'Accesorio',
    price: 69900,
    sizes: ['Única'],
    stock: 52,
    rating: 4.5,
    description: 'Bufanda tejida para alentar en el Atanasio Girardot.',
    art: { base: '#0B8A3E', secondary: '#FFFFFF', trim: '#0B8A3E', pattern: 'scarf' },
  },
]

export const SHIPPING_COST = 12000
export const FREE_SHIPPING_FROM = 400000

export const shippingFor = (subtotal) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST