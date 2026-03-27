import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { API_BASE_URL } from '../utils/constants'
import BlogCard from '../components/BlogCard'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import styles from './BlogPage.module.css'

export default function BlogPage() {
  const { data: pData, loading, error } = useFetch(`${API_BASE_URL}/posts?limit=30`)
  const posts = pData?.posts ?? []
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!posts) return []
    if (!search.trim()) return posts
    const q = search.toLowerCase()
    return posts.filter(
      p =>
        p.title?.toLowerCase().includes(q) ||
        p.body?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
    )
  }, [posts, search])

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">The Blog</h1>
          <p className="page-subtitle">Stories, guides, and insights</p>
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={`input ${styles.searchInput}`}
            placeholder="Search posts, authors, tags…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search blog posts"
          />
        </div>

        {loading && <Spinner label="Loading posts…" />}
        {error   && <ErrorMessage message={error} />}

        {!loading && !error && filtered.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              No posts found{search ? ` for "${search}"` : ''}.
            </p>
          </div>
        )}

        <div className={styles.grid}>
          {filtered.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
