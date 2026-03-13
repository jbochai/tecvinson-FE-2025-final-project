import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.brandText}>Shoppr</span>
          <p className={styles.tagline}>Discover what you love.</p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/"     className={styles.link}>Home</Link>
          <Link to="/shop" className={styles.link}>Shop</Link>
          <Link to="/blog" className={styles.link}>Blog</Link>
          <Link to="/cart" className={styles.link}>Cart</Link>
        </nav>

        <p className={styles.copy}>
          &copy; {year} Shoppr Lite. Tecvinson Cohort 2025.
        </p>
      </div>
    </footer>
  )
}
