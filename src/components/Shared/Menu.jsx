import { IonFooter, IonIcon } from '@ionic/react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  home,
  homeOutline,
  bag,
  bagOutline,
  chatbubble,
  chatbubbleOutline,
  person,
  personOutline,
} from 'ionicons/icons'
import styles from './Menu.module.scss'
import { useCart } from '../../hooks/useCart'

const TABS = [
  { path: '/home', label: 'Inicio', icon: homeOutline, iconActive: home, match: ['/home', '/product'] },
  { path: '/cart', label: 'Carrito', icon: bagOutline, iconActive: bag, match: ['/cart'] },
  { path: '/chat', label: 'Chat', icon: chatbubbleOutline, iconActive: chatbubble, match: ['/chat'] },
  {
    path: '/profile',
    label: 'Perfil',
    icon: personOutline,
    iconActive: person,
    match: ['/profile', '/orders', '/admin'],
  },
]

export default function Menu() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { cartCount } = useCart()

  return (
    <IonFooter className={`ion-no-border ${styles.footer}`}>
      <nav className={styles.nav}>
        {TABS.map((tab) => {
          const active = tab.match.some((m) => pathname.startsWith(m))
          return (
            <button
              key={tab.path}
              type="button"
              className={`${styles.tab} ${active ? styles.tabActive : ''}`}
              onClick={() => navigate(tab.path, { replace: true })}
            >
              <span className={styles.iconWrap}>
                <IonIcon icon={active ? tab.iconActive : tab.icon} />
                                {tab.path === '/cart' && cartCount > 0 && (
                  <span className={styles.badge}>{cartCount}</span>
                )}
              </span>
              {tab.label}
            </button>
          )
        })}
      </nav>
    </IonFooter>
  )
}