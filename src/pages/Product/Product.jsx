import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IonPage, IonContent, IonFooter, IonIcon, useIonToast } from '@ionic/react'
import {
  chevronBack,
  heart,
  heartOutline,
  star,
  carOutline,
  shieldCheckmarkOutline,
  chatbubbleEllipsesOutline,
  checkmark,
} from 'ionicons/icons'
import ProductArt from '../../components/Shared/ProductArt'
import { useProducts } from '../../hooks/useProducts'
import { useCart } from '../../hooks/useCart'
import { formatCOP, SIZES } from '../../helpers/golshopData'
import styles from './Product.module.scss'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, loading } = useProducts()
  const { addToCart } = useCart()
  const [present] = useIonToast()

  const product = getProduct(id)
  const [size, setSize] = useState(null)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <IonPage>
        <IonContent>
          <div className={styles.notFound}>
            <p className={styles.notFoundTitle}>
              {loading ? 'Cargando…' : 'Producto no encontrado'}
            </p>
            {!loading && (
              <>
                <p className={styles.notFoundText}>Puede que ya no esté disponible.</p>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => navigate('/home', { replace: true })}
                >
                  Volver al inicio
                </button>
              </>
            )}
          </div>
        </IonContent>
      </IonPage>
    )
  }

  const singleSize = product.sizes.length === 1
  const chosen = singleSize ? product.sizes[0] : size

  const handleAdd = () => {
    if (!chosen) {
      present({ message: 'Elige una talla primero', duration: 1800, color: 'danger', position: 'top' })
      return
    }
    addToCart(product.id, chosen)
    setAdded(true)
    present({
      message: `${product.team} · Talla ${chosen} agregado al carrito`,
      duration: 2500,
      color: 'success',
      position: 'top',
      buttons: [{ text: 'Ver carrito', handler: () => navigate('/cart') }],
    })
  }

  return (
    <IonPage>
      <IonContent>
        <section className={styles.hero}>
          <div className={styles.topBar}>
            <button
              type="button"
              className={styles.glassBtn}
              aria-label="Volver"
              onClick={() => navigate(-1)}
            >
              <IonIcon icon={chevronBack} />
            </button>
            <button
              type="button"
              className={`${styles.glassBtn} ${liked ? styles.liked : ''}`}
              aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              aria-pressed={liked}
              onClick={() => setLiked((v) => !v)}
            >
              <IonIcon icon={liked ? heart : heartOutline} />
            </button>
          </div>
          <div className={styles.heroArt}>
            <ProductArt art={product.art} float />
          </div>
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
        </section>

        <section className={styles.content}>
          <div className={styles.titleRow}>
            <div className={styles.titleBox}>
              <p className={styles.team}>{product.team}</p>
              <h1 className={styles.name}>{product.name}</h1>
            </div>
            <span className={styles.rating}>
              <IonIcon icon={star} />
              {product.rating}
            </span>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.sizes}>
            <div className={styles.sizesHead}>
              <h2 className={styles.sizesTitle}>Selecciona tu talla</h2>
              <span className={styles.stock}>
                {product.stock <= 5
                  ? `¡Solo quedan ${product.stock}!`
                  : `${product.stock} disponibles`}
              </span>
            </div>
            <div className={styles.sizeList}>
              {(singleSize ? product.sizes : SIZES).map((s) => {
                const available = product.sizes.includes(s)
                const active = chosen === s
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={!available}
                    aria-pressed={active}
                    className={`${styles.sizeBtn} ${active ? styles.sizeActive : ''}`}
                    onClick={() => {
                      setSize(s)
                      setAdded(false)
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          <div className={styles.perks}>
            <div className={styles.perk}>
              <IonIcon icon={carOutline} className={styles.perkGreen} />
              <p>
                <strong>Envío 1-2 días</strong>a todo Colombia
              </p>
            </div>
            <div className={styles.perk}>
              <IonIcon icon={shieldCheckmarkOutline} className={styles.perkGold} />
              <p>
                <strong>100% original</strong>garantía oficial
              </p>
            </div>
          </div>

          <button type="button" className={styles.seller} onClick={() => navigate('/chat')}>
            <span className={styles.sellerAvatar}>TG</span>
            <span className={styles.sellerInfo}>
              <strong>Tienda Golazo</strong>
              <span>Vendedor verificado · Medellín</span>
            </span>
            <IonIcon icon={chatbubbleEllipsesOutline} className={styles.perkGreen} />
          </button>
        </section>
      </IonContent>

      <IonFooter className={`ion-no-border ${styles.footer}`}>
        <div className={styles.bar}>
          <div>
            {product.oldPrice && <p className={styles.oldPrice}>{formatCOP(product.oldPrice)}</p>}
            <p className={styles.price}>{formatCOP(product.price)}</p>
          </div>
          <button type="button" className={styles.addBtn} onClick={handleAdd}>
            {added ? (
              <>
                <IonIcon icon={checkmark} /> Agregado
              </>
            ) : (
              'Agregar al carrito'
            )}
          </button>
        </div>
      </IonFooter>
    </IonPage>
  )
}