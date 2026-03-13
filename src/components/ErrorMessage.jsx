import { AlertCircle } from 'lucide-react'
import styles from './ErrorMessage.module.css'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.wrapper} role="alert">
      <AlertCircle size={28} className={styles.icon} />
      <p className={styles.text}>{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
