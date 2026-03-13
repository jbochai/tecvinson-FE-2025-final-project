import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ShoppingBag, Package, Tag, AlertCircle } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { useCart } from '../context/CartContext'
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

  const { data: product, loading, error } = useFetch(`${API_BASE_URL}/products/${id}`)
  const { data: allProducts } = useFetch(`${API_BASE_URL}/products`)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize,  setSelectedSize]  = useState('')
  const [qty,           setQty]           = useState(1)
  const [imgError,      setImgError]      = useState(false)
  const [addMsg,        setAddMsg]        = useState('')
  const [warning,       setWarning]       = useState('')

  // Derive the selected variant and its sizes
  const variants = product?.meta?.variants ?? []
  const selectedVariant = useMemo(
    () => variants.find(v => v.color === selectedColor) ?? null,
    [variants, selectedColor]
  )
  const availableSizes = selectedVariant?.sizes ?? []
  const selectedSizeObj = useMemo(
    () => availableSizes.find(s => s.size === selectedSize) ?? null,
    [availableSizes, selectedSize]
  )
  const stockForSelection = selectedSizeObj?.stock ?? 0

  // Related: same category, exclude current
  const related = useMemo(() => {
    if (!allProducts || !product) return []
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [allProducts, product])

  function handleColorChange(color) {
    setSelectedColor(color)
    setSelectedSize('')
    setQty(1)
    setWarning('')
  }

  function handleAddToCart() {
    if (!selectedColor) {
      setWarning('Please select a colour.')
      return
    }
    if (!selectedSize) {
      setWarning('Please select a size.')
      return
    }
    if (stockForSelection === 0) {
      setWarning('This variant is out of stock.')
      return
    }
    setWarning('')
    addItem(product, selectedColor, selectedSizeObj, qty)
    setAddMsg('Added to cart!')
    setTimeout(() => setAddMsg(''), 2500)
  }

  // ─── States ────────────────────────────────────────────────────────────
  if (loading) return <Spinner size="lg" label="Loading product…" />
  if (error)   return (
    <div className="page container">
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    </div>
  )
  if (!product) return null

  const { name, price, description, category, image, meta } = product

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
              src={imgError ? 'https://placehold.co/600x500/e4ddd3/96763a?text=No+Image' : getImageUrl(image)}
              alt={name}
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

            <h1 className={styles.name}>{name}</h1>

            <div className={styles.ratingRow}>
              {meta?.rating != null && (
                <StarRating rating={meta.rating} showValue />
              )}
            </div>

            <p className={styles.price}>{formatPrice(Number(price))}</p>

            <p className={styles.description}>{description}</p>

            {/* Meta */}
            <div className={styles.metaRow}>
              {meta?.brand && (
                <span className={styles.metaItem}>
                  <Tag size={13} /> <strong>Brand:</strong> {meta.brand}
                </span>
              )}
              <span className={styles.metaItem}>
                <Package size={13} />
                <strong>Stock:</strong>{' '}
                {selectedSizeObj
                  ? `${stockForSelection} units`
                  : `${meta?.total_stock ?? 0} total`}
              </span>
            </div>

            {/* ─── Colour selector ───────────────────────────────────── */}
            {variants.length > 0 && (
              <div className={styles.selectorGroup}>
                <p className={styles.selectorLabel}>
                  Colour{selectedColor && <em>: {selectedColor}</em>}
                </p>
                <div className={styles.colorRow}>
                  {variants.map(v => (
                    <button
                      key={v.color}
                      className={`${styles.colorSwatch} ${selectedColor === v.color ? styles.swatchActive : ''}`}
                      title={v.color}
                      style={{ background: v.color.toLowerCase() }}
                      onClick={() => handleColorChange(v.color)}
                      aria-pressed={selectedColor === v.color}
                      aria-label={v.color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ─── Size selector (only after colour chosen) ──────────── */}
            {selectedColor && availableSizes.length > 0 && (
              <div className={styles.selectorGroup}>
                <p className={styles.selectorLabel}>
                  Size{selectedSize && <em>: {selectedSize}</em>}
                </p>
                <div className={styles.sizeRow}>
                  {availableSizes.map(s => (
                    <button
                      key={s.sku}
                      className={`${styles.sizeBtn} ${selectedSize === s.size ? styles.sizeActive : ''} ${s.stock === 0 ? styles.sizeOut : ''}`}
                      onClick={() => { if (s.stock > 0) { setSelectedSize(s.size); setQty(1); setWarning('') } }}
                      disabled={s.stock === 0}
                      aria-pressed={selectedSize === s.size}
                      title={s.stock === 0 ? 'Out of stock' : `${s.stock} left`}
                    >
                      {s.size}
                      {s.stock === 0 && <span className={styles.sizeOutLabel}>Out</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Quantity ──────────────────────────────────────────── */}
            {selectedSizeObj && stockForSelection > 0 && (
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
                    onClick={() => setQty(q => Math.min(stockForSelection, q + 1))}
                    aria-label="Increase quantity"
                  >+</button>
                  <span className={styles.qtyMax}>{stockForSelection} available</span>
                </div>
              </div>
            )}

            {/* ─── Warning / success ─────────────────────────────────── */}
            {warning && (
              <p className={styles.warning} role="alert">
                <AlertCircle size={14} /> {warning}
              </p>
            )}
            {addMsg && (
              <p className={styles.success} role="status">{addMsg}</p>
            )}

            {/* ─── Add to cart button ────────────────────────────────── */}
            <button
              className={`btn btn-primary ${styles.addBtn}`}
              onClick={handleAddToCart}
              disabled={meta?.total_stock === 0}
            >
              <ShoppingBag size={17} />
              {meta?.total_stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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
