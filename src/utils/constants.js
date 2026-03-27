// ─── API ─────────────────────────────────────────────────────────────────────
export const API_BASE_URL = 'https://dummyjson.com'
// DummyJSON images are absolute; we'll keep this as a fallback if needed
export const IMAGE_BASE_URL = 'https://dummyjson.com'

// ─── Cart ────────────────────────────────────────────────────────────────────
export const FREE_SHIPPING_THRESHOLD = 50000   // ₦ amount for free shipping
export const SHIPPING_COST = 2500              // flat shipping fee in ₦
export const TAX_RATE = 0.075                  // 7.5% VAT

// ─── Formatters ──────────────────────────────────────────────────────────────
/**
 * Format a number as Naira currency.
 * @param {number} amount
 * @returns {string}
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Build a full product image URL from a relative path.
 * @param {string} path  e.g. "/assets/images/product-5.jpg"
 * @returns {string}
 */
export function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${IMAGE_BASE_URL}${path}`
}

const FALLBACK_BLOG_IMAGES = [
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1512418490979-9ce792d5be30?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'
]

/**
 * Returns a beautiful fallback image for blogs if the API returns a base64 SVG.
 */
export function getBlogImage(id, originalUrl) {
  if (!originalUrl || originalUrl.startsWith('data:image/svg')) {
    const num = parseInt(String(id).replace(/\D/g, ''), 10) || 0
    return FALLBACK_BLOG_IMAGES[num % FALLBACK_BLOG_IMAGES.length]
  }
  return originalUrl
}

/**
 * Truncate text to a max length, appending ellipsis.
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(text, maxLen = 120) {
  if (!text || text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}

/**
 * Format an ISO date string to a readable date.
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── Sort options ─────────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: 'default',     label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
]

// ─── Sort helper ─────────────────────────────────────────────────────────────
/**
 * Sort an array of products according to the given sort key.
 * @param {Array} products
 * @param {string} sort
 * @returns {Array}
 */
export function sortProducts(products, sort) {
  const copy = [...products]
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => Number(a.price) - Number(b.price))
    case 'price-desc':
      return copy.sort((a, b) => Number(b.price) - Number(a.price))
    case 'rating':
      return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    default:
      return copy
  }
}
