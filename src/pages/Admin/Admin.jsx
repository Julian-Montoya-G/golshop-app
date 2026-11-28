import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IonPage, IonContent, IonIcon, useIonAlert, useIonToast } from '@ionic/react'
import {
  chevronBack,
  chevronForward,
  add,
  createOutline,
  trashOutline,
  cubeOutline,
  warningOutline,
  trendingUpOutline,
  chatbubblesOutline,
  receiptOutline,
  timeOutline,
  cashOutline,
} from 'ionicons/icons'
import ProductArt from '../../components/Shared/ProductArt'
import ProductForm from '../../components/Admin/ProductForm'
import Menu from '../../components/Shared/Menu'
import { useProducts } from '../../hooks/useProducts'
import { useAllOrders } from '../../hooks/useAllOrders'
import { deleteProduct, seedProducts } from '../../helpers/products'
import { ORDER_STATUSES, updateOrderStatus } from '../../helpers/orderStatus'
import { formatCOP } from '../../helpers/golshopData'
import { formatDate } from '../../helpers/helpers'
import styles from './Admin.module.scss'

function StatCard({ icon, value, label, gold = false }) {
  return (
    <div className={styles.stat}>
      <span className={`${styles.statIcon} ${gold ? styles.statGold : ''}`}>
        <IonIcon icon={icon} />
      </span>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const { products } = useProducts()
  const { orders, loading: loadingOrders } = useAllOrders()
  const [presentAlert] = useIonAlert()
  const [present] = useIonToast()

  const [tab, setTab] = useState('productos')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const toast = (message, color = 'success') =>
    present({ message, duration: 2000, color, position: 'top' })

  const lowStock = products.filter((p) => p.stock <= 5).length
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const toDispatch = orders.filter((o) => o.status === 'Preparando').length
  const sales = orders
    .filter((o) => o.status !== 'Cancelado')
    .reduce((sum, o) => sum + o.total, 0)

  const nextOrder = Math.min(0, ...products.map((p) => p.order ?? 0)) - 1

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setFormOpen(true)
  }

  const confirmDelete = (product) => {
    presentAlert({
      header: '¿Eliminar producto?',
      message: `${product.team} · ${product.name} dejará de aparecer en la tienda.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await deleteProduct(product.id)
              toast('Producto eliminado')
            } catch {
              toast('No se pudo eliminar.', 'danger')
            }
          },
        },
      ],
    })
  }

  const handleSeed = async () => {
    try {
      const n = await seedProducts()
      toast(`${n} productos de ejemplo cargados`)
    } catch {
      toast('No se pudieron cargar los productos.', 'danger')
    }
  }

  const changeStatus = async (order, status) => {
    if (order.status === status) return
    try {
      await updateOrderStatus(order.id, status)
      toast(`Pedido ${order.number}: ${status}`)
    } catch {
      toast('No se pudo cambiar el estado.', 'danger')
    }
  }

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
          <div className={styles.headerText}>
            <h1 className={styles.title}>Panel Admin</h1>
            <p className={styles.subtitle}>Tienda Golazo · Vendedor</p>
          </div>
          {tab === 'productos' && (
            <button
              type="button"
              className={styles.plus}
              aria-label="Crear producto"
              onClick={openCreate}
            >
              <IonIcon icon={add} />
            </button>
          )}
        </header>

        <div className={styles.body}>
          {tab === 'productos' ? (
            <div className={styles.stats}>
              <StatCard icon={cubeOutline} value={products.length} label="Productos" />
              <StatCard icon={warningOutline} value={lowStock} label="Stock bajo" gold />
              <StatCard
                icon={trendingUpOutline}
                value={`${(inventoryValue / 1_000_000).toFixed(1)}M`}
                label="Inventario"
              />
            </div>
          ) : (
            <div className={styles.stats}>
              <StatCard icon={receiptOutline} value={orders.length} label="Pedidos" />
              <StatCard icon={timeOutline} value={toDispatch} label="Por despachar" gold />
              <StatCard
                icon={cashOutline}
                value={`${(sales / 1_000_000).toFixed(1)}M`}
                label="Ventas"
              />
            </div>
          )}

          <button type="button" className={styles.linkCard} onClick={() => navigate('/admin/chats')}>
            <span className={styles.linkIcon}>
              <IonIcon icon={chatbubblesOutline} />
            </span>
            <span className={styles.linkText}>Bandeja de chats</span>
            <IonIcon icon={chevronForward} className={styles.chevron} />
          </button>

          <div className={styles.tabs}>
            {[
              ['productos', 'Productos'],
              ['pedidos', 'Pedidos'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`${styles.tab} ${tab === key ? styles.tabOn : ''}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'productos' && (
            <>
              <button type="button" className={styles.createBtn} onClick={openCreate}>
                <IonIcon icon={add} /> Crear producto
              </button>

              {products.length === 0 && (
                <div className={styles.empty}>
                  <p>Todavía no hay productos en la tienda.</p>
                  <button type="button" className={styles.ghost} onClick={handleSeed}>
                    Cargar productos de ejemplo
                  </button>
                </div>
              )}

              <div className={styles.list}>
                {products.map((p) => (
                  <article key={p.id} className={styles.row}>
                    <div className={styles.thumb}>
                      <ProductArt art={p.art} />
                    </div>
                    <div className={styles.rowInfo}>
                      <p className={styles.rowTeam}>{p.team}</p>
                      <p className={styles.rowName}>{p.name}</p>
                      <p className={styles.rowMeta}>
                        <strong>{formatCOP(p.price)}</strong>
                        <span className={p.stock <= 5 ? styles.low : ''}>Stock {p.stock}</span>
                      </p>
                    </div>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.edit}
                        aria-label={`Editar ${p.team}`}
                        onClick={() => openEdit(p)}
                      >
                        <IonIcon icon={createOutline} />
                      </button>
                      <button
                        type="button"
                        className={styles.remove}
                        aria-label={`Eliminar ${p.team}`}
                        onClick={() => confirmDelete(p)}
                      >
                        <IonIcon icon={trashOutline} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {tab === 'pedidos' && (
            <div className={styles.list}>
              {loadingOrders && <p className={styles.state}>Cargando pedidos…</p>}
              {!loadingOrders && orders.length === 0 && (
                <p className={styles.state}>Todavía no hay pedidos.</p>
              )}
              {orders.map((o) => (
                <article key={o.id} className={styles.order}>
                  <div className={styles.orderTop}>
                    <div>
                      <p className={styles.orderNum}>#{o.number}</p>
                      <p className={styles.orderMeta}>
                        {o.userName || 'Cliente'} · {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <p className={styles.orderTotal}>{formatCOP(o.total)}</p>
                  </div>
                  <p className={styles.orderItems}>
                    {o.items.map((it) => `${it.qty}× ${it.team} (${it.size})`).join(' · ')}
                  </p>
                  <div className={styles.statusRow}>
                    {ORDER_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`${styles.status} ${o.status === s ? styles.statusOn : ''}`}
                        onClick={() => changeStatus(o, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
              {orders.length > 0 && (
                <p className={styles.note}>
                  Al cancelar un pedido, el stock no se devuelve solo: ajústalo en el producto.
                </p>
              )}
            </div>
          )}
        </div>
      </IonContent>

      <ProductForm
        isOpen={formOpen}
        product={editing}
        nextOrder={nextOrder}
        onClose={() => setFormOpen(false)}
        onSaved={(msg) => toast(msg)}
      />
      <Menu />
    </IonPage>
  )
}