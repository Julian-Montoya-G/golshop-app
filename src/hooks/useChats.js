import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../helpers/firebase'

export function useChats() {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('lastAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setChats(snap.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) })))
        setLoading(false)
      },
      () => {
        setError('No se pudieron cargar los chats.')
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  return { chats, loading, error }
}