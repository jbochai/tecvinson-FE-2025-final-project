import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

/**
 * Stable cart item ID built from sku so the same colour+size
 * combination on the same product is treated as one line item.
 */
function buildCartId(productId, sku) {
  return `${productId}::${sku}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  /**
   * Add a product to the cart.
   * Coerces price to a number HERE, at the boundary (see README best-practices).
   *
   * @param {object} product   – full product object from the API
   * @param {string} color     – selected colour name
   * @param {object} sizeObj   – { size, sku, stock } from the selected variant
   * @param {number} qty
   */
  const addItem = useCallback((product, color, sizeObj, qty) => {
    const cartId = buildCartId(product.id, sizeObj.sku)

    setItems(prev => {
      const existing = prev.find(i => i.cartId === cartId)
      if (existing) {
        // Increase quantity up to the available stock ceiling
        return prev.map(i =>
          i.cartId === cartId
            ? { ...i, qty: Math.min(i.qty + qty, sizeObj.stock) }
            : i
        )
      }
      return [
        ...prev,
        {
          cartId,
          productId:  product.id,
          name:       product.name,
          image:      product.image,
          category:   product.category,
          price:      Number(product.price),   // ← coerce at the boundary
          color,
          size:       sizeObj.size,
          sku:        sizeObj.sku,
          maxStock:   sizeObj.stock,
          qty,
        },
      ]
    })
  }, [])

  /**
   * Update the quantity of a specific cart line.
   * Clamps between 1 and the item's max stock.
   */
  const updateQty = useCallback((cartId, newQty) => {
    setItems(prev =>
      prev.map(i =>
        i.cartId === cartId
          ? { ...i, qty: Math.max(1, Math.min(newQty, i.maxStock)) }
          : i
      )
    )
  }, [])

  /**
   * Remove one line item from the cart.
   */
  const removeItem = useCallback(cartId => {
    setItems(prev => prev.filter(i => i.cartId !== cartId))
  }, [])

  /**
   * Empty the cart entirely.
   */
  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // ─── Derived values (never stored in state) ───────────────────────────────
  const itemCount  = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, addItem, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * Custom hook — consumers import this instead of the context object directly.
 */
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
