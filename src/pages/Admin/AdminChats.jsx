import { useNavigate } from 'react-router-dom'
import { IonPage, IonContent, IonIcon } from '@ionic/react'
import { chevronBack } from 'ionicons/icons'
import Menu from '../../components/Shared/Menu'
import { useChats } from '../../hooks/useChats'
import { formatDate, formatTime } from '../../helpers/helpers'
import styles from './AdminChats.module.scss'

const isToday = (ts) => ts?.toDate?.()?.toDateString() === new Date().toDateString()

export default function AdminChats() {
  const navigate = useNavigate()
  const { chats, loading, error } = useChats()

  return (
    <IonPage>
      <IonContent>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.back}
            aria-label="Volver"
            onClick={() => navigate('/admin', { replace: true })}
          >
            <IonIcon icon={chevronBack} />
          </button>
          <div>
            <h1 className={styles.title}>Bandeja de chats</h1>
            <p className={styles.subtitle}>{chats.length} conversaciones</p>
          </div>
        </header>

        <div className={styles.list}>
          {loading && <p className={styles.state}>Cargando…</p>}
          {error && <p className={styles.state}>{error}</p>}
          {!loading && !error && chats.length === 0 && (
            <p className={styles.state}>Todavía no hay conversaciones.</p>
          )}

          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              className={styles.item}
              onClick={() => navigate(`/admin/chats/${chat.id}`)}
            >
              <span className={styles.avatar}>
                {(chat.userName || '?').trim().charAt(0).toUpperCase()}
              </span>
              <span className={styles.info}>
                <span className={styles.name}>{chat.userName || 'Cliente'}</span>
                <span className={styles.last}>
                  {chat.lastFrom === 'seller' ? 'Tú: ' : ''}
                  {chat.lastMessage}
                </span>
              </span>
              <span className={styles.time}>
                {isToday(chat.lastAt) ? formatTime(chat.lastAt) : formatDate(chat.lastAt)}
              </span>
            </button>
          ))}
        </div>
      </IonContent>
      <Menu />
    </IonPage>
  )
}