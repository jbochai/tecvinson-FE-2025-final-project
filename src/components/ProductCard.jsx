import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import StarRating from './StarRating'
import { getImageUrl, formatPrice } from '../utils/constants'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { id, title, price, category, thumbnail, rating, stock } = product

  function handleImgError(e) {
    e.target.src = 'https://placehold.co/400x300/e4ddd3/96763a?text=No+Image'
  }

  return (
    <article className={`card ${styles.card}`}>
      <Link to={`/shop/${id}`} className={styles.imageLink}>
        <img
          src={thumbnail}
          alt={title}
          className={styles.image}
          loading="lazy"
          onError={handleImgError}
        />
        {stock === 0 && (
          <span className={styles.outOfStock}>Out of Stock</span>
        )}
      </Link>

      <div className={styles.body}>
        {category && (
          <span className={`badge badge-gold ${styles.category}`}>{category}</span>
        )}

        <Link to={`/shop/${id}`}>
          <h3 className={styles.name}>{title}</h3>
        </Link>

        <div className={styles.meta}>
          {rating != null && (
            <StarRating rating={rating} showValue />
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
