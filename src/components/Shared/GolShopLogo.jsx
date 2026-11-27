import styles from './GolShopLogo.module.scss'

export default function GolShopLogo() {
  return (
    <span className={styles.logo}>
      <span className={styles.badge}>
        <svg viewBox="0 0 24 24" className={styles.ball} aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="12,7.5 16,10.4 14.5,15 9.5,15 8,10.4" fill="currentColor" />
        </svg>
      </span>
      <span className={styles.name}>
        Gol<span className={styles.gold}>Shop</span>
      </span>
    </span>
  )
}