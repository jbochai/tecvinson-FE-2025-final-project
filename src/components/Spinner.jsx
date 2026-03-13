import styles from './Spinner.module.css'

export default function Spinner({ size = 'md', label = 'Loading…' }) {
  const cls = `${styles.spinner} ${styles[size]}`
  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <span className={cls} />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
