import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../helpers/firebase'
import { useAuth } from './useAuth'

export function useOrders() {
  const { user } = useAuth()
  const uid = user?.uid
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!uid) {
      setOrders([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')

    // Solo filtramos por usuario y ordenamos aquí, así no hace falta crear un índice en Firebase
    const q = query(collection(db, 'orders'), where('userId', '==', uid))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))
          .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
        setOrders(list)
        setLoading(false)
      },
      () => {
        setError('No se pudieron cargar tus pedidos.')
        setLoading(false)
      }
    )
    return unsubscribe
  }, [uid])

  return { orders, loading, error }
}