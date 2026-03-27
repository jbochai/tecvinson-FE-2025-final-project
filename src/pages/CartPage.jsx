import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getImageUrl, formatPrice, FREE_SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from '../utils/constants'
import styles from './CartPage.module.css'

export default function CartPage() {
  const { items, itemCount, subtotal, updateQty, removeItem, clearCart } = useCart()
  const [showConfirm, setShowConfirm] = useState(false)

  // ─── Derived order summary values (never stored in state) ────────────────
  const shipping      = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax           = subtotal * TAX_RATE
  const total         = subtotal + shipping + tax
  const toFreeShip    = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress      = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  function handleClearConfirmed() {
    clearCart()
    setShowConfirm(false)
  }

  // ─── Empty cart ───────────────────────────────────────────────────────────
  if (itemCount === 0) {
    return (
      <div className="page">
        <div className={`container ${styles.emptyWrap}`}>
          <ShoppingBag size={52} className={styles.emptyIcon} />
          <h1 className={styles.emptyTitle}>Your cart is empty</h1>
          <p className={styles.emptySub}>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn btn-primary">
            Browse the shop <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Your Cart</h1>
          <p className="page-subtitle">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
        </div>

        <div className={styles.layout}>
          {/* ─── Cart items ──────────────────────────────────────────── */}
          <section className={styles.itemsCol}>
            {/* Free shipping progress */}
            <div className={styles.shippingBanner}>
              {shipping === 0 ? (
                <p className={styles.shippingFree}>🎉 You have free shipping!</p>
              ) : (
                <p className={styles.shippingMsg}>
                  Spend <strong>{formatPrice(toFreeShip)}</strong> more for free shipping
                </p>
              )}
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className={styles.itemList}>
              {items.map(item => (
                <article key={item.cartId} className={styles.item}>
                  {/* Image */}
                  <Link to={`/shop/${item.productId}`} className={styles.itemImgWrap}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImg}
                      onError={e => { e.target.src = 'https://placehold.co/100x100/e4ddd3/96763a?text=?' }}
                    />
                  </Link>

                  {/* Details */}
                  <div className={styles.itemInfo}>
                    <Link to={`/shop/${item.productId}`} className={styles.itemName}>
                      {item.name}
                    </Link>
                    <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                  </div>

                  {/* Qty controls */}
                  <div className={styles.itemQty}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQty(item.cartId, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className={styles.qtyVal}>{item.qty}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQty(item.cartId, item.qty + 1)}
                      disabled={item.qty >= item.maxStock}
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Line total */}
                  <p className={styles.itemTotal}>
                    {formatPrice(item.price * item.qty)}
                  </p>

                  {/* Remove */}
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.cartId)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>

            <button
              className={`btn btn-ghost ${styles.clearBtn}`}
              onClick={() => setShowConfirm(true)}
            >
              <Trash2 size={14} /> Clear entire cart
            </button>
          </section>

          {/* ─── Order summary ────────────────────────────────────────── */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.row}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.row}>
                <span>Shipping</span>
                <span className={shipping === 0 ? styles.free : undefined}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className={styles.row}>
                <span>VAT (7.5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className={`${styles.row} ${styles.totalRow}`}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button className={`btn btn-gold ${styles.checkoutBtn}`} disabled>
              Checkout <ArrowRight size={15} />
            </button>
            <p className={styles.checkoutNote}>
              Checkout is not available in this demo.
            </p>
          </aside>
        </div>
      </div>

      {/* ─── Clear-cart confirmation dialog ──────────────────────────── */}
      {showConfirm && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Clear cart confirmation">
          <div className={styles.dialog}>
            <h3 className={styles.dialogTitle}>Clear your cart?</h3>
            <p className={styles.dialogMsg}>
              This will remove all {itemCount} item{itemCount !== 1 ? 's' : ''} from your cart. This cannot be undone.
            </p>
            <div className={styles.dialogActions}>
              <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleClearConfirmed}>
                Yes, clear cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
