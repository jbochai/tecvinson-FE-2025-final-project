import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Eye, Heart, MessageCircle, Tag } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { API_BASE_URL, formatDate, getBlogImage } from '../utils/constants'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import styles from './PostPage.module.css'

export default function PostPage() {
  const { id } = useParams()
  const { data: post, loading, error } = useFetch(`${API_BASE_URL}/blogs/${id}`)

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

  const { title, author, publishedAt, content, thumbnail, meta } = post
  const comments = meta?.comments ?? []
  
  const displayThumb = getBlogImage(id, thumbnail)

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
            {meta?.tags?.length > 0 && (
              <div className={styles.tags}>
                {meta.tags.map(tag => (
                  <span key={tag} className={`badge badge-gold`}>
                    <Tag size={10} style={{ marginRight: 4 }} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className={styles.title}>{title}</h1>

            <div className={styles.meta}>
              <span className={styles.author}>{author}</span>
              <span className={styles.sep}>·</span>
              {publishedAt && (
                <span className={styles.metaItem}>
                  <Calendar size={13} />
                  {formatDate(publishedAt)}
                </span>
              )}
              {meta?.views != null && (
                <span className={styles.metaItem}>
                  <Eye size={13} />
                  {meta.views.toLocaleString()} views
                </span>
              )}
              {meta?.likes != null && (
                <span className={styles.metaItem}>
                  <Heart size={13} />
                  {meta.likes.toLocaleString()} likes
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
            {content?.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : null
            )}
          </div>

          {/* Comments */}
          {comments.length > 0 && (
            <section className={styles.comments}>
              <h2 className={styles.commentsTitle}>
                <MessageCircle size={18} />
                {comments.length} Comment{comments.length !== 1 ? 's' : ''}
              </h2>
              <ul className={styles.commentList}>
                {comments.map(c => (
                  <li key={c.id} className={styles.comment}>
                    <div className={styles.commentAvatar}>
                      {c.user?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className={styles.commentContent}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentUser}>{c.user}</span>
                        {c.likes > 0 && (
                          <span className={styles.commentLikes}>
                            <Heart size={11} /> {c.likes}
                          </span>
                        )}
                      </div>
                      <p className={styles.commentText}>{c.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

      </div>
    </div>
  )
}
