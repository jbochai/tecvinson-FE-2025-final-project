import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { API_BASE_URL } from '../utils/constants'
import ProductCard from '../components/ProductCard'
import BlogCard from '../components/BlogCard'
import SkeletonCard from '../components/SkeletonCard'
import ErrorMessage from '../components/ErrorMessage'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { data: products, loading: pLoad, error: pErr } = useFetch(`${API_BASE_URL}/products`)
  const { data: blogs,    loading: bLoad, error: bErr } = useFetch(`${API_BASE_URL}/blogs`)

  // Show 4 featured products (first 4 with highest rating)
  const featured = useMemo(() => {
    if (!products) return []
    return [...products]
      .sort((a, b) => (b.meta?.rating ?? 0) - (a.meta?.rating ?? 0))
      .slice(0, 4)
  }, [products])

  // Show latest 3 blog posts
  const latestPosts = useMemo(() => {
    if (!blogs) return []
    return [...blogs]
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 3)
  }, [blogs])

  return (
    <div className={styles.page}>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>New Season Collection</p>
            <h1 className={styles.heroTitle}>
              Discover<br />
              <em>What You</em><br />
              Love.
            </h1>
            <p className={styles.heroSub}>
              Curated products for the modern shopper. From electronics to
              everyday essentials — everything in one place.
            </p>
            <div className={styles.heroActions}>
              <Link to="/shop" className="btn btn-gold">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/blog" className="btn btn-outline" style={{ color: 'var(--color-tertiary-50)', borderColor: 'rgba(255,255,255,0.3)' }}>
                Read the Blog
              </Link>
            </div>
          </div>
          <div className={styles.heroDecor} aria-hidden="true">
            <div className={styles.decor1} />
            <div className={styles.decor2} />
            <div className={styles.decor3} />
          </div>
        </div>
      </section>

      {/* ─── Categories strip ──────────────────────────────────────────── */}
      <section className={styles.categories}>
        <div className="container">
          <div className={styles.catStrip}>
            {['Electronics', 'Clothing', 'Furniture', 'Toys', 'Sports', 'Books'].map(cat => (
              <Link
                key={cat}
                to={`/shop?cat=${cat}`}
                className={styles.catPill}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <h2 className="section-heading">Top Picks</h2>
              <div className="divider" />
            </div>
            <Link to="/shop" className={`btn btn-ghost ${styles.seeAll}`}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {pErr && <ErrorMessage message={pErr} />}

          <div className={styles.grid}>
            {pLoad
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
            }
          </div>
        </div>
      </section>

      {/* ─── Banner ────────────────────────────────────────────────────── */}
      <section className={styles.banner}>
        <div className="container">
          <div className={styles.bannerInner}>
            <div>
              <h2 className={styles.bannerTitle}>Free Shipping</h2>
              <p className={styles.bannerSub}>On orders over ₦50,000</p>
            </div>
            <Link to="/shop" className="btn btn-gold">
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Latest Blog Posts ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <h2 className="section-heading">From the Blog</h2>
              <div className="divider" />
            </div>
            <Link to="/blog" className={`btn btn-ghost ${styles.seeAll}`}>
              All posts <ArrowRight size={14} />
            </Link>
          </div>

          {bErr && <ErrorMessage message={bErr} />}

          <div className={styles.blogGrid}>
            {bLoad
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`card ${styles.blogSkeleton}`}>
                    <div className={`skeleton ${styles.blogSkThumb}`} />
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <div className={`skeleton ${styles.blogSkLine}`} style={{ width: '40%', height: '0.75rem' }} />
                      <div className={`skeleton ${styles.blogSkLine}`} style={{ width: '90%', height: '1rem' }} />
                      <div className={`skeleton ${styles.blogSkLine}`} style={{ width: '75%', height: '0.875rem' }} />
                    </div>
                  </div>
                ))
              : latestPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))
            }
          </div>
        </div>
      </section>
    </div>
  )
}
