import { useLocation, Link } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const location = useLocation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {/* Decorative number */}
        <span className={styles.code} aria-hidden="true">404</span>

        <div className={styles.divider} />

        <h1 className={styles.heading}>Page Not Found</h1>

        <p className={styles.description}>
          We couldn't find anything at{' '}
          <code className={styles.path}>
            <MapPin size={12} />
            {location.pathname}
          </code>
          . It may have been moved, deleted, or it never existed.
        </p>

        <div className={styles.actions}>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={15} />
            Back to Home
          </Link>
          <Link to="/shop" className="btn btn-outline">
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
