import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import StarRating from './StarRating'
import { getImageUrl, formatPrice } from '../utils/constants'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { id, name, price, category, image, meta } = product

  function handleImgError(e) {
    e.target.src = 'https://placehold.co/400x300/e4ddd3/96763a?text=No+Image'
  }

  return (
    <article className={`card ${styles.card}`}>
      <Link to={`/shop/${id}`} className={styles.imageLink}>
        <img
          src={getImageUrl(image)}
          alt={name}
          className={styles.image}
          loading="lazy"
          onError={handleImgError}
        />
        {meta?.total_stock === 0 && (
          <span className={styles.outOfStock}>Out of Stock</span>
        )}
      </Link>

      <div className={styles.body}>
        {category && (
          <span className={`badge badge-gold ${styles.category}`}>{category}</span>
        )}

        <Link to={`/shop/${id}`}>
          <h3 className={styles.name}>{name}</h3>
        </Link>

        <div className={styles.meta}>
          {meta?.rating != null && (
            <StarRating rating={meta.rating} showValue />
          )}
        </div>

        <div className={styles.footer}>
          <p className={styles.price}>{formatPrice(Number(price))}</p>
          <Link
            to={`/shop/${id}`}
            className={`btn btn-primary ${styles.shopBtn}`}
            aria-label={`View ${name}`}
          >
            <ShoppingBag size={14} />
            View
          </Link>
        </div>
      </div>
    </article>
  )
}
