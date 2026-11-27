import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../helpers/firebase'

export function useChat(chatId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!chatId) {
      setMessages([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')

    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setMessages(
          snap.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))
        )
        setLoading(false)
      },
      () => {
        setError('No se pudo cargar la conversación.')
        setLoading(false)
      }
    )
    return unsubscribe
  }, [chatId])

  return { messages, loading, error }
}