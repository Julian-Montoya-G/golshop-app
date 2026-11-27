import { useEffect, useRef, useState } from 'react'
import { IonPage, IonContent, IonFooter, IonIcon } from '@ionic/react'
import { chevronBack, send as sendIcon } from 'ionicons/icons'
import { useAuth } from '../../hooks/useAuth'
import { useChat } from '../../hooks/useChat'
import { sendMessage } from '../../helpers/chat'
import { formatDate, formatTime } from '../../helpers/helpers'
import styles from './ChatRoom.module.scss'

const dayKey = (ts) => ts?.toDate?.()?.toDateString() ?? ''
const dayLabel = (ts) => (dayKey(ts) === new Date().toDateString() ? 'Hoy' : formatDate(ts))

/**
 * from: lado de quien mira la sala. 'user' = cliente, 'seller' = vendedor.
 * footer: contenido extra debajo del campo de texto (por ejemplo, la barra inferior).
 */
export default function ChatRoom({
  chatId,
  from,
  title,
  subtitle,
  onBack,
  quickReplies = [],
  footer,
}) {
  const { user } = useAuth()
  const { messages, loading, error } = useChat(chatId)
  const [text, setText] = useState('')
  const [sendError, setSendError] = useState('')
  const contentRef = useRef(null)

  // Cada mensaje nuevo baja la conversación hasta el final
  useEffect(() => {
    contentRef.current?.scrollToBottom(250)
  }, [messages.length, loading])

  const submit = async (value) => {
    const clean = value.trim()
    if (!clean) return
    setSendError('')
    setText('')
    try {
      await sendMessage({ chatId, from, text: clean, sender: user })
    } catch {
      setText(clean)
      setSendError('No se pudo enviar el mensaje. Intenta de nuevo.')
    }
  }

  return (
    <IonPage>
      <IonContent ref={contentRef}>
        <header className={styles.header}>
          {onBack && (
            <button type="button" className={styles.back} aria-label="Volver" onClick={onBack}>
              <IonIcon icon={chevronBack} />
            </button>
          )}
          <span className={styles.avatar}>{(title || '?').trim().charAt(0).toUpperCase()}</span>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </header>

        <div className={styles.body}>
          {loading && <p className={styles.state}>Cargando conversación…</p>}
          {error && <p className={styles.state}>{error}</p>}
          {!loading && !error && messages.length === 0 && (
            <p className={styles.state}>Aún no hay mensajes. ¡Escribe el primero!</p>
          )}

          <div className={styles.messages}>
            {messages.map((m, i) => {
              const mine = m.from === from
              const newDay = i === 0 || dayKey(messages[i - 1].createdAt) !== dayKey(m.createdAt)
              return (
                <div key={m.id}>
                  {newDay && <p className={styles.day}>{dayLabel(m.createdAt)}</p>}
                  <div className={`${styles.row} ${mine ? styles.rowMine : ''}`}>
                    <div className={`${styles.bubble} ${mine ? styles.bubbleMine : styles.bubbleOther}`}>
                      <p className={styles.text}>{m.text}</p>
                      <p className={styles.time}>{formatTime(m.createdAt)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </IonContent>

      <IonFooter className={`ion-no-border ${styles.composer}`}>
        {quickReplies.length > 0 && (
          <div className={styles.chips}>
            {quickReplies.map((q) => (
              <button key={q} type="button" className={styles.chip} onClick={() => submit(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
        {sendError && <p className={styles.sendError}>{sendError}</p>}
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault()
            submit(text)
          }}
        >
          <input
            className={styles.input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe un mensaje…"
            aria-label="Mensaje"
            maxLength={500}
          />
          <button type="submit" className={styles.send} aria-label="Enviar" disabled={!text.trim()}>
            <IonIcon icon={sendIcon} />
          </button>
        </form>
      </IonFooter>

      {footer}
    </IonPage>
  )
}