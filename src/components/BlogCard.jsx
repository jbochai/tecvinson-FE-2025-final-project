import { Link } from 'react-router-dom'
import { Calendar, Eye, Heart } from 'lucide-react'
import { formatDate, truncate, getBlogImage } from '../utils/constants'
import styles from './BlogCard.module.css'

export default function BlogCard({ post }) {
  const { id, title, userId, body, tags, reactions, views } = post

  const displayThumb = getBlogImage(id, null)

  return (
    <article className={`card ${styles.card}`}>
      {displayThumb && (
        <Link to={`/blog/${id}`} className={styles.thumbLink}>
          <img src={displayThumb} alt={title} className={styles.thumb} />
        </Link>
      )}

      <div className={styles.body}>
        {tags?.length > 0 && (
          <div className={styles.tags}>
            {tags.slice(0, 2).map(tag => (
              <span key={tag} className={`badge badge-gold ${styles.tag}`}>{tag}</span>
            ))}
          </div>
        )}

        <Link to={`/blog/${id}`}>
          <h3 className={styles.title}>{title}</h3>
        </Link>

        {body && (
          <p className={styles.excerpt}>{truncate(body, 130)}</p>
        )}

        <div className={styles.footer}>
          <div className={styles.byline}>
            <span className={styles.author}>Author #{userId}</span>
          </div>

          <div className={styles.stats}>
            {views != null && (
              <span className={styles.stat}><Eye size={12} />{views}</span>
            )}
            {reactions?.likes != null && (
              <span className={styles.stat}><Heart size={12} />{reactions.likes}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
