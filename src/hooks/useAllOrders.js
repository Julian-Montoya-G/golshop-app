import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../helpers/firebase'

export function useAllOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    return onSnapshot(
      collection(db, 'orders'),
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))
          .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
        setOrders(list)
        setLoading(false)
      },
      () => {
        setError('No se pudieron cargar los pedidos.')
        setLoading(false)
      }
    )
  }, [])

  return { orders, loading, error }
}