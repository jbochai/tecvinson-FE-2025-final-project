import { X, Trash2, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice, getImageUrl } from '../utils/constants'
import { useState } from 'react'
import styles from './CartDrawer.module.css'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, itemCount, updateQty, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)

  // Free shipping logic
  const FREE_SHIPPING_THRESHOLD = 50000
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  if (!isOpen) return null

  function handleCheckout() {
    onClose()
    navigate('/cart')
  }

  function renderCartItems() {
    if (items.length === 0) {
      return (
        <div className={styles.empty}>
          <div className={styles.emptyIconWrap}>
            <ShoppingBagIcon />
          </div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '1rem' }}>
            Continue Shopping
          </button>
        </div>
      )
    }

    return (
      <ul className={styles.itemList}>
        {items.map((item) => (
          <li key={item.cartId} className={styles.item}>
            <div className={styles.itemImageWrap}>
              <img src={getImageUrl(item.image)} alt={item.name} className={styles.itemImage} />
            </div>
            
            <div className={styles.itemDetails}>
              <div className={styles.itemHeader}>
                <Link to={`/shop/${item.productId}`} className={styles.itemName} onClick={onClose}>
                  {item.name}
                </Link>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.cartId)}
                  title="Remove item"
                >
                  <X size={16} />
                </button>
              </div>

              <div className={styles.itemVariant}>
                {item.color} / {item.size}
              </div>
              
              <div className={styles.itemFooter}>
                <div className={styles.qtyControl}>
                  <button onClick={() => updateQty(item.cartId, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.cartId, item.qty + 1)}>+</button>
                </div>
                <div className={styles.itemPrice}>{formatPrice(item.price * item.qty)}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Shopping Cart">
        {/* Header */}
        <div className={styles.header}>
          <h2>Shopping Cart <span className={styles.headerCount}>({itemCount})</span></h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        {/* Shipping Progress */}
        {items.length > 0 && (
          <div className={styles.shippingBanner}>
            {amountToFreeShipping > 0 ? (
              <p>You're <strong>{formatPrice(amountToFreeShipping)}</strong> away from free shipping!</p>
            ) : (
              <p className={styles.successText}>✨ You've unlocked free shipping!</p>
            )}
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressPercent}%`, backgroundColor: progressPercent === 100 ? 'var(--color-success-500)' : 'var(--brand-gold)' }} 
              />
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className={styles.content}>
          {renderCartItems()}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span className={styles.subtotalValue}>{formatPrice(subtotal)}</span>
            </div>
            <p className={styles.taxesText}>Shipping & taxes calculated at checkout.</p>
            
            <div className={styles.actions}>
              <button className={`btn btn-primary ${styles.checkoutBtn}`} onClick={handleCheckout}>
                Review Bag & Checkout <ChevronRight size={18} />
              </button>
              
              {isConfirmingClear ? (
                <div className={styles.confirmClear}>
                  <span>Are you sure?</span>
                  <button className="btn btn-ghost" onClick={() => setIsConfirmingClear(false)}>Cancel</button>
                  <button className="btn btn-gold" style={{ padding: '0.4rem 1rem' }} onClick={() => { clearCart(); setIsConfirmingClear(false); }}>Yes, clear</button>
                </div>
              ) : (
                <button className={`btn btn-ghost ${styles.clearBtn}`} onClick={() => setIsConfirmingClear(true)}>
                  <Trash2 size={16} /> Clear Empty
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function ShoppingBagIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <path d="M3 6h18"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )
}
