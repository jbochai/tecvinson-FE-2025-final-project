import { Link } from 'react-router-dom'
import { Calendar, Eye, Heart } from 'lucide-react'
import { formatDate, truncate, getBlogImage } from '../utils/constants'
import styles from './BlogCard.module.css'

export default function BlogCard({ post }) {
  const { id, title, author, publishedAt, content, thumbnail, meta } = post

  const displayThumb = getBlogImage(id, thumbnail)

  return (
    <article className={`card ${styles.card}`}>
      {displayThumb && (
        <Link to={`/blog/${id}`} className={styles.thumbLink}>
          <img src={displayThumb} alt={title} className={styles.thumb} />
        </Link>
      )}

      <div className={styles.body}>
        {meta?.tags?.length > 0 && (
          <div className={styles.tags}>
            {meta.tags.slice(0, 2).map(tag => (
              <span key={tag} className={`badge badge-gold ${styles.tag}`}>{tag}</span>
            ))}
          </div>
        )}

        <Link to={`/blog/${id}`}>
          <h3 className={styles.title}>{title}</h3>
        </Link>

        {content && (
          <p className={styles.excerpt}>{truncate(content, 130)}</p>
        )}

        <div className={styles.footer}>
          <div className={styles.byline}>
            <span className={styles.author}>{author}</span>
            {publishedAt && (
              <span className={styles.date}>
                <Calendar size={12} />
                {formatDate(publishedAt)}
              </span>
            )}
          </div>

          <div className={styles.stats}>
            {meta?.views != null && (
              <span className={styles.stat}><Eye size={12} />{meta.views}</span>
            )}
            {meta?.likes != null && (
              <span className={styles.stat}><Heart size={12} />{meta.likes}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
