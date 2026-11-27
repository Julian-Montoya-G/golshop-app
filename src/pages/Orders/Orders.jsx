import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IonPage, IonContent, IonIcon } from '@ionic/react'
import {
  chevronBack,
  checkmarkCircleOutline,
  timeOutline,
  carOutline,
  closeCircleOutline,
  cubeOutline,
} from 'ionicons/icons'
import ProductArt from '../../components/Shared/ProductArt'
import Menu from '../../components/Shared/Menu'
import { useOrders } from '../../hooks/useOrders'
import { formatCOP } from '../../helpers/golshopData'
import { formatDate } from '../../helpers/helpers'
import styles from './Orders.module.scss'

const STATUS = {
  Entregado: { cls: styles.statusDone, icon: checkmarkCircleOutline, progress: 100 },
  'En camino': { cls: styles.statusShip, icon: carOutline, progress: 66 },
  Preparando: { cls: styles.statusPrep, icon: timeOutline, progress: 33 },
  Cancelado: { cls: styles.statusCancel, icon: closeCircleOutline, progress: 0 },
}

const TABS = ['Todos', 'Activos', 'Entregados']

export default function Orders() {
  const navigate = useNavigate()
  const { orders, loading, error } = useOrders()
  const [tab, setTab] = useState('Todos')

  const visible = orders.filter((o) =>
    tab === 'Todos'
      ? true
      : tab === 'Activos'
        ? o.status === 'En camino' || o.status === 'Preparando'
        : o.status === 'Entregado'
  )

  return (
    <IonPage>
      <IonContent>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.back}
            aria-label="Volver"
            onClick={() => navigate('/profile', { replace: true })}
          >
            <IonIcon icon={chevronBack} />
          </button>
          <div>
            <h1 className={styles.title}>Mis pedidos</h1>
            <p className={styles.subtitle}>{orders.length} pedidos realizados</p>
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.tabs}>
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {loading && <p className={styles.state}>Cargando pedidos…</p>}
          {error && <p className={styles.state}>{error}</p>}

          <div className={styles.list}>
            {visible.map((order, i) => {
              const st = STATUS[order.status] || STATUS.Preparando
              const qty = order.items.reduce((n, it) => n + it.qty, 0)
              const teams = [...new Set(order.items.map((it) => it.team))].join(' · ')
              const active = order.status === 'En camino' || order.status === 'Preparando'

              return (
                <article
                  key={order.id}
                  className={styles.card}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={styles.cardTop}>
                    <div>
                      <p className={styles.number}>#{order.number}</p>
                      <p className={styles.date}>{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`${styles.status} ${st.cls}`}>
                      <IonIcon icon={st.icon} />
                      {order.status}
                    </span>
                  </div>

                  <div className={styles.items}>
                    {order.items.map((it) => (
                      <div key={`${it.productId}-${it.size}`} className={styles.thumb}>
                        <ProductArt art={it.art} />
                      </div>
                    ))}
                    <p className={styles.itemsText}>
                      {teams}
                      <span>
                        {qty} {qty === 1 ? 'artículo' : 'artículos'}
                      </span>
                    </p>
                    <p className={styles.total}>{formatCOP(order.total)}</p>
                  </div>

                  {active && (
                    <div className={styles.progress}>
                      <div className={styles.bar}>
                        <div className={styles.barFill} style={{ width: `${st.progress}%` }} />
                      </div>
                      <div className={styles.steps}>
                        <span className={styles.stepOn}>Confirmado</span>
                        <span className={st.progress >= 33 ? styles.stepOn : ''}>Preparando</span>
                        <span className={st.progress >= 66 ? styles.stepOn : ''}>En camino</span>
                        <span>Entregado</span>
                      </div>
                    </div>
                  )}

                  {order.status === 'Entregado' && (
                    <p className={styles.delivered}>
                      <IonIcon icon={cubeOutline} /> Pedido entregado
                    </p>
                  )}
                </article>
              )
            })}

            {!loading && visible.length === 0 && (
              <p className={styles.state}>No hay pedidos en esta sección.</p>
            )}
          </div>
        </div>
      </IonContent>
      <Menu />
    </IonPage>
  )
}