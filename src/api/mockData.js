export const mockProducts = [
  {
    id: 'p-101',
    name: 'Nimbus Runner',
    description: 'Lightweight running sneaker with responsive foam support.',
    category: 'Shoes',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    price: 89,
    variants: [
      { id: 'v-101-1', label: 'Black / 40', stock: 7 },
      { id: 'v-101-2', label: 'Black / 41', stock: 0 },
      { id: 'v-101-3', label: 'Grey / 42', stock: 4 },
    ],
  },
  {
    id: 'p-102',
    name: 'Arc Hoodie',
    description: 'Midweight hoodie crafted for everyday layering.',
    category: 'Apparel',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    price: 59,
    variants: [
      { id: 'v-102-1', label: 'S / Navy', stock: 5 },
      { id: 'v-102-2', label: 'M / Navy', stock: 8 },
      { id: 'v-102-3', label: 'L / Navy', stock: 2 },
    ],
  },
  {
    id: 'p-103',
    name: 'Terra Bottle',
    description: 'Insulated stainless steel bottle with leakproof cap.',
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    price: 24,
    variants: [
      { id: 'v-103-1', label: '500ml / Sand', stock: 12 },
      { id: 'v-103-2', label: '750ml / Olive', stock: 3 },
    ],
  },
  {
    id: 'p-104',
    name: 'Studio Headphones',
    description: 'Wireless over-ear headphones with active noise cancellation.',
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    price: 149,
    variants: [
      { id: 'v-104-1', label: 'Matte Black', stock: 10 },
      { id: 'v-104-2', label: 'Silver', stock: 1 },
    ],
  },
]

export const mockAddresses = [
  {
    id: 'addr-1',
    label: 'Home',
    recipient: 'Alex Morgan',
    line1: '112 Cedar St',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    country: 'US',
  },
  {
    id: 'addr-2',
    label: 'Office',
    recipient: 'Alex Morgan',
    line1: '845 Market St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    country: 'US',
  },
]

export const trackingTimeline = [
  'Order confirmed',
  'Packed at warehouse',
  'Shipped to courier',
  'Out for delivery',
]
