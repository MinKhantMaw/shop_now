import apiClient from './client'
import { mockProducts } from './mockData'

function normalizeVariant(variant, index) {
  if (!variant || typeof variant !== 'object') {
    return {
      id: `variant-${index}`,
      label: `Option ${index + 1}`,
      stock: 0,
    }
  }

  return {
    id: variant.id ?? `variant-${index}`,
    label: variant.label ?? variant.name ?? `Option ${index + 1}`,
    stock: Math.max(0, Number(variant.stock ?? 0)),
  }
}

function normalizeProduct(product, index) {
  const categoryName =
    typeof product?.category === 'string'
      ? product.category
      : product?.category?.name ?? product?.category_name ?? 'Uncategorized'

  const backendVariants = Array.isArray(product?.variants)
    ? product.variants.map(normalizeVariant)
    : []
  const stock = Math.max(0, Number(product?.stock ?? 0))
  const variants =
    backendVariants.length > 0
      ? backendVariants
      : [{ id: `default-${product?.id ?? index}`, label: 'Default', stock }]
  const primaryImage = Array.isArray(product?.images)
    ? product.images.find((image) => image?.is_primary)?.url || product.images[0]?.url
    : undefined

  return {
    ...product,
    id: product?.id ?? `product-${index}`,
    name: product?.name ?? 'Untitled product',
    description: product?.description ?? '',
    price: Number(product?.price ?? 0),
    category: categoryName,
    image: product?.image ?? primaryImage ?? '',
    variants,
  }
}

export async function fetchProducts() {
  try {
    const response = await apiClient.get('/products')
    const products = response.data?.data || response.data || []
    return Array.isArray(products) ? products.map(normalizeProduct) : []
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockProducts.map(normalizeProduct)
  }
}
