// ─── API ─────────────────────────────────────────────────────────────────────
export const API_BASE_URL = 'https://developerapis.vercel.app/api'
export const IMAGE_BASE_URL = 'https://developerapis.vercel.app'

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
      return copy.sort((a, b) => (b.meta?.rating ?? 0) - (a.meta?.rating ?? 0))
    default:
      return copy
  }
}
