import { LS_KEYS } from './constants';

const SEED_PRODUCTS = [
  {
    id: 1,
    name: 'The Grain Crewneck',
    shortDesc: 'Ribbed paneling. Cotton-mesh bib. Oversized fit.',
    description: "A crewneck that earns a second look. Ribbed paneling down the sleeve catches light differently when you move. Cotton body, mesh panel at the bib — subtle enough to miss, interesting enough to notice. Oversized fit. Dropped shoulder. The kind of piece you throw on without thinking, and someone asks about anyway.",
    price: 2499,
    category: 'Tops',
    status: 'available',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/grain-crewneck.jpg',
    images: ['/images/grain-crewneck.jpg', '/images/ribbed-crewneck.jpg', '/images/slate-overshirt.jpg', '/images/dune-sweater.jpg'],
    fabric: {
      composition: '100% Cotton body, Cotton-mesh blend bib panel, Ribbed knit sleeves',
      care: 'Cold wash. Hang dry. Do not bleach. Iron on low if needed.',
    },
    shipping: 'Free shipping on prepaid orders. Delivery in 5-7 business days.',
    related: [2, 3],
  },
  {
    id: 2,
    name: 'The Slate Overshirt',
    shortDesc: 'Herringbone weave. Dropped shoulder. Raw hem.',
    description: "Built around a herringbone weave we couldn't stop touching. Dropped shoulder, raw hem at the bottom. Somewhere between a shirt and a jacket — exactly where we wanted it. Throw it over anything. It works.",
    price: 2999,
    category: 'Tops',
    status: 'available',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/slate-overshirt.jpg',
    images: ['/images/slate-overshirt.jpg', '/images/grain-crewneck.jpg', '/images/fog-knit-tee.jpg', '/images/ribbed-crewneck.jpg'],
    fabric: {
      composition: 'Herringbone weave cotton blend',
      care: 'Cold wash. Hang dry. Do not bleach.',
    },
    shipping: 'Free shipping on prepaid orders. Delivery in 5-7 business days.',
    related: [1, 3],
  },
  {
    id: 3,
    name: 'The Fog Knit Tee',
    shortDesc: 'Textured knit. Boxy cut. Subtle seam detail.',
    description: "A textured knit tee that feels like it's been in your wardrobe forever — from the first wear. Boxy cut, subtle seam detail at the shoulder. The kind of understated that gets noticed.",
    price: 1999,
    category: 'Knits',
    status: 'sold-out',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/fog-knit-tee.jpg',
    images: ['/images/fog-knit-tee.jpg', '/images/grain-crewneck.jpg', '/images/dune-sweater.jpg', '/images/ribbed-crewneck.jpg'],
    fabric: {
      composition: 'Textured cotton knit',
      care: 'Cold wash. Lay flat to dry.',
    },
    shipping: 'Free shipping on prepaid orders. Delivery in 5-7 business days.',
    related: [1, 2],
  },
  {
    id: 4,
    name: 'The Dune Sweater',
    shortDesc: 'Chunky ribbed knit. Neutral palette. Relaxed fit.',
    description: "Chunky ribbed knit in a neutral that goes with everything. Relaxed fit, slightly cropped. The fabric tells the whole story.",
    price: 3499,
    category: 'Knits',
    status: 'coming-soon',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/dune-sweater.jpg',
    images: ['/images/dune-sweater.jpg', '/images/ribbed-crewneck.jpg', '/images/grain-crewneck.jpg', '/images/slate-overshirt.jpg'],
    fabric: {
      composition: 'Chunky ribbed cotton-wool blend',
      care: 'Hand wash cold. Lay flat to dry.',
    },
    shipping: 'Free shipping on prepaid orders. Delivery in 5-7 business days.',
    related: [1, 2],
  },
];

const SEED_ORDERS = [
  {
    id: 'OOPS-M1A2B3',
    items: [
      { productId: 1, name: 'The Grain Crewneck', price: 2499, qty: 1, size: 'M', image: '/images/grain-crewneck.jpg' },
      { productId: 2, name: 'The Slate Overshirt', price: 2999, qty: 1, size: 'L', image: '/images/slate-overshirt.jpg' },
    ],
    shipping: {
      fullName: 'Aarav Sharma',
      phone: '9876543210',
      address1: 'Flat 402, Sunrise Apartments',
      address2: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    },
    paymentMethod: 'prepaid',
    total: 5498,
    status: 'delivered',
    date: '2026-04-10T14:23:00.000Z',
  },
  {
    id: 'OOPS-N4C5D6',
    items: [
      { productId: 3, name: 'The Fog Knit Tee', price: 1999, qty: 2, size: 'S', image: '/images/fog-knit-tee.jpg' },
    ],
    shipping: {
      fullName: 'Priya Patel',
      phone: '8765432109',
      address1: '12, Green Valley Society',
      address2: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
    },
    paymentMethod: 'cod',
    total: 4047,
    status: 'shipped',
    date: '2026-04-16T09:15:00.000Z',
  },
  {
    id: 'OOPS-P7E8F9',
    items: [
      { productId: 1, name: 'The Grain Crewneck', price: 2499, qty: 1, size: 'XL', image: '/images/grain-crewneck.jpg' },
    ],
    shipping: {
      fullName: 'Rohan Verma',
      phone: '7654321098',
      address1: 'B-23, Sector 62',
      address2: 'Near City Mall',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
    },
    paymentMethod: 'prepaid',
    total: 2499,
    status: 'processing',
    date: '2026-04-19T18:45:00.000Z',
  },
  {
    id: 'OOPS-Q1G2H3',
    items: [
      { productId: 2, name: 'The Slate Overshirt', price: 2999, qty: 1, size: 'M', image: '/images/slate-overshirt.jpg' },
      { productId: 1, name: 'The Grain Crewneck', price: 2499, qty: 1, size: 'M', image: '/images/grain-crewneck.jpg' },
    ],
    shipping: {
      fullName: 'Aarav Sharma',
      phone: '9876543210',
      address1: 'Flat 402, Sunrise Apartments',
      address2: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    },
    paymentMethod: 'prepaid',
    total: 5498,
    status: 'placed',
    date: '2026-04-21T11:30:00.000Z',
  },
  {
    id: 'OOPS-R4J5K6',
    items: [
      { productId: 3, name: 'The Fog Knit Tee', price: 1999, qty: 1, size: 'M', image: '/images/fog-knit-tee.jpg' },
      { productId: 2, name: 'The Slate Overshirt', price: 2999, qty: 1, size: 'S', image: '/images/slate-overshirt.jpg' },
    ],
    shipping: {
      fullName: 'Ananya Iyer',
      phone: '6543210987',
      address1: '8, Radhakrishnan Nagar',
      address2: 'T. Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
    },
    paymentMethod: 'cod',
    total: 5047,
    status: 'out-for-delivery',
    date: '2026-04-14T07:00:00.000Z',
  },
  {
    id: 'OOPS-S7L8M9',
    items: [
      { productId: 1, name: 'The Grain Crewneck', price: 2499, qty: 2, size: 'L', image: '/images/grain-crewneck.jpg' },
    ],
    shipping: {
      fullName: 'Kabir Singh',
      phone: '5432109876',
      address1: 'Plot 45, Phase 3',
      address2: 'Industrial Area',
      city: 'Chandigarh',
      state: 'Punjab',
      pincode: '160002',
    },
    paymentMethod: 'prepaid',
    total: 4998,
    status: 'delivered',
    date: '2026-04-08T16:20:00.000Z',
  },
  {
    id: 'OOPS-T2N3P4',
    items: [
      { productId: 2, name: 'The Slate Overshirt', price: 2999, qty: 1, size: 'XL', image: '/images/slate-overshirt.jpg' },
    ],
    shipping: {
      fullName: 'Priya Patel',
      phone: '8765432109',
      address1: '12, Green Valley Society',
      address2: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
    },
    paymentMethod: 'prepaid',
    total: 2999,
    status: 'placed',
    date: '2026-04-22T20:10:00.000Z',
  },
];

export function seedProducts() {
  localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
}

export function seedOrders() {
  const existing = localStorage.getItem(LS_KEYS.ORDERS);
  if (!existing || existing === '[]') {
    localStorage.setItem(LS_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
  }
}
