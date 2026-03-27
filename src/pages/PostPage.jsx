import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Eye, Heart, MessageCircle, Tag } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { API_BASE_URL, formatDate, getBlogImage } from '../utils/constants'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import styles from './PostPage.module.css'

export default function PostPage() {
  const { id } = useParams()
  const { data: post, loading, error } = useFetch(`${API_BASE_URL}/posts/${id}`)

  if (loading) return (
    <div className="page">
      <div className="container">
        <Spinner size="lg" label="Loading post…" />
      </div>
    </div>
  )

  if (error) return (
    <div className="page">
      <div className="container">
        <ErrorMessage message={error} />
        <Link to="/blog" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={15} /> Back to Blog
        </Link>
      </div>
    </div>
  )

  if (!post) return null

  const { title, userId, body, tags, reactions, views } = post
  const displayThumb = getBlogImage(id, null)

  return (
    <div className="page">
      <div className="container">

        {/* Back link */}
        <Link to="/blog" className={styles.backLink}>
          <ArrowLeft size={15} />
          Back to Blog
        </Link>

        <article className={styles.article}>
          {/* Header */}
          <header className={styles.header}>
            {tags?.length > 0 && (
              <div className={styles.tags}>
                {tags.map(tag => (
                  <span key={tag} className={`badge badge-gold`}>
                    <Tag size={10} style={{ marginRight: 4 }} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className={styles.title}>{title}</h1>

            <div className={styles.meta}>
              <span className={styles.author}>Author #{userId}</span>
              <span className={styles.sep}>·</span>
              {views != null && (
                <span className={styles.metaItem}>
                  <Eye size={13} />
                  {views.toLocaleString()} views
                </span>
              )}
              {reactions?.likes != null && (
                <span className={styles.metaItem}>
                  <Heart size={13} />
                  {reactions.likes.toLocaleString()} likes
                </span>
              )}
            </div>
          </header>

          {/* Thumbnail */}
          {displayThumb && (
            <div className={styles.thumbWrap}>
              <img src={displayThumb} alt={title} className={styles.thumb} />
            </div>
          )}

          {/* Body */}
          <div className={styles.body}>
            {body?.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : null
            )}
          </div>
        </article>

      </div>
    </div>
  )
}
