import { Star } from 'lucide-react'
import styles from './StarRating.module.css'

/**
 * Renders up to 5 stars filled proportionally to `rating`.
 * @param {number} rating  – 0 to 5
 * @param {boolean} showValue
 */
export default function StarRating({ rating = 0, showValue = false }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= Math.floor(rating)) return 'full'
    if (i < rating)                   return 'half'
    return 'empty'
  })

  return (
    <span className={styles.wrapper} aria-label={`${rating} out of 5 stars`}>
      {stars.map((type, i) => (
        <Star
          key={i}
          size={14}
          className={`${styles.star} ${styles[type]}`}
          fill={type !== 'empty' ? 'currentColor' : 'none'}
        />
      ))}
      {showValue && <span className={styles.value}>{rating.toFixed(1)}</span>}
    </span>
  )
}
