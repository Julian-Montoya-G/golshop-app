import { IonIcon } from '@ionic/react'
import { star } from 'ionicons/icons'
import ProductArt from '../Shared/ProductArt'
import { formatCOP } from '../../helpers/golshopData'
import styles from './CardItem.module.scss'

export default function CardItem({ product, index = 0, onOpen }) {
  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onOpen?.(product)}
    >
      <div className={styles.art}>
        <ProductArt art={product.art} />
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <span className={styles.rating}>
          <IonIcon icon={star} />
          {product.rating}
        </span>
      </div>
      <div className={styles.info}>
        <p className={styles.team}>{product.team}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{formatCOP(product.price)}</p>
      </div>
    </article>
  )
}