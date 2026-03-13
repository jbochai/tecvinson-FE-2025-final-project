import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { API_BASE_URL, SORT_OPTIONS, sortProducts } from '../utils/constants'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import ErrorMessage from '../components/ErrorMessage'
import styles from './ShopPage.module.css'

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeCategory = searchParams.get('cat') || 'All'
  const activeSearch   = searchParams.get('q')   || ''
  const activeSort     = searchParams.get('sort') || 'default'

  const { data: products, loading, error } = useFetch(`${API_BASE_URL}/products`)

  // Derive unique category list once
  const categories = useMemo(() => {
    if (!products) return []
    const cats = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]
    return cats
  }, [products])

  // Apply filter + search + sort together in one pass — never stored in state
  const filtered = useMemo(() => {
    if (!products) return []
    let result = products

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory)
    }

    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase()
      result = result.filter(
        p =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
    }

    return sortProducts(result, activeSort)
  }, [products, activeCategory, activeSearch, activeSort])

  function setParam(key, value) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value && value !== 'All' && value !== 'default') {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      return next
    })
  }

  function clearAll() {
    setSearchParams({})
  }

  const hasFilters = activeCategory !== 'All' || activeSearch || activeSort !== 'default'

  return (
    <div className="page">
      <div className="container">
        {/* Page header */}
        <div className="page-header">
          <h1 className="page-title">Shop</h1>
          <p className="page-subtitle">
            {loading ? 'Loading products…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          {/* Search */}
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="search"
              className={`input ${styles.searchInput}`}
              placeholder="Search products…"
              value={activeSearch}
              onChange={e => setParam('q', e.target.value)}
              aria-label="Search products"
            />
            {activeSearch && (
              <button
                className={styles.clearSearch}
                onClick={() => setParam('q', '')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className={styles.sortWrap}>
            <SlidersHorizontal size={15} className={styles.sortIcon} />
            <select
              className={`input select ${styles.sort}`}
              value={activeSort}
              onChange={e => setParam('sort', e.target.value)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button className={`btn btn-ghost ${styles.clearBtn}`} onClick={clearAll}>
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className={styles.catRow} role="group" aria-label="Filter by category">
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.catPill} ${activeCategory === cat ? styles.catActive : ''}`}
                onClick={() => setParam('cat', cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <ErrorMessage message={error} />}

        {/* Grid */}
        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
          }
        </div>

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className={styles.empty}>
            <Search size={32} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No products found</h3>
            <p className={styles.emptySub}>
              {activeSearch
                ? `No results for "${activeSearch}". Try a different search term or clear your filters.`
                : 'No products match the selected category.'}
            </p>
            <button className="btn btn-outline" onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
