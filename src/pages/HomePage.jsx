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

      {/* ─── Shop by Category ──────────────────────────────────────────── */}
      <section className={styles.categorySection}>
        <div className="container">
          <div className={styles.sectionHeadCategories}>
            <div>
              <h2 className="section-heading">Shop by Category</h2>
              <p className={styles.categorySub}>Find your style.</p>
              <div className="divider" />
            </div>
            <Link to="/shop" className={`btn btn-ghost ${styles.seeAll}`}>
              All Categories <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.categoryGrid}>
            {[
              { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400' },
              { name: 'Clothing',    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=400' },
              { name: 'Furniture',   img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' },
              { name: 'Toys',        img: 'https://images.unsplash.com/photo-1558060370-d64111d20163?auto=format&fit=crop&q=80&w=400' },
              { name: 'Sports',      img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400' },
              { name: 'Books',       img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400' }
            ].map(cat => (
              <Link
                key={cat.name}
                to={`/shop?cat=${cat.name}`}
                className={styles.catCard}
              >
                <div className={styles.catImgWrap}>
                  <img src={cat.img} alt={cat.name} className={styles.catImg} loading="lazy" />
                </div>
                <div className={styles.catOverlay} />
                <h3 className={styles.catName}>{cat.name}</h3>
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
