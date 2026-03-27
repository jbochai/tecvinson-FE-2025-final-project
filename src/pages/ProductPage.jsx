import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ShoppingBag, Package, Tag, AlertCircle } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { API_BASE_URL, getImageUrl, formatPrice } from '../utils/constants'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { addToast } = useToast()

  const { data: product, loading, error } = useFetch(`${API_BASE_URL}/products/${id}`)
  const { data: pData } = useFetch(`${API_BASE_URL}/products?limit=100`)
  const allProducts = pData?.products ?? []

  const [qty,           setQty]           = useState(1)
  const [imgError,      setImgError]      = useState(false)

  // Related: same category, exclude current
  const related = useMemo(() => {
    if (!allProducts || !product) return []
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [allProducts, product])

  function handleAddToCart() {
    addItem(product, qty)
    addToast(`${product.title} added to bag!`, 'success')
  }

  // ─── States ────────────────────────────────────────────────────────────
  if (loading) return <Spinner size="lg" label="Loading product…" />
  if (error)   return (
    <div className="page container">
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    </div>
  )
  if (!product) return null

  const { title, price, description, category, thumbnail, rating, brand, stock } = product

  return (
    <div className="page">
      <div className="container">
        {/* Back */}
        <button className={styles.back} onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Back
        </button>

        {/* ─── Detail layout ─────────────────────────────────────────── */}
        <div className={styles.layout}>
          {/* Image */}
          <div className={styles.imagePanel}>
            <img
              src={imgError ? 'https://placehold.co/600x800/e4ddd3/96763a?text=No+Image' : thumbnail}
              alt={title}
              className={styles.productImg}
              onError={() => setImgError(true)}
            />
          </div>

          {/* Info */}
          <div className={styles.infoPanel}>
            {category && (
              <Link to={`/shop?cat=${category}`} className={`badge badge-gold ${styles.cat}`}>
                {category}
              </Link>
            )}

            <h1 className={styles.name}>{title}</h1>

            <div className={styles.ratingRow}>
              {rating != null && (
                <StarRating rating={rating} showValue />
              )}
            </div>

            <p className={styles.price}>{formatPrice(Number(price))}</p>

            <p className={styles.description}>{description}</p>

            {/* Meta */}
            <div className={styles.metaRow}>
              {brand && (
                <span className={styles.metaItem}>
                  <Tag size={13} /> <strong>Brand:</strong> {brand}
                </span>
              )}
              <span className={styles.metaItem}>
                <Package size={13} />
                <strong>Stock:</strong> {stock} units
              </span>
            </div>

            {/* ─── Quantity ──────────────────────────────────────────── */}
            {stock > 0 && (
              <div className={styles.selectorGroup}>
                <p className={styles.selectorLabel}>Quantity</p>
                <div className={styles.qtyRow}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className={styles.qtyVal}>{qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(q => Math.min(stock, q + 1))}
                    aria-label="Increase quantity"
                  >+</button>
                  <span className={styles.qtyMax}>{stock} available</span>
                </div>
              </div>
            )}


            {/* ─── Add to cart button ────────────────────────────────── */}
            <button
              className={`btn btn-primary ${styles.addBtn}`}
              onClick={handleAddToCart}
              disabled={stock === 0}
            >
              <ShoppingBag size={17} />
              {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* ─── Related Products ──────────────────────────────────────── */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className="section-heading">You Might Also Like</h2>
            <div className="divider" />
            <div className={styles.relatedGrid}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
