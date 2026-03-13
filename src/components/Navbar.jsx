import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/',     label: 'Home',  end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ''}`

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <Link to="/" className={styles.brand}>
          <span className={styles.brandText}>Shoppr</span>
          <span className={styles.brandDot} aria-hidden="true">·</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/cart" className={styles.cartBtn} aria-label={`Cart — ${itemCount} items`}>
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className={styles.drawer} aria-label="Mobile navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/cart"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Cart {itemCount > 0 && `(${itemCount})`}
          </NavLink>
        </nav>
      )}
    </header>
  )
}
