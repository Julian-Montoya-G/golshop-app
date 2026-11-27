import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IonPage, IonContent, IonIcon, useIonToast } from '@ionic/react'
import {
  trashOutline,
  add,
  remove,
  bagOutline,
  carOutline,
  checkmarkCircle,
} from 'ionicons/icons'
import ProductArt from '../../components/Shared/ProductArt'
import Menu from '../../components/Shared/Menu'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { createOrder } from '../../helpers/orders'
import { FREE_SHIPPING_FROM, formatCOP } from '../../helpers/golshopData'
import styles from './Cart.module.scss'

function Row({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  )
}

export default function Cart() {
  const { user } = useAuth()
  const { lines, cartCount, subtotal, shipping, total, setQty, removeFromCart, clearCart } =
    useCart()
  const navigate = useNavigate()
  const [present] = useIonToast()
  const [buying, setBuying] = useState(false)
  const [orderNumber, setOrderNumber] = useState(null)

  const missingForFree = Math.max(0, FREE_SHIPPING_FROM - subtotal)

  const handleBuy = async () => {
    setBuying(true)
    try {
      const order = await createOrder({ user, lines })
      await clearCart()
      setOrderNumber(order.number)
    } catch (e) {
      // Los errores que lanzamos nosotros traen un mensaje claro; los de Firebase, no
      const known =
        e instanceof Error && !e.code && !e.message.startsWith('Firebase')
          ? e.message
          : 'No se pudo completar la compra. Intenta de nuevo.'
      present({ message: known, duration: 3000, color: 'danger', position: 'top' })
    } finally {
      setBuying(false)
    }
  }

  if (orderNumber) {
    return (
      <IonPage>
        <IonContent>
          <div className={styles.success}>
            <span className={styles.successIcon}>
              <IonIcon icon={checkmarkCircle} />
            </span>
            <h1 className={styles.successTitle}>¡Golazo!</h1>
            <p className={styles.successText}>
              Tu pedido <strong>{orderNumber}</strong> fue confirmado. Te avisaremos cuando salga
              para tu casa.
            </p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/orders', { replace: true })}
            >
              Ver mis pedidos
            </button>
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => navigate('/home', { replace: true })}
            >
              Seguir comprando
            </button>
          </div>
        </IonContent>
        <Menu />
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonContent>
        <header className={styles.header}>
          <h1 className={styles.title}>Mi carrito</h1>
          <p className={styles.subtitle}>
            {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
          </p>
        </header>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <IonIcon icon={bagOutline} />
            </span>
            <p className={styles.emptyTitle}>Tu carrito está vacío</p>
            <p className={styles.emptyText}>Ponte la camiseta: agrega algo de tu equipo.</p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/home', { replace: true })}
            >
              Explorar camisetas
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {lines.map(({ product: p, size, qty }) => (
              <article key={`${p.id}-${size}`} className={styles.item}>
                <button
                  type="button"
                  className={styles.itemArt}
                  onClick={() => navigate(`/product/${p.id}`)}
                  aria-label={`Ver ${p.team}`}
                >
                  <ProductArt art={p.art} />
                </button>

                <div className={styles.itemInfo}>
                  <div className={styles.itemTop}>
                    <div className={styles.itemText}>
                      <p className={styles.itemTeam}>{p.team}</p>
                      <h3 className={styles.itemName}>{p.name}</h3>
                      <p className={styles.itemSize}>Talla {size}</p>
                    </div>
                    <button
                      type="button"
                      className={styles.trash}
                      aria-label={`Eliminar ${p.team}`}
                      onClick={() => removeFromCart(p.id, size)}
                    >
                      <IonIcon icon={trashOutline} />
                    </button>
                  </div>

                  <div className={styles.itemBottom}>
                    <p className={styles.itemPrice}>{formatCOP(p.price * qty)}</p>
                    <div className={styles.qty}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        aria-label="Restar uno"
                        onClick={() => setQty(p.id, size, qty - 1)}
                      >
                        <IonIcon icon={remove} />
                      </button>
                      <span className={styles.qtyNum}>{qty}</span>
                      <button
                        type="button"
                        className={`${styles.qtyBtn} ${styles.qtyPlus}`}
                        aria-label="Sumar uno"
                        onClick={() => setQty(p.id, size, qty + 1)}
                      >
                        <IonIcon icon={add} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <div className={styles.shipNote}>
              <IonIcon icon={carOutline} />
              {missingForFree > 0 ? (
                <p>
                  Te faltan <strong>{formatCOP(missingForFree)}</strong> para envío gratis
                </p>
              ) : (
                <p>
                  <strong>¡Tienes envío gratis!</strong>
                </p>
              )}
            </div>

            <section className={styles.summary}>
              <Row label="Subtotal" value={formatCOP(subtotal)} />
              <Row label="Envío" value={shipping === 0 ? 'Gratis' : formatCOP(shipping)} />
              <div className={styles.divider} />
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{formatCOP(total)}</span>
              </div>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleBuy}
                disabled={buying}
              >
                {buying ? 'Procesando…' : `Comprar · ${formatCOP(total)}`}
              </button>
            </section>
          </div>
        )}
      </IonContent>
      <Menu />
    </IonPage>
  )
}