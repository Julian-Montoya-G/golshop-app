import { useMemo, useState } from 'react'
import { IonPage, IonContent, IonIcon } from '@ionic/react'
import {
  notificationsOutline,
  searchOutline,
  closeOutline,
  optionsOutline,
} from 'ionicons/icons'
import GolShopLogo from '../../components/Shared/GolShopLogo'
import ProductArt from '../../components/Shared/ProductArt'
import Menu from '../../components/Shared/Menu'
import CardItem from '../../components/Index/CardItem'
import { useAuth } from '../../hooks/useAuth'
import { useProducts } from '../../hooks/useProducts'
import { SIZES, TEAM_FILTERS } from '../../helpers/golshopData'
import styles from './Index.module.scss'

function Chip({ active, onClick, gold = false, children }) {
  const classes = [
    styles.chip,
    gold && styles.chipGold,
    active && (gold ? styles.chipGoldActive : styles.chipActive),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  )
}

export default function Index() {
  const { user } = useAuth()
  const { products, loading, error } = useProducts()
  const [query, setQuery] = useState('')
  const [team, setTeam] = useState('Todos')
  const [size, setSize] = useState(null)

  const firstName = (user?.displayName || '').split(' ')[0] || 'hincha'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (team !== 'Todos' && p.team !== team) return false
      if (size && !p.sizes.includes(size)) return false
      if (q && !`${p.name} ${p.team}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [products, query, team, size])

  const promo = products.find((p) => p.id === 'colombia-local-2026')

  const clearFilters = () => {
    setQuery('')
    setTeam('Todos')
    setSize(null)
  }

  return (
    <IonPage>
      <IonContent>
        <header className={styles.header}>
          <GolShopLogo />
          <button type="button" className={styles.bell} aria-label="Notificaciones">
            <IonIcon icon={notificationsOutline} />
            <span className={styles.bellDot} />
          </button>
        </header>

        <div className={styles.greeting}>
          <p className={styles.hello}>Hola, {firstName}</p>
          <h1 className={styles.headline}>
            ¿Qué camiseta <span className={styles.accent}>sudamos</span> hoy?
          </h1>
        </div>

        <div className={styles.search}>
          <div className={styles.searchBox}>
            <IonIcon icon={searchOutline} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar equipo o camiseta…"
              aria-label="Buscar"
            />
            {query ? (
              <button
                type="button"
                className={styles.clear}
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
              >
                <IonIcon icon={closeOutline} />
              </button>
            ) : (
              <IonIcon icon={optionsOutline} className={styles.optionsIcon} />
            )}
          </div>

          <div className={styles.chips}>
            {TEAM_FILTERS.map((t) => (
              <Chip key={t} active={team === t} onClick={() => setTeam(t)}>
                {t}
              </Chip>
            ))}
          </div>

          <div className={styles.sizeRow}>
            <span className={styles.sizeLabel}>Talla</span>
            {SIZES.map((s) => (
              <Chip key={s} gold active={size === s} onClick={() => setSize(size === s ? null : s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>

        {promo && team === 'Todos' && !query && !size && (
          <div className={styles.promo}>
            <div className={styles.promoText}>
              <p className={styles.promoKicker}>Mundial 2026</p>
              <p className={styles.promoOff}>15% OFF</p>
              <p className={styles.promoSub}>en la nueva de la Selección</p>
            </div>
            <div className={styles.promoArt}>
              <ProductArt art={promo.art} />
            </div>
          </div>
        )}

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{team === 'Todos' ? 'Destacados' : team}</h2>
            <span className={styles.count}>{filtered.length} productos</span>
          </div>

          {loading && <p className={styles.state}>Cargando catálogo…</p>}
          {error && <p className={styles.state}>{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Fuera de lugar</p>
              <p className={styles.emptyText}>
                {products.length === 0
                  ? 'Todavía no hay productos en el catálogo.'
                  : 'No encontramos productos con esos filtros.'}
              </p>
              {products.length > 0 && (
                <button type="button" className={styles.emptyLink} onClick={clearFilters}>
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          <div className={styles.grid}>
            {filtered.map((p, i) => (
              <CardItem key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      </IonContent>
      <Menu />
    </IonPage>
  )
}